import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  FileCode,
  Printer,
  FolderArchive,
  Download,
  Check,
  Calendar,
  Layers,
} from "lucide-react";
import { EmailItem, EmailAccount } from "../types";
import {
  exportToCsv,
  exportToJson,
  exportReportPrint,
  exportAttachmentsZip,
  formatCurrency,
} from "../utils/exportUtils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EmailItem[];
  accounts: EmailAccount[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  items,
  accounts,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [zipMessage, setZipMessage] = useState("");
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalSpend = items.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalAttachments = items.reduce((sum, i) => sum + i.attachments.length, 0);

  const handleExportCsv = () => {
    exportToCsv(items);
    setExportedFormat("csv");
    setTimeout(() => setExportedFormat(null), 2500);
  };

  const handleExportJson = () => {
    exportToJson(items);
    setExportedFormat("json");
    setTimeout(() => setExportedFormat(null), 2500);
  };

  const handleExportPrint = () => {
    exportReportPrint(items, accounts);
    setExportedFormat("report");
    setTimeout(() => setExportedFormat(null), 2500);
  };

  const handleExportZip = async () => {
    setIsZipping(true);
    setZipMessage("Packaging files...");
    try {
      await exportAttachmentsZip(items, (msg) => setZipMessage(msg));
      setExportedFormat("zip");
      setTimeout(() => setExportedFormat(null), 2500);
    } finally {
      setIsZipping(false);
      setZipMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">Export Filtered Records</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Currently selected: <span className="font-semibold text-slate-800">{items.length} records</span> ({formatCurrency(totalSpend)}) across {accounts.length} accounts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-6 space-y-4">
          {/* Option 1: CSV for Accounting */}
          <div
            id="export-card-csv"
            onClick={handleExportCsv}
            className="p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/20 cursor-pointer transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  CSV Spreadsheet (.csv)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ready for QuickBooks, Xero, Excel, or Google Sheets. Includes Date, Vendor, Amount, Tax, Account, and Deductible tags.
                </p>
              </div>
            </div>
            <button className="px-3 py-1 rounded-md text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 shrink-0 ml-3">
              {exportedFormat === "csv" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : "Download"}
            </button>
          </div>

          {/* Option 2: Printable PDF / Expense Summary */}
          <div
            id="export-card-report"
            onClick={handleExportPrint}
            className="p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/20 cursor-pointer transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Printable Expense Report / PDF
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Opens a formatted statement with financial summary cards, category distributions, and an itemized audit table.
                </p>
              </div>
            </div>
            <button className="px-3 py-1 rounded-md text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 shrink-0 ml-3">
              {exportedFormat === "report" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : "Open"}
            </button>
          </div>

          {/* Option 3: ZIP Archive of Attachments */}
          <div
            id="export-card-zip"
            onClick={handleExportZip}
            className="p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/20 cursor-pointer transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Attachments Bundle (.zip)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Bundles all <span className="font-semibold text-slate-700">{totalAttachments} attachment proofs</span> and PDFs into a single zip archive with a manifest file.
                </p>
              </div>
            </div>
            <button
              disabled={isZipping}
              className="px-3 py-1 rounded-md text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 shrink-0 ml-3"
            >
              {isZipping ? (
                <span className="animate-pulse">{zipMessage || "Zipping..."}</span>
              ) : exportedFormat === "zip" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                "Bundle ZIP"
              )}
            </button>
          </div>

          {/* Option 4: Full JSON Dump */}
          <div
            id="export-card-json"
            onClick={handleExportJson}
            className="p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/20 cursor-pointer transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Developer JSON Schema (.json)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Full nested payload with line items, sender email addresses, currency, and Apple Mail message IDs.
                </p>
              </div>
            </div>
            <button className="px-3 py-1 rounded-md text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 shrink-0 ml-3">
              {exportedFormat === "json" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : "Download"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>All exports run locally in your browser.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
