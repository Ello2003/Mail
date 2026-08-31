import React from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  FileCheck2,
  Paperclip,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { CategoryType, FilterOptions } from "../types";

interface FilterBarProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  categoryCounts: Record<string, number>;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  categoryCounts,
  totalResults,
}) => {
  const categoryOptions: { key: string; label: string }[] = [
    { key: "all", label: "All Categories" },
    { key: "invoices", label: "Invoices & Bills" },
    { key: "purchases", label: "Purchases & Orders" },
    { key: "travel", label: "Travel & Flights" },
    { key: "tax", label: "Tax & Financial" },
    { key: "contracts", label: "Contracts & Legal" },
  ];

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.selectedCategory !== "all" ||
    filters.dateRange !== "all" ||
    filters.paymentStatus !== "all" ||
    filters.hasAttachmentsOnly ||
    filters.taxDeductibleOnly ||
    filters.attachmentType !== "all" ||
    filters.sortBy !== "date-desc";

  const handleReset = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: "",
      selectedCategory: "all",
      dateRange: "all",
      paymentStatus: "all",
      hasAttachmentsOnly: false,
      taxDeductibleOnly: false,
      attachmentType: "all",
      sortBy: "date-desc",
    }));
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Line: Search Bar + Quick Toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search across all Apple Mail accounts (vendor, invoice #, subject, line item, amount)..."
              className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, searchQuery: "" }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Selects */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Date Range Selector */}
            <div className="relative min-w-max">
              <select
                id="select-date-range"
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: e.target.value as any,
                  }))
                }
                className="appearance-none pl-7 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100/80 focus:outline-none cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="ytd">Year to Date (2026)</option>
                <option value="year">Past 12 Months</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Payment Status Selector */}
            <div className="relative min-w-max">
              <select
                id="select-payment-status"
                value={filters.paymentStatus}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value as any,
                  }))
                }
                className="appearance-none pl-3 pr-7 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100/80 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="due">Action Due</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="relative min-w-max">
              <select
                id="select-sort-by"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="appearance-none pl-7 pr-7 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100/80 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="vendor">Vendor Name</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Line: Category Chips & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryOptions.map((cat) => {
              const isSelected = filters.selectedCategory === cat.key;
              const count =
                cat.key === "all"
                  ? totalResults
                  : categoryCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  id={`cat-chip-${cat.key}`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedCategory: cat.key,
                    }))
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? "bg-sky-700 text-white"
                        : "bg-slate-200/90 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Boolean Filters */}
          <div className="flex items-center gap-2 text-xs">
            {/* Attachments only toggle */}
            <button
              id="filter-has-attachments"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  hasAttachmentsOnly: !prev.hasAttachmentsOnly,
                }))
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                filters.hasAttachmentsOnly
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>With Attachments</span>
            </button>

            {/* Tax Deductible only toggle */}
            <button
              id="filter-tax-deductible"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  taxDeductibleOnly: !prev.taxDeductibleOnly,
                }))
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                filters.taxDeductibleOnly
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Tax Deductible Only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
