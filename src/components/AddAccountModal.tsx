import React, { useState } from "react";
import { X, Mail, Check, Laptop, Shield } from "lucide-react";
import { EmailAccount } from "../types";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (newAccount: EmailAccount) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<EmailAccount["type"]>("icloud");
  const [color, setColor] = useState("#0284c7");

  if (!isOpen) return null;

  const colorPalette = [
    "#0284c7", // Sky blue (iCloud)
    "#4f46e5", // Indigo (Work Exchange)
    "#059669", // Emerald
    "#d97706", // Amber
    "#7c3aed", // Purple
    "#dc2626", // Red
    "#0891b2", // Cyan
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newAcc: EmailAccount = {
      id: `acc-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      type,
      color,
      isActive: true,
      totalEmails: 0,
      invoiceCount: 0,
      totalSpend: 0,
      lastSync: "Just added",
    };

    onAddAccount(newAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Connect Mailbox</h3>
              <p className="text-xs text-slate-500">Add an Apple Mail account to index</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Account Label */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Account Label / Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work Exchange, Personal iCloud, Consulting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. name@icloud.com or name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Account Provider Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Account Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "icloud", label: "Apple iCloud" },
                { key: "exchange", label: "Exchange / 365" },
                { key: "imap", label: "IMAP / Other" },
              ].map((prov) => (
                <button
                  key={prov.key}
                  type="button"
                  onClick={() => setType(prov.key as any)}
                  className={`py-2 px-2 text-center rounded-lg border font-medium transition-all ${
                    type === prov.key
                      ? "bg-sky-50 border-sky-500 text-sky-800 font-bold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {prov.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Tag */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Mailbox Tag Color
            </label>
            <div className="flex items-center gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-500 text-[11px] flex items-start gap-2">
            <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Mailbox indexing is done locally and client-side via drag & drop or the macOS AppleScript helper.
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs"
            >
              Add Mailbox
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
