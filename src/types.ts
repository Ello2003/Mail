export type CategoryType = 
  | "invoices" 
  | "purchases" 
  | "travel" 
  | "tax" 
  | "contracts" 
  | "documents" 
  | "other";

export type PaymentStatus = "paid" | "due" | "pending" | "refunded";

export interface Attachment {
  id: string;
  filename: string;
  size: number; // bytes
  mimeType: string;
  extension: string;
  previewType?: "pdf" | "image" | "spreadsheet" | "document" | "zip";
  previewContent?: string;
  downloadUrl?: string;
}

export interface LineItem {
  description: string;
  quantity?: number;
  unitPrice?: number;
  total: number;
}

export interface EmailItem {
  id: string;
  accountId: string;
  accountName: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  date: string; // ISO format YYYY-MM-DD
  category: CategoryType;
  vendor: string;
  vendorCategory?: string;
  amount: number | null;
  currency: string;
  invoiceNumber?: string | null;
  orderId?: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  taxAmount?: number | null;
  taxDeductible: boolean;
  attachments: Attachment[];
  snippet: string;
  fullBody: string;
  lineItems?: LineItem[];
  isStarred?: boolean;
  isFlagged?: boolean;
  aiAnalyzed?: boolean;
}

export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  type: "icloud" | "exchange" | "imap" | "gmail" | "custom";
  color: string; // Hex or tailwind identifier
  isActive: boolean;
  totalEmails: number;
  invoiceCount: number;
  totalSpend: number;
  lastSync: string;
}

export interface FilterOptions {
  searchQuery: string;
  selectedAccountId: string; // "all" or specific account ID
  selectedCategory: string; // "all" or CategoryType
  dateRange: "all" | "30d" | "90d" | "ytd" | "year";
  paymentStatus: "all" | PaymentStatus;
  minAmount?: number;
  maxAmount?: number;
  hasAttachmentsOnly: boolean;
  taxDeductibleOnly: boolean;
  attachmentType: "all" | "pdf" | "image" | "spreadsheet" | "doc" | "zip";
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "vendor";
}
