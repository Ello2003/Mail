import { Attachment, CategoryType, EmailItem, LineItem, PaymentStatus } from "../types";

export async function parseEmailFile(
  file: File,
  accountId: string,
  accountName: string
): Promise<EmailItem> {
  const text = await file.text();

  // Try calling the server-side parser if available, or fall back to client parser
  try {
    const response = await fetch("/api/mail/parse-eml", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rawContent: text,
        filename: file.name,
        accountId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        id: data.id || `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        accountId,
        accountName,
        sender: data.sender || "Unknown Sender",
        senderEmail: data.sender || "unknown@mail.com",
        recipient: "me@applemail.local",
        subject: data.subject || file.name.replace(/\.[^/.]+$/, ""),
        date: data.date || new Date().toISOString().split("T")[0],
        category: (data.category as CategoryType) || "invoices",
        vendor: data.vendor || "Unknown Vendor",
        amount: data.amount !== undefined ? data.amount : null,
        currency: data.currency || "USD",
        invoiceNumber: data.invoiceNumber || null,
        paymentStatus: (data.paymentStatus as PaymentStatus) || "paid",
        paymentMethod: data.paymentMethod || "Direct Payment",
        taxAmount: data.taxAmount || 0,
        taxDeductible: data.taxDeductible ?? true,
        attachments: (data.attachments || []).map((att: any, idx: number) => ({
          id: att.id || `att-${Date.now()}-${idx}`,
          filename: att.filename,
          size: att.size || file.size,
          mimeType: att.mimeType || "application/octet-stream",
          extension: att.extension || "pdf",
          previewType: (att.extension === "pdf" ? "pdf" : att.extension === "png" || att.extension === "jpg" ? "image" : "document") as any,
          previewContent: `Extracted attachment from ${file.name}`,
        })),
        snippet: data.snippet || text.slice(0, 180).replace(/\s+/g, " "),
        fullBody: data.fullBody || text.slice(0, 5000),
        lineItems: (data.lineItems as LineItem[]) || (data.amount ? [{ description: data.subject || file.name, total: data.amount }] : []),
        isStarred: false,
        aiAnalyzed: data.aiPowered ?? false,
      };
    }
  } catch (err) {
    console.warn("Server parse failed, fallback to pure client parsing:", err);
  }

  // Pure client-side parsing fallback
  const lines = text.split(/\r?\n/);
  let subject = file.name.replace(/\.[^/.]+$/, "");
  let sender = "Sender <mail@example.com>";
  let date = new Date().toISOString().split("T")[0];
  let bodyStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    const line = lines[i];
    if (line === "") {
      bodyStartIndex = i + 1;
      break;
    }
    const lower = line.toLowerCase();
    if (lower.startsWith("subject:")) {
      subject = line.substring(8).trim();
    } else if (lower.startsWith("from:")) {
      sender = line.substring(5).trim();
    } else if (lower.startsWith("date:")) {
      const parsedDate = new Date(line.substring(5).trim());
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split("T")[0];
      }
    }
  }

  const body = lines.slice(bodyStartIndex).join("\n") || text;
  
  // Extract amount
  let amount: number | null = null;
  let currency = "USD";
  const amountMatch = body.match(/[\$€£]\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/) ||
                      body.match(/total[:\s]+[\$€£]?\s?([0-9]+(?:\.[0-9]{2})?)/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ""));
    if (body.includes("€")) currency = "EUR";
    if (body.includes("£")) currency = "GBP";
  }

  // Invoice Number
  const invMatch = body.match(/(?:invoice|order|receipt)(?:\s*(?:#|no\.?|id)?:?\s*)([A-Z0-9\-_]{4,20})/i);
  const invoiceNumber = invMatch ? invMatch[1] : null;

  // Category heuristics
  let category: CategoryType = "invoices";
  const combined = `${subject} ${body}`.toLowerCase();
  if (/flight|hotel|uber|lyft|travel|airline/i.test(combined)) category = "travel";
  else if (/tax|1099|w-2|dividend|financial|statement/i.test(combined)) category = "tax";
  else if (/contract|nda|agreement|signed/i.test(combined)) category = "contracts";
  else if (/shipped|delivered|order confirmation|amazon/i.test(combined)) category = "purchases";

  // Vendor extraction
  let vendor = sender.split("<")[0].replace(/["']/g, "").trim() || "Imported Vendor";
  if (/apple/i.test(combined)) vendor = "Apple";
  else if (/amazon/i.test(combined)) vendor = "Amazon";
  else if (/google/i.test(combined)) vendor = "Google";
  else if (/adobe/i.test(combined)) vendor = "Adobe";

  // Check attachments
  const attachments: Attachment[] = [];
  const attachmentMatches = [...text.matchAll(/filename=["']?([^"'\r\n]+)["']?/gi)];
  attachmentMatches.forEach((m, idx) => {
    const filename = m[1];
    const ext = filename.split(".").pop()?.toLowerCase() || "pdf";
    attachments.push({
      id: `att-import-${Date.now()}-${idx}`,
      filename,
      size: Math.floor(Math.random() * 200000 + 40000),
      mimeType: ext === "pdf" ? "application/pdf" : "application/octet-stream",
      extension: ext,
      previewType: (ext === "pdf" ? "pdf" : "document") as any,
      previewContent: `Attachment: ${filename}\nImported from ${file.name}`,
    });
  });

  if (attachments.length === 0 && (category === "invoices" || amount !== null)) {
    // Generate synthetic receipt attachment for convenience
    attachments.push({
      id: `att-synth-${Date.now()}`,
      filename: `${vendor.replace(/\s+/g, "_")}_Receipt_${invoiceNumber || "E-Invoice"}.pdf`,
      size: 112000,
      mimeType: "application/pdf",
      extension: "pdf",
      previewType: "pdf",
      previewContent: `Invoice from ${vendor}\nAmount: ${currency} ${amount || 0}\nDate: ${date}\nSubject: ${subject}`,
    });
  }

  return {
    id: `mail-import-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    accountId,
    accountName,
    sender,
    senderEmail: sender,
    recipient: "me@applemail.local",
    subject,
    date,
    category,
    vendor,
    amount,
    currency,
    invoiceNumber,
    paymentStatus: "paid",
    paymentMethod: "Apple Pay / Credit Card",
    taxAmount: amount ? +(amount * 0.0825).toFixed(2) : 0,
    taxDeductible: true,
    attachments,
    snippet: body.slice(0, 160).replace(/\s+/g, " ").trim(),
    fullBody: body.slice(0, 4000),
    lineItems: amount ? [{ description: subject, total: amount }] : [],
    isStarred: false,
    aiAnalyzed: false,
  };
}
