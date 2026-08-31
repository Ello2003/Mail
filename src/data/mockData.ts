import { EmailAccount, EmailItem } from "../types";

export const INITIAL_ACCOUNTS: EmailAccount[] = [
  {
    id: "acc-icloud",
    name: "Personal iCloud",
    email: "graeme.diamond@icloud.com",
    type: "icloud",
    color: "#0284c7", // Sky blue (Apple iCloud)
    isActive: true,
    totalEmails: 1420,
    invoiceCount: 14,
    totalSpend: 4782.93,
    lastSync: "Just now",
  },
  {
    id: "acc-work",
    name: "Studio / Business Mail",
    email: "accounts@crazydiamond.design",
    type: "exchange",
    color: "#4f46e5", // Indigo (Work Exchange)
    isActive: true,
    totalEmails: 3890,
    invoiceCount: 22,
    totalSpend: 8431.14,
    lastSync: "3 minutes ago",
  },
  {
    id: "acc-gmail",
    name: "Graeme Personal",
    email: "graeme.crazydiamond@gmail.com",
    type: "gmail",
    color: "#059669", // Emerald
    isActive: true,
    totalEmails: 2150,
    invoiceCount: 12,
    totalSpend: 1948.45,
    lastSync: "12 minutes ago",
  },
];

export const INITIAL_EMAILS: EmailItem[] = [
  {
    id: "mail-001",
    accountId: "acc-icloud",
    accountName: "Personal iCloud",
    sender: "Apple Store <order-update@orders.apple.com>",
    senderEmail: "order-update@orders.apple.com",
    recipient: "graeme.diamond@icloud.com",
    subject: "Your receipt from Apple Store - Order #W109283741",
    date: "2026-08-21",
    category: "purchases",
    vendor: "Apple",
    vendorCategory: "Hardware & Electronics",
    amount: 1599.00,
    currency: "USD",
    orderId: "W109283741",
    invoiceNumber: "APL-STORE-W1092837",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay (Apple Card •••• 1088)",
    taxAmount: 139.91,
    taxDeductible: true,
    snippet: "Thank you for your order. Your Apple Studio Display - Standard Glass with Tilt-Adjustable Stand has shipped.",
    fullBody: `Apple Store Receipt

Order Date: August 21, 2026
Order Number: W109283741
Payment Method: Apple Pay (Apple Card ending in 1088)

Item Ordered:
- Apple Studio Display 27-inch 5K Retina Display
  Standard glass, Tilt-adjustable stand
  Part Number: MK0U3LL/A
  Qty: 1
  Price: $1,599.00

Subtotal: $1,599.00
Estimated Tax: $139.91
Total Paid: $1,738.91

Delivered via FedEx Priority Overnight tracking #482019481023.
AppleCare+ registered to serial number: H9DK20194L.`,
    lineItems: [
      { description: "Apple Studio Display 27-inch 5K Retina", quantity: 1, unitPrice: 1599.00, total: 1599.00 },
      { description: "California State & Local Sales Tax", total: 139.91 }
    ],
    attachments: [
      {
        id: "att-001",
        filename: "Apple_Store_Invoice_W109283741.pdf",
        size: 142800,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Official Apple Tax Invoice #APL-STORE-W1092837. Sold by Apple Inc., One Apple Park Way, Cupertino, CA. Total: $1,738.91 USD (Tax incl.)."
      },
      {
        id: "att-002",
        filename: "Apple_Care_Coverage_Summary.pdf",
        size: 89400,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "AppleCare+ Proof of Coverage for Studio Display S/N: H9DK20194L. Valid through August 2029."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-002",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Amazon Web Services <no-reply-aws@amazon.com>",
    senderEmail: "no-reply-aws@amazon.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Amazon Web Services Invoice [Account: 9182-3819-2018] - July 2026",
    date: "2026-08-02",
    category: "invoices",
    vendor: "AWS",
    vendorCategory: "Cloud Infrastructure",
    amount: 312.45,
    currency: "USD",
    invoiceNumber: "AWS-2026-08-9128",
    orderId: "AWS-918238192018",
    paymentStatus: "paid",
    paymentMethod: "Corporate Visa •••• 9012",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Your AWS statement is now available for download. Amount billed: $312.45 automatically charged to Visa ending in 9012.",
    fullBody: `Amazon Web Services, Inc.
Invoice Summary for Billing Period: July 1 - July 31, 2026
Account ID: 9182-3819-2018
Invoice Number: AWS-2026-08-9128

Breakdown by Service:
- Amazon Elastic Compute Cloud (EC2): $184.20
  Instances: c6i.xlarge, t4g.small production cluster
- Amazon Simple Storage Service (S3): $48.30
  Storage: 3.4 TB standard tier, 180,000 GET/PUT requests
- Amazon CloudFront CDN: $38.95
  Data transfer out: 2.1 TB worldwide
- Amazon Route 53 & CloudWatch: $41.00

Total Amount Due: $312.45
Payment Status: PAID automatically on August 2, 2026 via Visa •••• 9012.`,
    lineItems: [
      { description: "Amazon EC2 Compute Instances", total: 184.20 },
      { description: "Amazon S3 Storage & API Calls", total: 48.30 },
      { description: "Amazon CloudFront Global CDN", total: 38.95 },
      { description: "Amazon Route 53 & CloudWatch Metrics", total: 41.00 }
    ],
    attachments: [
      {
        id: "att-003",
        filename: "AWS_Invoice_July2026_9128.pdf",
        size: 318200,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "AWS Tax Invoice: Amazon Web Services, Inc. P.O. Box 81226, Seattle, WA 98108. Total Billed: $312.45."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-003",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Adobe Creative Cloud <billing@adobe.com>",
    senderEmail: "billing@adobe.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Your Adobe Creative Cloud subscription renewal receipt",
    date: "2026-08-15",
    category: "invoices",
    vendor: "Adobe",
    vendorCategory: "Design Software",
    amount: 59.99,
    currency: "USD",
    invoiceNumber: "ADOBE-CC-409182",
    paymentStatus: "paid",
    paymentMethod: "Corporate Mastercard •••• 4410",
    taxAmount: 5.40,
    taxDeductible: true,
    snippet: "Thank you for your business. We have successfully charged $59.99 for your Creative Cloud All Apps membership.",
    fullBody: `Adobe Inc.
Subscription Renewal Confirmation
Invoice #: ADOBE-CC-409182
Billing Date: August 15, 2026

Subscription: Creative Cloud All Apps (Annual, paid monthly)
Applications included: Photoshop, Illustrator, After Effects, InDesign, Premiere Pro, Lightroom.
Billing period: August 15, 2026 - September 14, 2026
Subtotal: $54.59
VAT / Sales Tax: $5.40
Total: $59.99 USD
Paid with Mastercard ending in 4410.`,
    lineItems: [
      { description: "Creative Cloud All Apps Monthly Renewal", quantity: 1, unitPrice: 54.59, total: 54.59 },
      { description: "Sales Tax", total: 5.40 }
    ],
    attachments: [
      {
        id: "att-004",
        filename: "Adobe_Invoice_ADOBE-CC-409182.pdf",
        size: 92300,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Adobe Systems Software Ireland Limited. Invoice #ADOBE-CC-409182. Total Paid: $59.99 USD."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-004",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "GitHub Billing <billing@github.com>",
    senderEmail: "billing@github.com",
    recipient: "accounts@crazydiamond.design",
    subject: "GitHub receipt for August 2026 - Org: CrazyDiamond-Studio",
    date: "2026-08-01",
    category: "invoices",
    vendor: "GitHub",
    vendorCategory: "Developer Tools",
    amount: 84.00,
    currency: "USD",
    invoiceNumber: "GH-INV-55102",
    paymentStatus: "paid",
    paymentMethod: "Corporate Visa •••• 9012",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Your receipt for CrazyDiamond-Studio organization. 4 Team seats and GitHub Copilot Business seats.",
    fullBody: `GitHub, Inc.
Receipt for CrazyDiamond-Studio
Billing period: Aug 1, 2026 - Aug 31, 2026

Items:
- GitHub Team (4 seats @ $4.00/seat): $16.00
- GitHub Copilot Business (4 seats @ $19.00/seat): $76.00
- GitHub Actions Compute (1,200 min extra): $8.00
- Promotional discount applied: -$16.00
Total Paid: $84.00 USD
Card ending in 9012 charged successfully.`,
    lineItems: [
      { description: "GitHub Team Seats (4x)", quantity: 4, unitPrice: 4.00, total: 16.00 },
      { description: "GitHub Copilot Business (4x)", quantity: 4, unitPrice: 19.00, total: 76.00 },
      { description: "GitHub Actions Extra Runner Minutes", total: 8.00 },
      { description: "Startup Team Credit Discount", total: -16.00 }
    ],
    attachments: [
      {
        id: "att-005",
        filename: "GitHub_Receipt_GH-55102.pdf",
        size: 76400,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107. Total Amount: $84.00 USD."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-005",
    accountId: "acc-icloud",
    accountName: "Personal iCloud",
    sender: "Apple Services <do_not_reply@email.apple.com>",
    senderEmail: "do_not_reply@email.apple.com",
    recipient: "graeme.diamond@icloud.com",
    subject: "Your receipt from Apple for iCloud+ 2TB and Apple One Premier",
    date: "2026-08-08",
    category: "invoices",
    vendor: "Apple",
    vendorCategory: "Cloud Subscriptions",
    amount: 37.95,
    currency: "USD",
    invoiceNumber: "APL-SVC-9482103",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay (Apple Card •••• 1088)",
    taxAmount: 0.00,
    taxDeductible: false,
    snippet: "Your monthly subscription receipt for Apple One Premier and iCloud+ Storage. Billed to Apple Card.",
    fullBody: `Apple Services Receipt
Billed To: Graeme Diamond
Apple ID: graeme.diamond@icloud.com
Invoice: APL-SVC-9482103
Date: Aug 8, 2026

Subscriptions:
- Apple One Premier (Monthly): $37.95
  Includes: Apple Music Family, Apple TV+, Apple Arcade, iCloud+ 2TB, Apple News+, Apple Fitness+.
Amount charged: $37.95
Apple Card 3% Daily Cash earned: $1.14.`,
    lineItems: [
      { description: "Apple One Premier Monthly Bundle", quantity: 1, unitPrice: 37.95, total: 37.95 }
    ],
    attachments: [
      {
        id: "att-006",
        filename: "Apple_Services_Receipt_9482103.pdf",
        size: 64200,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Apple Distribution International Ltd. Document #: APL-SVC-9482103. Total: $37.95 USD."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-006",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Figma Billing <invoice@figma.com>",
    senderEmail: "invoice@figma.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Figma Organization Invoice #FIG-INV-99214",
    date: "2026-08-10",
    category: "invoices",
    vendor: "Figma",
    vendorCategory: "Design Software",
    amount: 180.00,
    currency: "USD",
    invoiceNumber: "FIG-INV-99214",
    paymentStatus: "paid",
    paymentMethod: "Corporate Visa •••• 9012",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Invoice for Figma Organization Workspace. 4 full design seats and FigJam enterprise collaborator licenses.",
    fullBody: `Figma, Inc.
760 Market St, Floor 10
San Francisco, CA 94102

Invoice Number: FIG-INV-99214
Invoice Date: August 10, 2026
Due Date: August 10, 2026 (Paid)

Items:
- Figma Design Editor Seats (4x @ $45/mo): $180.00
- FigJam Unlimited Collaborators: Included ($0.00)
Subtotal: $180.00
Total Amount: $180.00 USD
Payment Received with thanks.`,
    lineItems: [
      { description: "Figma Organization Editor Seat (4x)", quantity: 4, unitPrice: 45.00, total: 180.00 }
    ],
    attachments: [
      {
        id: "att-007",
        filename: "Figma_Invoice_FIG-99214.pdf",
        size: 114000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Figma Inc. Official Invoice FIG-INV-99214. Total: $180.00 USD. Status: Paid."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-007",
    accountId: "acc-gmail",
    accountName: "Graeme Personal",
    sender: "Delta Air Lines <ticketreceipt@delta.com>",
    senderEmail: "ticketreceipt@delta.com",
    recipient: "graeme.crazydiamond@gmail.com",
    subject: "Your Flight Receipt: San Francisco (SFO) to New York (JFK) - E-Ticket #006-2391028371",
    date: "2026-07-28",
    category: "travel",
    vendor: "Delta Air Lines",
    vendorCategory: "Airlines & Travel",
    amount: 684.20,
    currency: "USD",
    orderId: "DL-HT892Y",
    invoiceNumber: "006-2391028371",
    paymentStatus: "paid",
    paymentMethod: "Amex Platinum •••• 1004",
    taxAmount: 58.40,
    taxDeductible: true,
    snippet: "Your e-ticket confirmation and receipt for passenger Graeme Diamond. Confirmation code: HT892Y.",
    fullBody: `Delta Air Lines Passenger Receipt
Passenger: Graeme Diamond
Confirmation Code: HT892Y
Ticket #: 006-2391028371
Date of Purchase: July 28, 2026

Flight Details:
- Flight DL 492: SFO -> JFK (Comfort+, Main Cabin)
  Departs: Aug 24, 2026 at 08:15 AM
- Flight DL 518: JFK -> SFO (Comfort+, Main Cabin)
  Departs: Aug 29, 2026 at 05:40 PM

Fare: $625.80
Taxes & Carrier-imposed fees (US Sept 11, Segment tax, PFC): $58.40
Total Ticket Price: $684.20 USD
Charged to American Express ending 1004.`,
    lineItems: [
      { description: "Roundtrip Airfare SFO-JFK Comfort+", quantity: 1, unitPrice: 625.80, total: 625.80 },
      { description: "US Transportation Tax & Airport Fees", total: 58.40 }
    ],
    attachments: [
      {
        id: "att-008",
        filename: "Delta_AirLines_Receipt_HT892Y.pdf",
        size: 198000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Delta Air Lines Passenger Itinerary and Receipt. E-ticket 006-2391028371. Confirmation: HT892Y. Total: $684.20."
      },
      {
        id: "att-009",
        filename: "Boarding_Pass_DL492_SFO_JFK.pdf",
        size: 84000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Mobile Boarding Pass: Seat 14A. Zone 3 Priority. SFO Terminal 2 to JFK Terminal 4."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-008",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Uber Receipts <uber.us@uber.com>",
    senderEmail: "uber.us@uber.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Your Tuesday morning trip with Uber [Business Profile]",
    date: "2026-08-18",
    category: "travel",
    vendor: "Uber",
    vendorCategory: "Ground Transport",
    amount: 68.50,
    currency: "USD",
    invoiceNumber: "UBER-TRIP-9912048",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay (Corporate Visa •••• 9012)",
    taxAmount: 4.80,
    taxDeductible: true,
    snippet: "Total: $68.50. You rode with Uber Black from Downtown Financial District to SFO International Airport.",
    fullBody: `Uber Business Receipt
Trip Date: August 18, 2026
Driver: Carlos (4.98 stars, Tesla Model Y)

Pickup: 555 California St, San Francisco, CA (06:14 AM)
Dropoff: SFO Terminal 2 - Departures (06:48 AM)
Distance: 15.2 miles | Duration: 34 mins

Trip Fare Breakdown:
Base Fare: $12.00
Distance & Time: $42.30
Airport Surcharge: $5.00
Sales Tax: $4.80
Tip: $4.40
Total Billed: $68.50 USD
Expense Code: CLIENT-DELIVERY-TRANSPORT`,
    lineItems: [
      { description: "Uber Ride: Financial District to SFO", total: 59.30 },
      { description: "Airport Access Fee & Local Tax", total: 4.80 },
      { description: "Driver Tip", total: 4.40 }
    ],
    attachments: [
      {
        id: "att-010",
        filename: "Uber_Business_Receipt_Aug18.pdf",
        size: 52100,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Uber Technologies, Inc. Trip Invoice #UBER-TRIP-9912048. Total: $68.50 USD."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-009",
    accountId: "acc-gmail",
    accountName: "Graeme Personal",
    sender: "Amazon.com <auto-confirm@amazon.com>",
    senderEmail: "auto-confirm@amazon.com",
    recipient: "graeme.crazydiamond@gmail.com",
    subject: "Order Confirmation: Logitech MX Master 3S and CalDigit TS4 Dock",
    date: "2026-08-04",
    category: "purchases",
    vendor: "Amazon",
    vendorCategory: "Hardware & Accessories",
    amount: 519.94,
    currency: "USD",
    orderId: "114-9928172-3341829",
    invoiceNumber: "AMZN-114-9928172",
    paymentStatus: "paid",
    paymentMethod: "Visa ending in 4242",
    taxAmount: 42.94,
    taxDeductible: true,
    snippet: "Order #114-9928172-3341829. Your items will arrive Wednesday, Aug 5. Guaranteed Prime delivery.",
    fullBody: `Amazon.com Order Confirmation
Order #114-9928172-3341829
Order Placed: August 4, 2026

Items Ordered:
1. CalDigit TS4 Thunderbolt 4 Dock (18 Ports, 98W Charging)
   Sold by: CalDigit Official
   Condition: New
   Price: $399.95
2. Logitech MX Master 3S Performance Wireless Mouse (Space Gray)
   Sold by: Amazon.com Services LLC
   Condition: New
   Price: $99.99

Item Subtotal: $499.94
Shipping & Handling: $0.00 (Prime Free Delivery)
Estimated Tax: $20.00
Total Before Tax: $499.94
Grand Total: $519.94 USD
Payment Method: Amazon Prime Rewards Visa •••• 4242`,
    lineItems: [
      { description: "CalDigit TS4 Thunderbolt 4 Dock", quantity: 1, unitPrice: 399.95, total: 399.95 },
      { description: "Logitech MX Master 3S Wireless Mouse", quantity: 1, unitPrice: 99.99, total: 99.99 },
      { description: "Sales Tax", total: 20.00 }
    ],
    attachments: [
      {
        id: "att-011",
        filename: "Amazon_Invoice_114-9928172.pdf",
        size: 165000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Amazon.com Tax Invoice Order #114-9928172-3341829. Total: $519.94 USD."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-010",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Stripe Billing <invoices@stripe.com>",
    senderEmail: "invoices@stripe.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Stripe Monthly Processing Fees Statement - July 2026",
    date: "2026-08-01",
    category: "tax",
    vendor: "Stripe",
    vendorCategory: "Payment Processing & Financial",
    amount: 142.30,
    currency: "USD",
    invoiceNumber: "STRIPE-FEE-2026-07",
    paymentStatus: "paid",
    paymentMethod: "Deducted from Account Payouts",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Your Stripe processing fee invoice is ready. Total card processing fees and Radar fraud charges: $142.30.",
    fullBody: `Stripe, Inc.
Monthly Statement of Fees
Merchant: Crazy Diamond Design LLC
Account ID: acct_1K928J019283
Period: July 1 - July 31, 2026

Summary of Gross Volume: $8,450.00
Disputes: $0.00
Net Payouts: $8,307.70

Stripe Processing Fees:
- 2.9% + 30c Card Processing Fees: $136.20
- Stripe Radar Fraud Protection: $6.10
Total Fees Incurred: $142.30 USD
These fees are direct ordinary and necessary business expenses for tax reporting.`,
    lineItems: [
      { description: "Merchant Card Processing Fees (Stripe)", total: 136.20 },
      { description: "Stripe Radar Security Protection", total: 6.10 }
    ],
    attachments: [
      {
        id: "att-012",
        filename: "Stripe_Fee_Statement_July2026.pdf",
        size: 122000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Stripe, Inc. Statement of Merchant Fees. Period: July 2026. Total Fees Deducted: $142.30."
      },
      {
        id: "att-013",
        filename: "Stripe_Transactions_Export_July2026.csv",
        size: 48900,
        mimeType: "text/csv",
        extension: "csv",
        previewType: "spreadsheet",
        previewContent: "Date,Charge_ID,Gross_Amount,Fee,Net,Customer_Email\n2026-07-04,ch_3J09,3500.00,101.80,3398.20,finance@techcorp.io\n2026-07-18,ch_3J14,4950.00,40.50,4909.50,billing@apexventures.com"
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-011",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "OpenAI <billing@openai.com>",
    senderEmail: "billing@openai.com",
    recipient: "accounts@crazydiamond.design",
    subject: "OpenAI API Usage Invoice #OAI-2026-07-3312",
    date: "2026-08-01",
    category: "invoices",
    vendor: "OpenAI",
    vendorCategory: "AI API Services",
    amount: 96.30,
    currency: "USD",
    invoiceNumber: "OAI-2026-07-3312",
    paymentStatus: "paid",
    paymentMethod: "Corporate Visa •••• 9012",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Receipt for your OpenAI API usage in July 2026. Total token usage across models: $96.30 billed.",
    fullBody: `OpenAI, LLC
3180 18th St, San Francisco, CA 94110
Invoice: OAI-2026-07-3312
Date: August 1, 2026

API Usage Summary:
- GPT-4o input/output tokens (3.8M tokens): $64.20
- Embeddings text-embedding-3-small (45M tokens): $9.10
- Whisper Audio Transcription API (1,150 mins): $23.00
Total Billed: $96.30 USD
Automatic payment was processed successfully.`,
    lineItems: [
      { description: "GPT-4o API Token Consumption", total: 64.20 },
      { description: "Text Embedding Generation", total: 9.10 },
      { description: "Whisper Audio Transcription", total: 23.00 }
    ],
    attachments: [
      {
        id: "att-014",
        filename: "OpenAI_Invoice_OAI-3312.pdf",
        size: 94000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "OpenAI LLC Tax Invoice OAI-2026-07-3312. Total: $96.30 USD. Status: Paid."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-012",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "DocuSign <dse_na3@docusign.net>",
    senderEmail: "dse_na3@docusign.net",
    recipient: "accounts@crazydiamond.design",
    subject: "Completed: Master Services Agreement - Apex Ventures & Crazy Diamond Design",
    date: "2026-07-15",
    category: "contracts",
    vendor: "DocuSign / Apex Ventures",
    vendorCategory: "Legal & Contracts",
    amount: null,
    currency: "USD",
    invoiceNumber: "DOCUSIGN-MSA-8819",
    paymentStatus: "paid",
    taxDeductible: false,
    snippet: "All parties have completed signing Master Services Agreement & Scope of Work. Signed copy attached.",
    fullBody: `DocuSign Envelope ID: 8819024B-F910-4829-91A2-84192081948B
Document Title: Master Services Agreement & Statement of Work #2026-01

Parties:
1. Crazy Diamond Design LLC ("Provider")
2. Apex Ventures International LLC ("Client")

Contract Value: $48,000 Milestone Contract
Scope: Design System Architecture, Full-Stack Design Token Pipeline, and Component Spec.
Status: Fully Executed by all signatories.
Completed on July 15, 2026.`,
    lineItems: [],
    attachments: [
      {
        id: "att-015",
        filename: "Master_Services_Agreement_Apex_Executed.pdf",
        size: 890000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "MASTER SERVICES AGREEMENT\nThis Agreement is entered into by and between Apex Ventures and Crazy Diamond Design LLC. 18 pages fully signed with DocuSign cryptographic certificate."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-013",
    accountId: "acc-icloud",
    accountName: "Personal iCloud",
    sender: "B&H Photo Video <ordstatus@bhphotovideo.com>",
    senderEmail: "ordstatus@bhphotovideo.com",
    recipient: "graeme.diamond@icloud.com",
    subject: "Order Confirmation #BH-8849120 - Sony FE 24-70mm f/2.8 GM II",
    date: "2026-07-10",
    category: "purchases",
    vendor: "B&H Photo Video",
    vendorCategory: "Camera Equipment",
    amount: 2298.00,
    currency: "USD",
    orderId: "BH-8849120",
    invoiceNumber: "BH-INV-8849120",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay (Payboo Card)",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Thank you for shopping with B&H. Your order for the Sony FE 24-70mm f/2.8 GM II Lens is confirmed and processing.",
    fullBody: `B&H Foto & Electronics Corp.
420 9th Ave, New York, NY 10001
Order #: BH-8849120
Order Date: July 10, 2026

Items:
- Sony FE 24-70mm f/2.8 GM II Lens (E-Mount)
  SKU: SO2470282
  Price: $2,298.00
  Savings via Payboo Tax Benefit: -$201.08 equivalent
Total Paid: $2,298.00 USD
Shipped via UPS 2-Day Air tracking #1Z9928192019481920.`,
    lineItems: [
      { description: "Sony FE 24-70mm f/2.8 GM II Lens", quantity: 1, unitPrice: 2298.00, total: 2298.00 }
    ],
    attachments: [
      {
        id: "att-016",
        filename: "BH_Photo_Invoice_8849120.pdf",
        size: 178000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "B&H Photo Video Commercial Tax Invoice BH-INV-8849120. Total Paid: $2,298.00."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-014",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Vercel Billing <billing@vercel.com>",
    senderEmail: "billing@vercel.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Vercel Pro Subscription Invoice #VCL-993812",
    date: "2026-08-05",
    category: "invoices",
    vendor: "Vercel",
    vendorCategory: "Cloud Hosting & Deployment",
    amount: 40.00,
    currency: "USD",
    invoiceNumber: "VCL-993812",
    paymentStatus: "paid",
    paymentMethod: "Corporate Visa •••• 9012",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Receipt for Team CrazyDiamond Pro plan (2 team members). Charged to Visa ending in 9012.",
    fullBody: `Vercel Inc.
440 N Barranca Ave #4133, Covina, CA 91723
Invoice: VCL-993812
Date: August 5, 2026

Items:
- Vercel Pro Plan (2 Members @ $20.00/mo): $40.00
- Fast Data Transfer (Under 1 TB): Included
- Edge Functions Invocations: Included
Total Charged: $40.00 USD
Thank you for building on the frontend cloud!`,
    lineItems: [
      { description: "Vercel Pro Plan (2 Team Seats)", quantity: 2, unitPrice: 20.00, total: 40.00 }
    ],
    attachments: [
      {
        id: "att-017",
        filename: "Vercel_Invoice_VCL-993812.pdf",
        size: 82000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Vercel Inc. Tax Receipt VCL-993812. Total: $40.00 USD. Status: Paid."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-015",
    accountId: "acc-gmail",
    accountName: "Graeme Personal",
    sender: "Airbnb <automated@airbnb.com>",
    senderEmail: "automated@airbnb.com",
    recipient: "graeme.crazydiamond@gmail.com",
    subject: "Reservation Confirmed: DUMBO Loft Apartment (Aug 24-29) - Receipt #HM938201",
    date: "2026-07-29",
    category: "travel",
    vendor: "Airbnb",
    vendorCategory: "Accommodations",
    amount: 890.50,
    currency: "USD",
    orderId: "HM938201",
    invoiceNumber: "AIRBNB-HM938201",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay (Amex Platinum •••• 1004)",
    taxAmount: 96.50,
    taxDeductible: true,
    snippet: "Your reservation in Brooklyn, New York is confirmed! 5 nights at DUMBO Designer Loft with skyline views.",
    fullBody: `Airbnb Customer Receipt
Reservation Code: HM938201
Host: Sarah Jenkins
Property: Sun-Drenched DUMBO Loft with Manhattan Skyline Views
Check-in: Monday, Aug 24, 2026 (03:00 PM)
Check-out: Saturday, Aug 29, 2026 (11:00 AM)

Price Breakdown:
- $135.00 x 5 nights: $675.00
- Cleaning fee: $75.00
- Airbnb Service fee: $44.00
- NYC Hotel Occupancy Tax: $96.50
Total: $890.50 USD
Paid in full on July 29, 2026 via Apple Pay.`,
    lineItems: [
      { description: "5 Nights Lodging DUMBO Loft", quantity: 5, unitPrice: 135.00, total: 675.00 },
      { description: "Cleaning & Turnover Fee", total: 75.00 },
      { description: "Airbnb Guest Service Fee", total: 44.00 },
      { description: "NYC Hotel Occupancy Tax", total: 96.50 }
    ],
    attachments: [
      {
        id: "att-018",
        filename: "Airbnb_Receipt_HM938201.pdf",
        size: 145000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Airbnb Payments Inc., 888 Brannan St, San Francisco, CA. Official Guest Tax Receipt. Total: $890.50 USD."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-016",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "California FTB <notice@ftb.ca.gov>",
    senderEmail: "notice@ftb.ca.gov",
    recipient: "accounts@crazydiamond.design",
    subject: "Electronic Payment Confirmation: California Annual LLC Tax - Form 3522",
    date: "2026-06-15",
    category: "tax",
    vendor: "California Franchise Tax Board",
    vendorCategory: "State Taxes",
    amount: 800.00,
    currency: "USD",
    invoiceNumber: "FTB-2026-9921",
    paymentStatus: "paid",
    paymentMethod: "Direct Debit (Business Checking •••• 5510)",
    taxAmount: 800.00,
    taxDeductible: true,
    snippet: "State of California Franchise Tax Board payment receipt for $800.00. Tax Year 2026 LLC Annual Tax.",
    fullBody: `State of California
Franchise Tax Board
Web Pay Business Confirmation

Entity Name: Crazy Diamond Design LLC
California Secretary of State #: 20220918231
Tax Form: Form 3522 (Large & Small LLC Annual Tax)
Tax Year: 2026
Payment Amount: $800.00
Confirmation Number: FTB-2026-9921
Effective Date: June 15, 2026
Bank Account: Business Checking ending in 5510
Status: Settled & Recorded.`,
    lineItems: [
      { description: "California Annual LLC Franchise Tax (Form 3522)", total: 800.00 }
    ],
    attachments: [
      {
        id: "att-019",
        filename: "FTB_Payment_Receipt_3522_2026.pdf",
        size: 67000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "State of California Franchise Tax Board Electronic Payment Confirmation FTB-2026-9921. Amount: $800.00."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-017",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "DigitalOcean Invoicing <billing@digitalocean.com>",
    senderEmail: "billing@digitalocean.com",
    recipient: "accounts@crazydiamond.design",
    subject: "DigitalOcean Invoice #DO-9920194 (Action Required: Payment Due in 7 Days)",
    date: "2026-08-25",
    category: "invoices",
    vendor: "DigitalOcean",
    vendorCategory: "Cloud Infrastructure",
    amount: 148.00,
    currency: "USD",
    invoiceNumber: "DO-9920194",
    paymentStatus: "due",
    paymentMethod: "Invoice Net-15 (Corporate Card on file)",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Your DigitalOcean monthly invoice for Droplets and Managed PostgreSQL is ready. Due September 1, 2026.",
    fullBody: `DigitalOcean, LLC
101 Avenue of the Americas, 10th Floor, New York, NY 10013
Invoice #: DO-9920194
Date of Issue: August 25, 2026
Due Date: September 1, 2026 (Pending Auto-Charge)

Service Breakdown:
- 2x Standard Droplet (8GB RAM, 4 vCPUs - Staging): $96.00
- Managed PostgreSQL Cluster (Single node): $35.00
- Automated Backups & Snapshots: $17.00
Total Amount Due: $148.00 USD
Your primary corporate card will be automatically charged on the due date.`,
    lineItems: [
      { description: "2x Standard Droplets (Staging)", quantity: 2, unitPrice: 48.00, total: 96.00 },
      { description: "Managed PostgreSQL Database Node", total: 35.00 },
      { description: "Automated Daily Snapshots & Backups", total: 17.00 }
    ],
    attachments: [
      {
        id: "att-020",
        filename: "DigitalOcean_Invoice_DO-9920194.pdf",
        size: 98000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "DigitalOcean Tax Invoice #DO-9920194. Amount: $148.00 USD. Status: Due."
      }
    ],
    isStarred: true,
    aiAnalyzed: true
  },
  {
    id: "mail-018",
    accountId: "acc-gmail",
    accountName: "Graeme Personal",
    sender: "Twelve South <support@twelvesouth.com>",
    senderEmail: "support@twelvesouth.com",
    recipient: "graeme.crazydiamond@gmail.com",
    subject: "Order #TS-94812 confirmed: HiRise Pro for Studio Display & PowerPic Mod",
    date: "2026-08-22",
    category: "purchases",
    vendor: "Twelve South",
    vendorCategory: "Apple Accessories",
    amount: 179.98,
    currency: "USD",
    orderId: "TS-94812",
    invoiceNumber: "TS-INV-94812",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay (Visa ending 4242)",
    taxAmount: 14.80,
    taxDeductible: true,
    snippet: "Thanks for your order with Twelve South! Designed exclusively for Apple products. Shipping via USPS Priority.",
    fullBody: `Twelve South LLC
Order Confirmation #TS-94812
Order Date: August 22, 2026

Items:
1. HiRise Pro Height-Adjustable Stand for Studio Display (Gunmetal)
   Qty: 1 | Price: $149.99
2. PowerPic mod Wireless Phone Charger (White Marble)
   Qty: 1 | Price: $29.99

Subtotal: $179.98
Shipping: Free USPS Priority
Sales Tax: $14.80
Total Paid: $194.78 USD
Apple Pay authorization complete.`,
    lineItems: [
      { description: "HiRise Pro Stand for Studio Display", quantity: 1, unitPrice: 149.99, total: 149.99 },
      { description: "PowerPic mod Wireless Phone Charger", quantity: 1, unitPrice: 29.99, total: 29.99 },
      { description: "State Tax", total: 14.80 }
    ],
    attachments: [
      {
        id: "att-021",
        filename: "TwelveSouth_Receipt_TS-94812.pdf",
        size: 78000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Twelve South LLC Customer Receipt Order #TS-94812. Total: $194.78."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-019",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Slack Technologies <feedback@slack.com>",
    senderEmail: "feedback@slack.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Your Slack invoice for workspace: CrazyDiamond-HQ (Invoice #SLK-2026-77192)",
    date: "2026-08-01",
    category: "invoices",
    vendor: "Slack",
    vendorCategory: "Collaboration Software",
    amount: 125.00,
    currency: "USD",
    invoiceNumber: "SLK-2026-77192",
    paymentStatus: "paid",
    paymentMethod: "Corporate Visa •••• 9012",
    taxAmount: 0.00,
    taxDeductible: true,
    snippet: "Your receipt for Slack Business+ plan. 10 active members on CrazyDiamond-HQ workspace.",
    fullBody: `Slack Technologies Limited / Salesforce
Invoice: SLK-2026-77192
Workspace: CrazyDiamond-HQ.slack.com
Plan: Business+ Monthly

Summary:
- 10 Active members @ $12.50/seat: $125.00
- Fair Billing policy adjustment: -$0.00
Total Charged: $125.00 USD
Card ending in 9012 was charged on August 1, 2026.`,
    lineItems: [
      { description: "Slack Business+ Monthly Seats (10x)", quantity: 10, unitPrice: 12.50, total: 125.00 }
    ],
    attachments: [
      {
        id: "att-022",
        filename: "Slack_Invoice_SLK-77192.pdf",
        size: 88000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Slack Technologies LLC. Tax Invoice SLK-2026-77192. Amount: $125.00 USD. Status: Paid."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  },
  {
    id: "mail-020",
    accountId: "acc-work",
    accountName: "Studio / Business Mail",
    sender: "Acme Legal Partners <counsel@acmelegal.com>",
    senderEmail: "counsel@acmelegal.com",
    recipient: "accounts@crazydiamond.design",
    subject: "Executed Mutual NDA & IP Addendum - Ready for Archive",
    date: "2026-06-20",
    category: "contracts",
    vendor: "Acme Legal Partners",
    vendorCategory: "Legal",
    amount: null,
    currency: "USD",
    invoiceNumber: "MNDA-2026-06",
    paymentStatus: "paid",
    taxDeductible: false,
    snippet: "Attached is the countersigned Mutual Non-Disclosure Agreement and Patent Proprietary Assignment addendum.",
    fullBody: `Hi Graeme,

Attached for your corporate legal repository is the fully countersigned Mutual Non-Disclosure Agreement (MNDA) executed between Crazy Diamond Design LLC and Horizon Robotics Inc.

Term: 3 years from effective date
Jurisdiction: State of California
Protected Assets: proprietary algorithms, design systems, vector specs.

Best regards,
Elena Rostova, Senior Partner
Acme Legal Partners LLP`,
    lineItems: [],
    attachments: [
      {
        id: "att-023",
        filename: "Executed_MNDA_HorizonRobotics.pdf",
        size: 420000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "MUTUAL NON-DISCLOSURE AGREEMENT\nEffective Date: June 20, 2026. Parties agree to strict confidentiality for confidential design documents."
      },
      {
        id: "att-024",
        filename: "IP_Proprietary_Information_Addendum.pdf",
        size: 190000,
        mimeType: "application/pdf",
        extension: "pdf",
        previewType: "pdf",
        previewContent: "Addendum A: Intellectual Property Rights & Work Product Assignment."
      }
    ],
    isStarred: false,
    aiAnalyzed: true
  }
];
