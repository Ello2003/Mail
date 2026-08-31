import React, { useState } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Paperclip,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Attachment, EmailItem, EmailAccount } from "../types";
import { formatCurrency, downloadFile } from "../utils/exportUtils";

interface ItemTableProps {
  items: EmailItem[];
  accounts: EmailAccount[];
  onPreviewAttachment: (attachment: Attachment, email: EmailItem) => void;
  onToggleStar: (id: string) => void;
  onAnalyzeAi: (item: EmailItem) => void;
  isAiAnalyzingId: string | null;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items,
  accounts,
  onPreviewAttachment,
  onToggleStar,
  onAnalyzeAi,
  isAiAnalyzingId,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getAccountColor = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc ? acc.color : "#64748b";
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "invoices":
        return "bg-sky-50 text-sky-700 border-sky-200/80";
      case "purchases":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "travel":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "tax":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
      case "contracts":
        return "bg-violet-50 text-violet-700 border-violet-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Check className="w-3 h-3" />
            <span>Paid</span>
          </span>
        );
      case "due":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200/80 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            <span>Due</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
            <span>Refunded</span>
          </span>
        );
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-6 max-w-7xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No emails or records match your search</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Try clearing your search query, switching accounts, or clearing active filters to see all indexed records.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-3 w-8 text-center"></th>
                <th className="py-3 px-3 w-32">Date & Account</th>
                <th className="py-3 px-4">Vendor & Subject</th>
                <th className="py-3 px-3 w-28">Category</th>
                <th className="py-3 px-3 w-32">Invoice / Ref #</th>
                <th className="py-3 px-3 w-28 text-right">Amount</th>
                <th className="py-3 px-3 w-24 text-center">Status</th>
                <th className="py-3 px-4 w-40">Attachments</th>
                <th className="py-3 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const isExpanded = expandedId === item.id;
                const accountColor = getAccountColor(item.accountId);
                const hasAttachments = item.attachments.length > 0;

                return (
                  <React.Fragment key={item.id}>
                    {/* Primary Row */}
                    <tr
                      id={`row-${item.id}`}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                        isExpanded ? "bg-sky-50/30" : ""
                      }`}
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      {/* Star Button */}
                      <td
                        className="py-3.5 px-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStar(item.id);
                        }}
                      >
                        <button
                          id={`star-${item.id}`}
                          className={`p-1 rounded-md transition-colors ${
                            item.isStarred
                              ? "text-amber-400 hover:text-amber-500"
                              : "text-slate-300 hover:text-slate-400"
                          }`}
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            fill={item.isStarred ? "currentColor" : "none"}
                          />
                        </button>
                      </td>

                      {/* Date & Account Pill */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{item.date}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-2 h-2 rounded-full ring-1 ring-white"
                            style={{ backgroundColor: accountColor }}
                          />
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[110px]">
                            {item.accountName}
                          </span>
                        </div>
                      </td>

                      {/* Vendor & Subject */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.vendor}</span>
                          {item.taxDeductible && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              title="Tax Deductible Business Expense"
                            >
                              Deductible
                            </span>
                          )}
                          {item.aiAnalyzed && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-purple-600"
                              title="Analyzed with Gemini AI"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI Verified</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-normal line-clamp-1 mt-0.5">
                          {item.subject}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* Invoice Number */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {item.invoiceNumber || item.orderId ? (
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[100px]">
                              {item.invoiceNumber || item.orderId}
                            </span>
                            <button
                              id={`copy-inv-${item.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  item.invoiceNumber || item.orderId || "",
                                  item.id
                                );
                              }}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Copy invoice number"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {formatCurrency(item.amount, item.currency)}
                        </span>
                        {item.taxAmount ? (
                          <div className="text-[10px] text-slate-400">
                            Tax: {formatCurrency(item.taxAmount, item.currency)}
                          </div>
                        ) : null}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {getStatusBadge(item.paymentStatus)}
                      </td>

                      {/* Attachments Pills */}
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasAttachments ? (
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {item.attachments.map((att) => (
                              <button
                                key={att.id}
                                id={`att-btn-${att.id}`}
                                onClick={() => onPreviewAttachment(att, item)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200/90 text-slate-700 text-[11px] font-medium border border-slate-200 transition-colors truncate max-w-[170px]"
                                title={`Click to preview & download: ${att.filename}`}
                              >
                                <Paperclip className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="truncate">{att.filename}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[11px]">No files</span>
                        )}
                      </td>

                      {/* Expand Chevron */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          className="text-slate-400 hover:text-slate-600 p-1"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Detail Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-b border-slate-200">
                        <td colSpan={9} className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Column 1 & 2: Line Items & Metadata */}
                            <div className="lg:col-span-2 space-y-4">
                              {/* Metadata Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900">
                                    {item.subject}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    From: <span className="font-medium text-slate-700">{item.sender}</span> • Account:{" "}
                                    <span className="font-medium text-slate-700">{item.accountName}</span>
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* AI In-depth extraction */}
                                  <button
                                    id={`btn-ai-analyze-${item.id}`}
                                    onClick={() => onAnalyzeAi(item)}
                                    disabled={isAiAnalyzingId === item.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-purple-700 bg-purple-100/70 hover:bg-purple-200 border border-purple-300/80 transition-colors"
                                  >
                                    <Sparkles className={`w-3.5 h-3.5 ${isAiAnalyzingId === item.id ? "animate-spin" : ""}`} />
                                    <span>
                                      {isAiAnalyzingId === item.id ? "Analyzing..." : "AI Re-analyze"}
                                    </span>
                                  </button>

                                  {/* Download E-Invoice Summary */}
                                  {item.attachments.length > 0 && (
                                    <button
                                      id={`btn-view-first-att-${item.id}`}
                                      onClick={() => onPreviewAttachment(item.attachments[0], item)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                                      <span>View Attachment</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Line Items Table if present */}
                              {item.lineItems && item.lineItems.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Itemized Charges
                                  </div>
                                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="w-full text-xs">
                                      <thead className="bg-slate-100/80 text-slate-600 border-b border-slate-200 font-medium">
                                        <tr>
                                          <th className="py-2 px-3 text-left">Item Description</th>
                                          <th className="py-2 px-3 text-center w-16">Qty</th>
                                          <th className="py-2 px-3 text-right w-24">Rate</th>
                                          <th className="py-2 px-3 text-right w-28">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {item.lineItems.map((li, idx) => (
                                          <tr key={idx}>
                                            <td className="py-2 px-3 font-medium text-slate-800">
                                              {li.description}
                                            </td>
                                            <td className="py-2 px-3 text-center text-slate-500">
                                              {li.quantity || 1}
                                            </td>
                                            <td className="py-2 px-3 text-right text-slate-500">
                                              {formatCurrency(li.unitPrice || li.total, item.currency)}
                                            </td>
                                            <td className="py-2 px-3 text-right font-bold text-slate-900">
                                              {formatCurrency(li.total, item.currency)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {/* Raw Email Snippet */}
                              <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                  Email Text Extract
                                </div>
                                <div className="bg-white rounded-lg border border-slate-200 p-3.5 text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                                  {item.fullBody || item.snippet}
                                </div>
                              </div>
                            </div>

                            {/* Column 3: Payment & Accounting Attributes */}
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                                Accounting & Tax Info
                              </h5>

                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                  <span className="text-slate-500">Total Billed:</span>
                                  <span className="font-bold text-slate-900">
                                    {formatCurrency(item.amount, item.currency)}
                                  </span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100">
                                  <span className="text-slate-500">Sales Tax / VAT:</span>
                                  <span className="font-medium text-slate-700">
                                    {formatCurrency(item.taxAmount, item.currency)}
                                  </span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100">
                                  <span className="text-slate-500">Payment Method:</span>
                                  <span className="font-medium text-slate-700 text-right">
                                    {item.paymentMethod || "Electronic"}
                                  </span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100">
                                  <span className="text-slate-500">Tax Deductible:</span>
                                  <span
                                    className={`font-semibold ${
                                      item.taxDeductible ? "text-emerald-700" : "text-slate-500"
                                    }`}
                                  >
                                    {item.taxDeductible ? "Yes (Ordinary & Necessary)" : "No (Personal)"}
                                  </span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100">
                                  <span className="text-slate-500">Apple Mail ID:</span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {item.id}
                                  </span>
                                </div>
                              </div>

                              {/* Attachments in Drawer */}
                              {item.attachments.length > 0 && (
                                <div className="pt-2">
                                  <div className="text-xs font-semibold text-slate-500 mb-1.5">
                                    Attached Proofs ({item.attachments.length}):
                                  </div>
                                  <div className="space-y-1.5">
                                    {item.attachments.map((att) => (
                                      <div
                                        key={att.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                          <span className="font-medium text-slate-800 truncate">
                                            {att.filename}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => onPreviewAttachment(att, item)}
                                          className="text-sky-600 hover:text-sky-800 font-semibold text-[11px] shrink-0 ml-2"
                                        >
                                          Open
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
