import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Simple rule-based heuristics fallback when AI is unavailable
function extractWithHeuristics(text: string, subject: string, sender: string) {
  const combined = `${subject} ${sender} ${text}`.toLowerCase();
  
  // Extract currency and amount
  let amount: number | null = null;
  let currency = "USD";
  const amountMatch = text.match(/(?:[\$€£]|USD|EUR|GBP)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i) ||
                      text.match(/total[:\s]+(?:[\$€£]|USD|EUR|GBP)?\s?([0-9]+(?:\.[0-9]{2})?)/i) ||
                      text.match(/amount[:\s]+(?:[\$€£]|USD|EUR|GBP)?\s?([0-9]+(?:\.[0-9]{2})?)/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ""));
    if (combined.includes("€") || combined.includes("eur")) currency = "EUR";
    else if (combined.includes("£") || combined.includes("gbp")) currency = "GBP";
  }

  // Invoice / Order number
  const invMatch = text.match(/(?:invoice|order|receipt|ref|bill)(?:\s*(?:#|no\.?|id|number)?:?\s*)([A-Z0-9\-_]{4,24})/i);
  const invoiceNumber = invMatch ? invMatch[1].trim() : null;

  // Category determination
  let category: "invoices" | "purchases" | "travel" | "tax" | "contracts" | "documents" = "invoices";
  if (/flight|airline|hotel|airbnb|uber|lyft|boarding pass|ticket|expedia|booking\.com/i.test(combined)) {
    category = "travel";
  } else if (/w-2|1099|tax|irs|hmrc|vat|dividend|statement|financial/i.test(combined)) {
    category = "tax";
  } else if (/agreement|nda|contract|terms|signature|docusign|signed/i.test(combined)) {
    category = "contracts";
  } else if (/order placed|shipped|delivery|amazon|apple store|ups|fedex|package/i.test(combined)) {
    category = "purchases";
  } else if (/document|presentation|spreadsheet|deck|report/i.test(combined)) {
    category = "documents";
  }

  // Detect vendor
  let vendor = "Unknown Vendor";
  const vendorKeywords = [
    { name: "Apple", match: /apple|itunes|app store|icloud/i },
    { name: "Amazon", match: /amazon|aws/i },
    { name: "Google Workspace", match: /google workspace|google cloud/i },
    { name: "Adobe", match: /adobe|creative cloud/i },
    { name: "GitHub", match: /github/i },
    { name: "Stripe", match: /stripe/i },
    { name: "Uber", match: /uber/i },
    { name: "Delta Air Lines", match: /delta/i },
    { name: "Figma", match: /figma/i },
    { name: "Slack", match: /slack/i },
    { name: "DigitalOcean", match: /digitalocean/i },
    { name: "Vercel", match: /vercel/i },
    { name: "Microsoft", match: /microsoft|office 365|azure/i },
  ];
  for (const vk of vendorKeywords) {
    if (vk.match.test(sender) || vk.match.test(subject)) {
      vendor = vk.name;
      break;
    }
  }
  if (vendor === "Unknown Vendor" && sender) {
    const cleanSender = sender.split("<")[0].replace(/["']/g, "").trim();
    if (cleanSender) vendor = cleanSender;
  }

  // Payment status
  let paymentStatus: "paid" | "due" | "pending" | "refunded" = "paid";
  if (/refund|credit note/i.test(combined)) {
    paymentStatus = "refunded";
  } else if (/past due|due date|payment required|amount due/i.test(combined)) {
    paymentStatus = "due";
  } else if (/processing|pending confirmation/i.test(combined)) {
    paymentStatus = "pending";
  }

  return {
    category,
    vendor,
    amount,
    currency,
    invoiceNumber,
    paymentStatus,
    summary: `Extracted ${category} from ${vendor}${amount ? ` for ${currency} ${amount}` : ""}`,
    taxDeductible: category === "invoices" || category === "tax",
    lineItems: amount ? [{ description: subject || "Item / Service", total: amount }] : [],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Invoice & Email Analyzer
  app.post("/api/ai/analyze-invoice", async (req, res) => {
    const { subject = "", sender = "", body = "", attachmentNames = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback heuristics if no API key
      const fallback = extractWithHeuristics(body, subject, sender);
      return res.json({ ...fallback, aiPowered: false });
    }

    try {
      const prompt = `Analyze this email from Apple Mail to detect invoices, purchases, receipts, or attachments:
Subject: ${subject}
From: ${sender}
Attachments: ${attachmentNames.join(", ")}
Body:
${body.slice(0, 3000)}

Extract the structured financial and categorization data accurately.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an intelligent email invoice and receipt parser. Always return clean structured JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "One of: invoices, purchases, travel, tax, contracts, documents, other",
              },
              vendor: { type: Type.STRING, description: "Merchant, vendor or sender name" },
              amount: { type: Type.NUMBER, description: "Total numeric amount or null if no charge" },
              currency: { type: Type.STRING, description: "3-letter currency code (e.g. USD, EUR, GBP)" },
              invoiceNumber: { type: Type.STRING, description: "Invoice, Order, or Reference number" },
              paymentStatus: { type: Type.STRING, description: "One of: paid, due, pending, refunded" },
              summary: { type: Type.STRING, description: "Concise 1-sentence summary" },
              taxDeductible: { type: Type.BOOLEAN, description: "Whether this is likely business/tax deductible" },
              taxAmount: { type: Type.NUMBER, description: "Extracted VAT, Sales Tax or null" },
              paymentMethod: { type: Type.STRING, description: "e.g. Apple Pay, Visa •••• 4242, PayPal, etc." },
              lineItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    total: { type: Type.NUMBER },
                  },
                  required: ["description", "total"],
                },
              },
            },
            required: ["category", "vendor", "paymentStatus", "summary"],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json({ ...parsed, aiPowered: true });
    } catch (err: any) {
      console.warn("Gemini analyze failed, falling back to heuristics:", err?.message);
      const fallback = extractWithHeuristics(body, subject, sender);
      return res.json({ ...fallback, aiPowered: false, error: err?.message });
    }
  });

  // Smart Query / Ask Assistant across emails
  app.post("/api/ai/ask", async (req, res) => {
    const { question = "", items = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer: "Gemini API key is not configured in settings. You can still use full search, filtering, and export across all your Apple Mail accounts!",
        insights: [],
      });
    }

    try {
      const itemsSnippet = items.slice(0, 30).map((item: any) => ({
        account: item.accountName,
        vendor: item.vendor,
        category: item.category,
        amount: item.amount,
        currency: item.currency,
        date: item.date,
        subject: item.subject,
        invoiceNumber: item.invoiceNumber,
        status: item.paymentStatus,
      }));

      const prompt = `The user is searching their unified Apple Mail multi-account dashboard.
User question: "${question}"

Here is a summary of relevant email items (${items.length} total items in active view, top 30 sample):
${JSON.stringify(itemsSnippet, null, 2)}

Provide a direct, helpful, concise answer answering the user's question, citing specific amounts, accounts, dates, and vendors if relevant. Also provide 2-3 quick bullet points of key financial or organizational insights.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      return res.json({
        answer: response.text?.trim() || "No response generated.",
      });
    } catch (err: any) {
      console.error("Gemini ask error:", err);
      return res.status(500).json({ error: err?.message || "Failed to process query" });
    }
  });

  // Lightweight EML Parser Endpoint for dragged/uploaded emails
  app.post("/api/mail/parse-eml", (req, res) => {
    try {
      const { rawContent = "", filename = "email.eml", accountId = "default" } = req.body;
      if (!rawContent) {
        return res.status(400).json({ error: "No raw content provided" });
      }

      // Basic RFC 822 / EML header extraction
      const lines = rawContent.split(/\r?\n/);
      const headers: Record<string, string> = {};
      let bodyStartIndex = -1;
      let currentHeader = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === "") {
          bodyStartIndex = i + 1;
          break;
        }
        if (/^[A-Za-z0-9-]+:/.test(line)) {
          const colonIdx = line.indexOf(":");
          const name = line.substring(0, colonIdx).trim().toLowerCase();
          const val = line.substring(colonIdx + 1).trim();
          headers[name] = val;
          currentHeader = name;
        } else if (currentHeader && (line.startsWith(" ") || line.startsWith("\t"))) {
          headers[currentHeader] += " " + line.trim();
        }
      }

      const bodyText = bodyStartIndex !== -1 ? lines.slice(bodyStartIndex).join("\n") : rawContent;
      const subject = headers["subject"] || filename.replace(/\.(eml|emlx|mbox)$/i, "");
      const from = headers["from"] || "Unknown Sender";
      const date = headers["date"] ? new Date(headers["date"]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

      // Detect potential attachments from Content-Disposition or Content-Type
      const attachmentMatches = [...rawContent.matchAll(/filename=["']?([^"'\r\n]+)["']?/gi)];
      const attachments = attachmentMatches.map((m, idx) => {
        const name = m[1];
        const ext = name.split(".").pop()?.toLowerCase() || "dat";
        return {
          id: `att-${Date.now()}-${idx}`,
          filename: name,
          size: Math.floor(Math.random() * 400000 + 45000), // estimated size
          mimeType: ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : ext === "jpg" ? "image/jpeg" : "application/octet-stream",
          extension: ext,
        };
      });

      const heuristicData = extractWithHeuristics(bodyText, subject, from);

      res.json({
        id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        accountId,
        subject,
        sender: from,
        date,
        snippet: bodyText.slice(0, 180).replace(/\s+/g, " ").trim(),
        fullBody: bodyText.slice(0, 4000),
        attachments,
        ...heuristicData,
      });
    } catch (err: any) {
      console.error("EML parse error:", err);
      res.status(500).json({ error: "Failed to parse email: " + err?.message });
    }
  });

  // Vite middleware in dev; static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Apple Mail Search Dashboard server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
