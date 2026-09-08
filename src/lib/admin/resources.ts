/**
 * One description of every editable collection, so the dashboard is a single
 * generic list/form pair rather than eight near-identical CRUD screens.
 *
 * `crud` resources are things Saadan authors. `inbox` resources are things
 * visitors send him: read-only apart from a status and private notes.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "tags"
  | "image"
  | "url";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  help?: string;
  bucket?: "media" | "papers";
};

export type Resource = {
  key: string;
  table: string;
  label: string;
  singular: string;
  mode: "crud" | "inbox";
  titleField: string;
  listColumns: { name: string; label: string }[];
  fields: Field[];
  statusField?: string;
  statusOptions?: readonly string[];
  notesField?: string;
  defaultSort: { column: string; ascending: boolean };
  /** Public paths to refresh after a write. */
  revalidate: string[];
};

export const RESEARCH_AREAS = [
  "Political economy of internationalization",
  "Partnership management",
  "International student experience",
  "Internationalization theory",
  "Securitization of international students",
  "Intercultural competence development",
  "Displaced scholars, STEM access",
] as const;

export const WORK_CATEGORIES = [
  "Academic",
  "Research",
  "Publications",
  "International Education",
  "Global Engagement",
  "Strategy",
  "Writing",
  "Creative Work",
  "Projects",
] as const;

export const ORDER_STATUSES = [
  "new",
  "reviewing",
  "payment_instructions_sent",
  "payment_received",
  "preparing_shipment",
  "shipped",
  "completed",
  "cancelled",
] as const;

export const REQUEST_STATUSES = [
  "new",
  "under_review",
  "approved",
  "declined",
  "sent",
  "archived",
] as const;

export const MESSAGE_STATUSES = ["new", "read", "replied", "archived"] as const;

export const RESOURCES: Resource[] = [
  {
    key: "research",
    table: "research_items",
    label: "Research",
    singular: "Paper",
    mode: "crud",
    titleField: "title",
    defaultSort: { column: "sort_order", ascending: true },
    revalidate: ["/", "/research"],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "area", label: "Area" },
      { name: "access", label: "Access" },
      { name: "published", label: "Live" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, help: "Lowercase, dashes instead of spaces." },
      { name: "abstract", label: "Abstract", type: "longtext" },
      { name: "area", label: "Research area", type: "select", options: RESEARCH_AREAS },
      { name: "type", label: "Type", type: "text", help: "e.g. Working paper, Journal article" },
      { name: "date", label: "Status or date", type: "text", help: "e.g. In progress, Resubmitted, 2026" },
      { name: "co_authors", label: "Co-authors", type: "tags" },
      { name: "institution", label: "Institution", type: "text" },
      { name: "keywords", label: "Keywords", type: "tags" },
      { name: "citation", label: "Citation", type: "textarea" },
      { name: "doi_or_link", label: "DOI or link", type: "url" },
      { name: "pdf_path", label: "PDF", type: "image", bucket: "papers", help: "Private. Never linked publicly; you send it by hand after approving a request." },
      { name: "access", label: "Access", type: "select", options: ["restricted", "open"] },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    key: "work",
    table: "work_items",
    label: "Work",
    singular: "Entry",
    mode: "crud",
    titleField: "title",
    defaultSort: { column: "sort_order", ascending: true },
    revalidate: ["/", "/work"],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "date", label: "Date" },
      { name: "published", label: "Live" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: WORK_CATEGORIES },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "body", label: "Full description", type: "longtext" },
      { name: "date", label: "Date", type: "text", help: "Free text, e.g. 2024 or 2022–2024" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    key: "publications",
    table: "publications",
    label: "Publications",
    singular: "Publication",
    mode: "crud",
    titleField: "title",
    defaultSort: { column: "sort_order", ascending: true },
    revalidate: ["/publications"],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "kind", label: "Kind" },
      { name: "date", label: "Date" },
      { name: "published", label: "Live" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "kind", label: "Kind", type: "select", options: ["Book", "Article", "Essay", "Research Paper", "Other"] },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "date", label: "Date", type: "date" },
      { name: "external_link", label: "External link", type: "url" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    key: "journal",
    table: "blog_posts",
    label: "Journal",
    singular: "Post",
    mode: "crud",
    titleField: "title",
    defaultSort: { column: "published_at", ascending: false },
    revalidate: ["/journal"],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "published_at", label: "Date" },
      { name: "published", label: "Live" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "cover_image_path", label: "Cover image", type: "image", bucket: "media" },
      { name: "category", label: "Category", type: "text" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "reading_time", label: "Reading time", type: "text", help: "e.g. 6 min" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "longtext", help: "Blank lines separate paragraphs." },
      { name: "published_at", label: "Publish date", type: "date" },
      { name: "published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    key: "orders",
    table: "book_orders",
    label: "Book orders",
    singular: "Order",
    mode: "inbox",
    titleField: "full_name",
    statusField: "status",
    statusOptions: ORDER_STATUSES,
    notesField: "internal_notes",
    defaultSort: { column: "created_at", ascending: false },
    revalidate: [],
    listColumns: [
      { name: "full_name", label: "Name" },
      { name: "country", label: "Country" },
      { name: "quantity", label: "Qty" },
      { name: "status", label: "Status" },
      { name: "created_at", label: "Received" },
    ],
    fields: [
      { name: "full_name", label: "Full name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "shipping_address", label: "Shipping address", type: "textarea" },
      { name: "quantity", label: "Quantity", type: "number" },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
  {
    key: "requests",
    table: "research_access_requests",
    label: "Access requests",
    singular: "Request",
    mode: "inbox",
    titleField: "full_name",
    statusField: "status",
    statusOptions: REQUEST_STATUSES,
    notesField: "internal_notes",
    defaultSort: { column: "created_at", ascending: false },
    revalidate: [],
    listColumns: [
      { name: "full_name", label: "Name" },
      { name: "institution", label: "Institution" },
      { name: "country", label: "Country" },
      { name: "status", label: "Status" },
      { name: "created_at", label: "Received" },
    ],
    fields: [
      { name: "full_name", label: "Full name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "institution", label: "Institution", type: "text" },
      { name: "position", label: "Position", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "reason", label: "Reason for the request", type: "textarea" },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
  {
    key: "messages",
    table: "contact_messages",
    label: "Messages",
    singular: "Message",
    mode: "inbox",
    titleField: "name",
    statusField: "status",
    statusOptions: MESSAGE_STATUSES,
    notesField: "internal_notes",
    defaultSort: { column: "created_at", ascending: false },
    revalidate: [],
    listColumns: [
      { name: "name", label: "From" },
      { name: "subject", label: "Subject" },
      { name: "status", label: "Status" },
      { name: "created_at", label: "Received" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
  {
    key: "subscribers",
    table: "subscribers",
    label: "Subscribers",
    singular: "Subscriber",
    mode: "inbox",
    titleField: "email",
    statusField: "status",
    statusOptions: ["active", "unsubscribed"],
    defaultSort: { column: "created_at", ascending: false },
    revalidate: [],
    listColumns: [
      { name: "email", label: "Email" },
      { name: "status", label: "Status" },
      { name: "created_at", label: "Joined" },
    ],
    fields: [{ name: "email", label: "Email", type: "text" }],
  },
];

export function getResource(key: string): Resource | undefined {
  return RESOURCES.find((r) => r.key === key);
}

export function humanizeStatus(value: string): string {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
