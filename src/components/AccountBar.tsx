import React from "react";
import { Plus, Check, Mail, Laptop, Layers } from "lucide-react";
import { EmailAccount } from "../types";
import { formatCurrency } from "../utils/exportUtils";

interface AccountBarProps {
  accounts: EmailAccount[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  onAddAccount: () => void;
  totalFilteredSpend: number;
  totalCount: number;
}

export const AccountBar: React.FC<AccountBarProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
  totalFilteredSpend,
  totalCount,
}) => {
  return (
    <div className="bg-slate-50/80 border-b border-slate-200/80 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        {/* Account Pills List */}
        <div className="flex items-center gap-2 min-w-max">
          {/* All Accounts Button */}
          <button
            id="account-pill-all"
            onClick={() => onSelectAccount("all")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              selectedAccountId === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Mailboxes</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedAccountId === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Individual Accounts */}
          {accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            return (
              <button
                key={acc.id}
                id={`account-pill-${acc.id}`}
                onClick={() => onSelectAccount(acc.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  isSelected
                    ? "bg-white text-slate-900 border-slate-400 ring-2 ring-slate-900/10 shadow-xs"
                    : "bg-white/80 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: acc.color }}
                />
                <span className="font-semibold">{acc.name}</span>
                <span className="text-slate-400 text-[11px]">({acc.invoiceCount})</span>
                <span className="text-[11px] font-medium text-slate-700">
                  {formatCurrency(acc.totalSpend)}
                </span>
              </button>
            );
          })}

          {/* Add Account Button */}
          <button
            id="btn-add-account"
            onClick={onAddAccount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-transparent hover:bg-slate-200/60 border border-dashed border-slate-300 transition-colors"
            title="Connect an additional Apple Mail, iCloud, or IMAP account"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Account</span>
          </button>
        </div>

        {/* Selected Context Summary */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 min-w-max">
          <span>Active filter spend:</span>
          <span className="font-bold text-slate-900">
            {formatCurrency(totalFilteredSpend)}
          </span>
        </div>
      </div>
    </div>
  );
};
