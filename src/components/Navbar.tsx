import React from "react";
import {
  Inbox,
  Sparkles,
  Download,
  Upload,
  Terminal,
  RefreshCw,
  Plus,
} from "lucide-react";
import { EmailAccount } from "../types";

interface NavbarProps {
  accounts: EmailAccount[];
  totalEmails: number;
  totalInvoices: number;
  activeView: "items" | "attachments";
  setActiveView: (view: "items" | "attachments") => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onOpenAi: () => void;
  onOpenGuide: () => void;
  onOpenAddAccount: () => void;
  isSyncing: boolean;
  onSyncAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  accounts,
  totalEmails,
  totalInvoices,
  activeView,
  setActiveView,
  onOpenExport,
  onOpenImport,
  onOpenAi,
  onOpenGuide,
  onOpenAddAccount,
  isSyncing,
  onSyncAll,
}) => {
  const activeAccountsCount = accounts.filter((a) => a.isActive).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Account Context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-1 ring-sky-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                  Apple Mail Unified Search
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/60">
                  {activeAccountsCount} Accounts
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span>{totalEmails.toLocaleString()} messages indexed</span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-slate-700">{totalInvoices} invoices & attachments</span>
              </p>
            </div>
          </div>

          {/* Center Tabs: Invoices vs Attachments */}
          <div className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-lg border border-slate-200/80">
            <button
              id="tab-invoices-list"
              onClick={() => setActiveView("items")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === "items"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Invoices & Records
            </button>
            <button
              id="tab-attachments-gallery"
              onClick={() => setActiveView("attachments")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === "attachments"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Attachments Gallery
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* AI Assistant */}
            <button
              id="btn-open-ai"
              onClick={onOpenAi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/70 transition-colors"
              title="Ask Gemini AI about your invoices, tax expenses, or subscriptions"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Ask AI</span>
            </button>

            {/* Sync All */}
            <button
              id="btn-sync-accounts"
              onClick={onSyncAll}
              disabled={isSyncing}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Refresh / Sync all Apple Mail accounts"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-sky-600" : ""}`} />
            </button>

            {/* macOS Integration Helper */}
            <button
              id="btn-open-mac-guide"
              onClick={onOpenGuide}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
              title="macOS Apple Mail Helper Script (~/Library/Mail)"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>macOS Script</span>
            </button>

            {/* Import / Upload Mail */}
            <button
              id="btn-open-import"
              onClick={onOpenImport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import EML / MBOX</span>
            </button>

            {/* Export Dropdown */}
            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-t border-slate-100 py-2">
          <div className="grid grid-cols-2 gap-1 w-full p-0.5 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveView("items")}
              className={`py-1 text-center text-xs font-semibold rounded-md ${
                activeView === "items" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              Invoices & Records
            </button>
            <button
              onClick={() => setActiveView("attachments")}
              className={`py-1 text-center text-xs font-semibold rounded-md ${
                activeView === "attachments" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              Attachments Gallery
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
