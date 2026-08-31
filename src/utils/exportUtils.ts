import JSZip from "jszip";
import { EmailItem, EmailAccount } from "../types";

// Trigger a browser file download from string or blob
export function downloadFile(content: Blob | string, filename: string, mimeType: string) {
  const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Format currency
export function formatCurrency(amount: number | null, currency = "USD"): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Export items to structured CSV
export function exportToCsv(items: EmailItem[]): void {
  const headers = [
    "Date",
    "Account",
    "Vendor",
    "Category",
    "Subject",
    "Invoice / Order #",
    "Amount",
    "Currency",
    "Tax Amount",
    "Payment Status",
    "Payment Method",
    "Tax Deductible",
    "Attachments Count",
    "Attachment Filenames",
  ];

  const rows = items.map((item) => {
    const attachmentNames = item.attachments.map((a) => a.filename).join("; ");
    return [
      `"${item.date}"`,
      `"${item.accountName.replace(/"/g, '""')}"`,
      `"${item.vendor.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.subject.replace(/"/g, '""')}"`,
      `"${(item.invoiceNumber || item.orderId || "").replace(/"/g, '""')}"`,
      item.amount !== null ? item.amount.toFixed(2) : "",
      `"${item.currency || "USD"}"`,
      item.taxAmount !== null && item.taxAmount !== undefined ? item.taxAmount.toFixed(2) : "",
      `"${item.paymentStatus}"`,
      `"${(item.paymentMethod || "").replace(/"/g, '""')}"`,
      item.taxDeductible ? "Yes" : "No",
      item.attachments.length.toString(),
      `"${attachmentNames.replace(/"/g, '""')}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const dateStr = new Date().toISOString().split("T")[0];
  downloadFile(csvContent, `AppleMail_Expense_Report_${dateStr}.csv`, "text/csv;charset=utf-8;");
}

// Export items to JSON
export function exportToJson(items: EmailItem[]): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const payload = {
    exportedAt: new Date().toISOString(),
    totalItems: items.length,
    totalSpend: items.reduce((sum, i) => sum + (i.amount || 0), 0),
    items: items,
  };
  const jsonContent = JSON.stringify(payload, null, 2);
  downloadFile(jsonContent, `AppleMail_Unified_Export_${dateStr}.json`, "application/json");
}

// Generate a clean, printable PDF / Print Expense Summary
export function exportReportPrint(items: EmailItem[], accounts: EmailAccount[]): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalSpend = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const taxDeductibleSpend = items
    .filter((i) => i.taxDeductible)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  items.forEach((item) => {
    const cat = item.category;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.amount || 0);
  });

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Apple Mail Unified Invoice & Expense Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; background: #fff; }
    h1 { font-size: 24px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
    .card-val { font-size: 22px; font-weight: 700; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th { text-align: left; background: #f1f5f9; padding: 10px 12px; font-weight: 600; color: #475569; border-bottom: 2px solid #cbd5e1; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) { background-color: #fafafa; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: #e2e8f0; color: #334155; }
    .badge-paid { background: #dcfce7; color: #166534; }
    .badge-due { background: #fee2e2; color: #991b1b; }
    .actions { margin-bottom: 20px; }
    .btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
    @media print { .actions { display: none; } body { padding: 15px; } }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <h1>Unified Apple Mail Expense & Invoice Report</h1>
  <div class="subtitle">Generated on ${dateStr} • Filtered Items: ${items.length} records across ${accounts.length} accounts</div>

  <div class="metrics">
    <div class="card">
      <div class="card-label">Total Spend Tracked</div>
      <div class="card-val">${formatCurrency(totalSpend)}</div>
    </div>
    <div class="card">
      <div class="card-label">Tax Deductible</div>
      <div class="card-val">${formatCurrency(taxDeductibleSpend)}</div>
    </div>
    <div class="card">
      <div class="card-label">Invoices & Receipts</div>
      <div class="card-val">${items.length}</div>
    </div>
    <div class="card">
      <div class="card-label">Total Attachments</div>
      <div class="card-val">${items.reduce((s, i) => s + i.attachments.length, 0)} files</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Account</th>
        <th>Vendor / Merchant</th>
        <th>Category</th>
        <th>Invoice / Ref #</th>
        <th>Status</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (item) => `
        <tr>
          <td>${item.date}</td>
          <td>${item.accountName}</td>
          <td><strong>${item.vendor}</strong><br><small style="color:#64748b;">${item.subject.slice(0, 50)}</small></td>
          <td><span class="badge">${item.category}</span></td>
          <td>${item.invoiceNumber || item.orderId || "—"}</td>
          <td><span class="badge ${item.paymentStatus === "paid" ? "badge-paid" : "badge-due"}">${item.paymentStatus}</span></td>
          <td style="text-align: right; font-weight: 600;">${formatCurrency(item.amount, item.currency)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Bulk zip exporter for attachments
export async function exportAttachmentsZip(items: EmailItem[], onProgress?: (msg: string) => void): Promise<void> {
  const zip = new JSZip();
  let count = 0;

  if (onProgress) onProgress("Preparing attachments bundle...");

  for (const item of items) {
    for (const att of item.attachments) {
      count++;
      // Create readable content representing the attachment
      const content = att.previewContent 
        ? `--- ATTACHMENT: ${att.filename} ---\nEmail Subject: ${item.subject}\nVendor: ${item.vendor}\nDate: ${item.date}\nAmount: ${formatCurrency(item.amount, item.currency)}\n\n${att.previewContent}`
        : `Attachment file: ${att.filename}\nExtracted from Apple Mail message ID: ${item.id}\nVendor: ${item.vendor}`;
      
      const safeFolder = item.vendor.replace(/[^a-zA-Z0-9_-]/g, "_");
      zip.file(`${safeFolder}/${att.filename}.txt`, content);
    }
  }

  // Also include an index manifest
  const manifest = {
    exportedAt: new Date().toISOString(),
    totalAttachments: count,
    itemsIncluded: items.length,
    list: items.flatMap((i) =>
      i.attachments.map((a) => ({
        filename: a.filename,
        vendor: i.vendor,
        date: i.date,
        amount: i.amount,
      }))
    ),
  };
  zip.file("MANIFEST.json", JSON.stringify(manifest, null, 2));

  if (onProgress) onProgress("Generating ZIP archive...");
  const blob = await zip.generateAsync({ type: "blob" });
  const dateStr = new Date().toISOString().split("T")[0];
  downloadFile(blob, `AppleMail_Attachments_${dateStr}.zip`, "application/zip");
}
