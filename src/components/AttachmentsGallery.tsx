import React, { useState, useMemo } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FolderArchive,
  Download,
  Search,
  Eye,
  Check,
  Paperclip,
  Building,
  Calendar,
} from "lucide-react";
import { Attachment, EmailItem, EmailAccount } from "../types";
import { formatCurrency, exportAttachmentsZip } from "../utils/exportUtils";

interface AttachmentsGalleryProps {
  items: EmailItem[];
  accounts: EmailAccount[];
  onPreviewAttachment: (attachment: Attachment, email: EmailItem) => void;
}

export const AttachmentsGallery: React.FC<AttachmentsGalleryProps> = ({
  items,
  accounts,
  onPreviewAttachment,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isZipping, setIsZipping] = useState(false);

  // Flatten attachments with associated email
  const allAttachments = useMemo(() => {
    const list: { attachment: Attachment; email: EmailItem }[] = [];
    items.forEach((item) => {
      item.attachments.forEach((att) => {
        list.push({ attachment: att, email: item });
      });
    });
    return list;
  }, [items]);

  // Filter attachments
  const filtered = useMemo(() => {
    return allAttachments.filter(({ attachment, email }) => {
      // Type filter
      if (filterType !== "all") {
        const ext = attachment.extension.toLowerCase();
        if (filterType === "pdf" && ext !== "pdf") return false;
        if (filterType === "images" && !["png", "jpg", "jpeg", "webp"].includes(ext)) return false;
        if (filterType === "spreadsheets" && !["csv", "xlsx", "xls"].includes(ext)) return false;
        if (filterType === "documents" && !["doc", "docx", "txt", "rtf"].includes(ext)) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = attachment.filename.toLowerCase().includes(q);
        const matchesVendor = email.vendor.toLowerCase().includes(q);
        const matchesSubject = email.subject.toLowerCase().includes(q);
        if (!matchesName && !matchesVendor && !matchesSubject) return false;
      }

      return true;
    });
  }, [allAttachments, filterType, searchQuery]);

  const getFileIcon = (ext: string) => {
    const lower = ext.toLowerCase();
    if (lower === "pdf") return <FileText className="w-8 h-8 text-rose-500" />;
    if (["csv", "xlsx", "xls"].includes(lower)) return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
    if (["png", "jpg", "jpeg", "webp"].includes(lower)) return <FileImage className="w-8 h-8 text-blue-500" />;
    if (["zip", "tar", "gz"].includes(lower)) return <FolderArchive className="w-8 h-8 text-amber-500" />;
    return <FileText className="w-8 h-8 text-slate-500" />;
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((f) => f.attachment.id)));
    }
  };

  const handleBatchZip = async () => {
    const selectedItems = items.filter((item) =>
      item.attachments.some((a) => selectedIds.has(a.id))
    );
    setIsZipping(true);
    try {
      await exportAttachmentsZip(selectedItems.length > 0 ? selectedItems : items);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Sub-bar for Attachments */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="attachment-search"
            type="text"
            placeholder="Search attachments by name, vendor, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Type Filter Pills & Batch Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
            {["all", "pdf", "images", "spreadsheets"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                  filterType === t
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t === "all" ? "All Files" : t}
              </button>
            ))}
          </div>

          <button
            id="btn-zip-all-attachments"
            onClick={handleBatchZip}
            disabled={isZipping}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isZipping
                ? "Archiving..."
                : selectedIds.size > 0
                ? `Download (${selectedIds.size}) as ZIP`
                : "Download All as ZIP"}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Attachment Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Paperclip className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-800">No attachments found</h4>
          <p className="text-xs text-slate-500 mt-1">Try relaxing the search filters or file type selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(({ attachment, email }) => {
            const isSelected = selectedIds.has(attachment.id);

            return (
              <div
                key={attachment.id}
                id={`att-card-${attachment.id}`}
                className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden group ${
                  isSelected ? "border-sky-500 ring-2 ring-sky-500/20" : "border-slate-200/90"
                }`}
              >
                {/* Card Top Preview Header */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center">
                      {getFileIcon(attachment.extension)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {attachment.extension}
                      </span>
                      <div className="text-xs font-bold text-slate-700">
                        {(attachment.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <button
                    onClick={() => toggleSelect(attachment.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-sky-600 border-sky-600 text-white"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h5
                      className="text-xs font-semibold text-slate-900 line-clamp-2 title-tooltip cursor-pointer hover:text-sky-600"
                      onClick={() => onPreviewAttachment(attachment, email)}
                      title={attachment.filename}
                    >
                      {attachment.filename}
                    </h5>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700">{email.vendor}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3 text-slate-300 shrink-0" />
                      <span>{email.date}</span>
                    </div>
                  </div>

                  {email.amount !== null && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Invoice Value:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency(email.amount, email.currency)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onPreviewAttachment(attachment, email)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-sky-600 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    onClick={() => onPreviewAttachment(attachment, email)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Download attachment"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
