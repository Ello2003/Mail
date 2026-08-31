import React from "react";
import {
  DollarSign,
  Receipt,
  FileCheck2,
  AlertTriangle,
  Paperclip,
  TrendingUp,
} from "lucide-react";
import { EmailItem } from "../types";
import { formatCurrency } from "../utils/exportUtils";

interface StatsOverviewProps {
  items: EmailItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
}) => {
  const totalSpend = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  const taxDeductibleSpend = items
    .filter((i) => i.taxDeductible)
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const pendingItems = items.filter((i) => i.paymentStatus === "due" || i.paymentStatus === "pending");
  const pendingAmount = pendingItems.reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalAttachments = items.reduce((sum, i) => sum + i.attachments.length, 0);
  const totalAttachmentBytes = items.reduce(
    (sum, i) => sum + i.attachments.reduce((aSum, a) => aSum + a.size, 0),
    0
  );
  const totalAttachmentMb = (totalAttachmentBytes / (1024 * 1024)).toFixed(1);

  // Category breakdown
  const categoriesMap: Record<string, { label: string; amount: number; count: number; color: string }> = {
    invoices: { label: "Invoices & Subscriptions", amount: 0, count: 0, color: "bg-sky-500" },
    purchases: { label: "Purchases & Hardware", amount: 0, count: 0, color: "bg-emerald-500" },
    travel: { label: "Travel & Flights", amount: 0, count: 0, color: "bg-amber-500" },
    tax: { label: "Tax & Financial", amount: 0, count: 0, color: "bg-indigo-500" },
    contracts: { label: "Contracts & Legal", amount: 0, count: 0, color: "bg-violet-500" },
  };

  items.forEach((i) => {
    if (categoriesMap[i.category]) {
      categoriesMap[i.category].amount += i.amount || 0;
      categoriesMap[i.category].count += 1;
    }
  });

  return (
    <div className="bg-white border-b border-slate-200 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Card 1: Total Spend */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Expenses
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              {formatCurrency(totalSpend)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From <span className="font-semibold text-slate-700">{items.length}</span> receipts & orders
            </p>
          </div>

          {/* Card 2: Tax Deductible */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tax Deductible
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2 tracking-tight">
              {formatCurrency(taxDeductibleSpend)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalSpend > 0 ? Math.round((taxDeductibleSpend / totalSpend) * 100) : 0}% of active expenses
            </p>
          </div>

          {/* Card 3: Action Required / Due */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending / Due
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${pendingItems.length > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-200/60 text-slate-600"}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-amber-700 font-medium mt-1">
              {pendingItems.length > 0 ? `${pendingItems.length} invoices awaiting payment` : "All invoices settled"}
            </p>
          </div>

          {/* Card 4: Attachments */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Files & Proofs
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Paperclip className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              {totalAttachments} files
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalAttachmentMb} MB of extracted PDFs & receipts
            </p>
          </div>
        </div>

        {/* Category Spend Distribution Bar */}
        {totalSpend > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
              <span>Spend Breakdown by Category:</span>
              <span className="text-slate-400">Click a category to focus</span>
            </div>
            {/* Visual Progress Segments */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
              {Object.entries(categoriesMap).map(([key, data]) => {
                if (data.amount <= 0) return null;
                const pct = (data.amount / totalSpend) * 100;
                return (
                  <div
                    key={key}
                    className={`${data.color} transition-all duration-300 cursor-pointer hover:opacity-85`}
                    style={{ width: `${pct}%` }}
                    title={`${data.label}: ${formatCurrency(data.amount)} (${Math.round(pct)}%)`}
                    onClick={() => onSelectCategory(key)}
                  />
                );
              })}
            </div>
            {/* Legend Chips */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-600">
              {Object.entries(categoriesMap).map(([key, data]) => {
                if (data.count === 0) return null;
                const isSelected = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => onSelectCategory(isSelected ? "all" : key)}
                    className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md transition-colors ${
                      isSelected ? "bg-slate-200 text-slate-900 font-bold" : "hover:bg-slate-100"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${data.color}`} />
                    <span>{data.label}</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(data.amount)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
