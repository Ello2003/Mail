/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from "react";
import { INITIAL_ACCOUNTS, INITIAL_EMAILS } from "./data/mockData";
import { Attachment, EmailAccount, EmailItem, FilterOptions } from "./types";
import { Navbar } from "./components/Navbar";
import { AccountBar } from "./components/AccountBar";
import { StatsOverview } from "./components/StatsOverview";
import { FilterBar } from "./components/FilterBar";
import { ItemTable } from "./components/ItemTable";
import { AttachmentsGallery } from "./components/AttachmentsGallery";
import { AttachmentViewerModal } from "./components/AttachmentViewerModal";
import { ExportModal } from "./components/ExportModal";
import { ImportModal } from "./components/ImportModal";
import { AiQueryModal } from "./components/AiQueryModal";
import { AddAccountModal } from "./components/AddAccountModal";

export default function App() {
  // State
  const [accounts, setAccounts] = useState<EmailAccount[]>(INITIAL_ACCOUNTS);
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [activeView, setActiveView] = useState<"items" | "attachments">("items");

  // Filters State
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    selectedCategory: "all",
    dateRange: "all",
    paymentStatus: "all",
    hasAttachmentsOnly: false,
    taxDeductibleOnly: false,
    attachmentType: "all",
    sortBy: "date-desc",
  });

  // Modals State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importDefaultTab, setImportDefaultTab] = useState<"files" | "guide" | "imap">("files");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [previewAttachmentData, setPreviewAttachmentData] = useState<{
    attachment: Attachment;
    email: EmailItem;
  } | null>(null);

  // Syncing & AI Analyzing Indicators
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [isAiAnalyzingId, setIsAiAnalyzingId] = useState<string | null>(null);

  // Helper to re-calculate account totals
  const recalculateAccountStats = useCallback(
    (currentEmails: EmailItem[], currentAccounts: EmailAccount[]) => {
      return currentAccounts.map((acc) => {
        const accEmails = currentEmails.filter((e) => e.accountId === acc.id);
        const totalSpend = accEmails.reduce((sum, e) => sum + (e.amount || 0), 0);
        return {
          ...acc,
          totalEmails: accEmails.length,
          invoiceCount: accEmails.filter((e) => e.category === "invoices" || e.amount !== null).length,
          totalSpend,
        };
      });
    },
    []
  );

  // Filtered Emails Calculation
  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      // 1. Account Filter
      if (selectedAccountId !== "all" && item.accountId !== selectedAccountId) {
        return false;
      }

      // 2. Category Filter
      if (filters.selectedCategory !== "all" && item.category !== filters.selectedCategory) {
        return false;
      }

      // 3. Payment Status Filter
      if (filters.paymentStatus !== "all" && item.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // 4. Attachments Only Filter
      if (filters.hasAttachmentsOnly && item.attachments.length === 0) {
        return false;
      }

      // 5. Tax Deductible Only Filter
      if (filters.taxDeductibleOnly && !item.taxDeductible) {
        return false;
      }

      // 6. Date Range Filter
      if (filters.dateRange !== "all") {
        const itemDate = new Date(item.date).getTime();
        const now = new Date("2026-08-28").getTime(); // Anchor to current 2026 context
        const oneDay = 24 * 60 * 60 * 1000;

        if (filters.dateRange === "30d" && now - itemDate > 30 * oneDay) return false;
        if (filters.dateRange === "90d" && now - itemDate > 90 * oneDay) return false;
        if (filters.dateRange === "year" && now - itemDate > 365 * oneDay) return false;
        if (filters.dateRange === "ytd") {
          const itemYear = new Date(item.date).getFullYear();
          if (itemYear !== 2026) return false;
        }
      }

      // 7. Search Query Filter
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const vendorMatch = item.vendor.toLowerCase().includes(q);
        const subjectMatch = item.subject.toLowerCase().includes(q);
        const senderMatch = item.sender.toLowerCase().includes(q) || item.senderEmail.toLowerCase().includes(q);
        const invMatch = (item.invoiceNumber || "").toLowerCase().includes(q) || (item.orderId || "").toLowerCase().includes(q);
        const bodyMatch = item.snippet.toLowerCase().includes(q) || (item.fullBody || "").toLowerCase().includes(q);
        const attMatch = item.attachments.some((a) => a.filename.toLowerCase().includes(q));
        const amountMatch = item.amount !== null && item.amount.toString().includes(q);
        const lineItemMatch = item.lineItems?.some((li) => li.description.toLowerCase().includes(q));

        if (
          !vendorMatch &&
          !subjectMatch &&
          !senderMatch &&
          !invMatch &&
          !bodyMatch &&
          !attMatch &&
          !amountMatch &&
          !lineItemMatch
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (filters.sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sortBy === "amount-desc") {
        return (b.amount || 0) - (a.amount || 0);
      }
      if (filters.sortBy === "amount-asc") {
        return (a.amount || 0) - (b.amount || 0);
      }
      if (filters.sortBy === "vendor") {
        return a.vendor.localeCompare(b.vendor);
      }
      return 0;
    });
  }, [emails, selectedAccountId, filters]);

  // Dynamic Category Counts based on current search & account
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      invoices: 0,
      purchases: 0,
      travel: 0,
      tax: 0,
      contracts: 0,
    };
    emails.forEach((item) => {
      if (selectedAccountId === "all" || item.accountId === selectedAccountId) {
        if (counts[item.category] !== undefined) {
          counts[item.category]++;
        }
      }
    });
    return counts;
  }, [emails, selectedAccountId]);

  // Handlers
  const handleToggleStar = (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e))
    );
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    setSyncToast("Syncing with Apple Mail local archives...");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast("Synced 3 mailboxes: All messages up to date.");
      setTimeout(() => setSyncToast(null), 3000);
    }, 1200);
  };

  const handleImportComplete = (newItems: EmailItem[]) => {
    setEmails((prev) => {
      const updated = [...newItems, ...prev];
      setAccounts((accs) => recalculateAccountStats(updated, accs));
      return updated;
    });
    setSyncToast(`Imported ${newItems.length} emails into Apple Mail dashboard!`);
    setTimeout(() => setSyncToast(null), 4000);
  };

  const handleAddAccount = (newAcc: EmailAccount) => {
    setAccounts((prev) => [...prev, newAcc]);
    setSelectedAccountId(newAcc.id);
    setSyncToast(`Added mailbox "${newAcc.name}"`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleAnalyzeAi = async (item: EmailItem) => {
    setIsAiAnalyzingId(item.id);
    try {
      const response = await fetch("/api/ai/analyze-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: item.subject,
          body: item.fullBody || item.snippet,
          vendor: item.vendor,
          amount: item.amount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmails((prev) =>
          prev.map((e) => {
            if (e.id === item.id) {
              return {
                ...e,
                vendor: data.vendor || e.vendor,
                amount: data.amount !== undefined && data.amount !== null ? data.amount : e.amount,
                currency: data.currency || e.currency,
                invoiceNumber: data.invoiceNumber || e.invoiceNumber,
                category: data.category || e.category,
                paymentStatus: data.paymentStatus || e.paymentStatus,
                taxAmount: data.taxAmount !== undefined ? data.taxAmount : e.taxAmount,
                taxDeductible: data.taxDeductible !== undefined ? data.taxDeductible : e.taxDeductible,
                lineItems: data.lineItems && data.lineItems.length > 0 ? data.lineItems : e.lineItems,
                aiAnalyzed: true,
              };
            }
            return e;
          })
        );
        setSyncToast(`Gemini AI analysis complete for ${item.vendor}!`);
        setTimeout(() => setSyncToast(null), 3000);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsAiAnalyzingId(null);
    }
  };

  const totalFilteredSpend = filteredEmails.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* 1. Header / Navbar */}
      <Navbar
        accounts={accounts}
        totalEmails={emails.length}
        totalInvoices={emails.filter((e) => e.category === "invoices" || e.amount !== null).length}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenImport={() => {
          setImportDefaultTab("files");
          setIsImportOpen(true);
        }}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenGuide={() => {
          setImportDefaultTab("guide");
          setIsImportOpen(true);
        }}
        onOpenAddAccount={() => setIsAddAccountOpen(true)}
        isSyncing={isSyncing}
        onSyncAll={handleSyncAll}
      />

      {/* 2. Apple Multi-Account Pill Bar */}
      <AccountBar
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        onAddAccount={() => setIsAddAccountOpen(true)}
        totalFilteredSpend={totalFilteredSpend}
        totalCount={filteredEmails.length}
      />

      {/* 3. Aggregated Financial & Document Stats Overview */}
      <StatsOverview
        items={filteredEmails}
        selectedCategory={filters.selectedCategory}
        onSelectCategory={(cat) =>
          setFilters((prev) => ({ ...prev, selectedCategory: cat }))
        }
      />

      {/* 4. Unified Search & Filtering Control Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        categoryCounts={categoryCounts}
        totalResults={filteredEmails.length}
      />

      {/* 5. Main Content Area */}
      <main className="flex-1 pb-16">
        {activeView === "items" ? (
          <ItemTable
            items={filteredEmails}
            accounts={accounts}
            onPreviewAttachment={(attachment, email) =>
              setPreviewAttachmentData({ attachment, email })
            }
            onToggleStar={handleToggleStar}
            onAnalyzeAi={handleAnalyzeAi}
            isAiAnalyzingId={isAiAnalyzingId}
          />
        ) : (
          <AttachmentsGallery
            items={filteredEmails}
            accounts={accounts}
            onPreviewAttachment={(attachment, email) =>
              setPreviewAttachmentData({ attachment, email })
            }
          />
        )}
      </main>

      {/* 6. Modals */}
      <AttachmentViewerModal
        attachment={previewAttachmentData?.attachment || null}
        email={previewAttachmentData?.email || null}
        onClose={() => setPreviewAttachmentData(null)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        items={filteredEmails}
        accounts={accounts}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        accounts={accounts}
        onImportComplete={handleImportComplete}
        defaultTab={importDefaultTab}
      />

      <AiQueryModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        items={filteredEmails}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
}
