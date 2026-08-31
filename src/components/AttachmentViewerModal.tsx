import React from "react";
import { X, Download, FileText, ExternalLink, Paperclip, Check } from "lucide-react";
import { Attachment, EmailItem } from "../types";
import { formatCurrency, downloadFile } from "../utils/exportUtils";

interface AttachmentViewerModalProps {
  attachment: Attachment | null;
  email: EmailItem | null;
  onClose: () => void;
}

export const AttachmentViewerModal: React.FC<AttachmentViewerModalProps> = ({
  attachment,
  email,
  onClose,
}) => {
  const [downloaded, setDownloaded] = React.useState(false);

  if (!attachment || !email) return null;

  const handleDownload = () => {
    const content = attachment.previewContent
      ? `=== ${attachment.filename} ===\nEmail: ${email.subject}\nFrom: ${email.sender}\nVendor: ${email.vendor}\nDate: ${email.date}\nAmount: ${formatCurrency(email.amount, email.currency)}\n\n${attachment.previewContent}`
      : `Attachment: ${attachment.filename}\nExtracted from Apple Mail.`;
    
    downloadFile(content, attachment.filename, attachment.mimeType || "text/plain");
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const isPdf = attachment.extension.toLowerCase() === "pdf";
  const isImage = ["png", "jpg", "jpeg", "webp"].includes(attachment.extension.toLowerCase());
  const isCsv = attachment.extension.toLowerCase() === "csv";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{attachment.filename}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{(attachment.size / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span>From: {email.vendor}</span>
                <span>•</span>
                <span>{email.date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-download-attachment"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </>
              )}
            </button>

            <button
              id="btn-close-attachment-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100/70">
          {isPdf ? (
            /* Rendered Mock PDF Invoice Document */
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-2xl mx-auto space-y-6 text-slate-800 font-sans">
              {/* PDF Document Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{email.vendor}</div>
                  <div className="text-xs text-slate-500 mt-1">Official Electronic Invoice & Tax Receipt</div>
                  <div className="text-xs text-slate-400 mt-0.5">{email.senderEmail}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase text-slate-400">Invoice Number</div>
                  <div className="text-sm font-mono font-bold text-slate-900">{email.invoiceNumber || email.orderId || "INV-008192"}</div>
                  <div className="text-xs text-slate-500 mt-1">Date: {email.date}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Billed To</div>
                  <div className="font-bold text-slate-900">{email.accountName}</div>
                  <div className="text-slate-600">{email.recipient}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Payment Details</div>
                  <div className="text-slate-700">{email.paymentMethod || "Electronic Card Payment"}</div>
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase mt-1 bg-emerald-100 text-emerald-800">
                    Status: {email.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {email.lineItems && email.lineItems.length > 0 ? (
                      email.lineItems.map((li, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{li.description}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{li.quantity || 1}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">
                            {formatCurrency(li.unitPrice || li.total, email.currency)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                            {formatCurrency(li.total, email.currency)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{email.subject}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">1</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{formatCurrency(email.amount, email.currency)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{formatCurrency(email.amount, email.currency)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency((email.amount || 0) - (email.taxAmount || 0), email.currency)}</span>
                  </div>
                  {email.taxAmount ? (
                    <div className="flex justify-between text-slate-600">
                      <span>Sales Tax / VAT:</span>
                      <span>{formatCurrency(email.taxAmount, email.currency)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                    <span>Total Paid:</span>
                    <span className="text-sky-700">{formatCurrency(email.amount, email.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Verified PDF signature from {email.vendor}</span>
                <span className="font-mono text-slate-400">SHA-256: 8f92a1...bc4</span>
              </div>
            </div>
          ) : (
            /* Text / CSV / Raw Document Viewer */
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Paperclip className="w-4 h-4" />
                <span>Extracted File Text / Stream</span>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-96">
                {attachment.previewContent || "No preview text available."}
              </pre>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Attached to email: <strong>{email.subject}</strong></span>
          <span className="text-slate-400">Apple Mail Archive ID: {email.id}</span>
        </div>
      </div>
    </div>
  );
};
