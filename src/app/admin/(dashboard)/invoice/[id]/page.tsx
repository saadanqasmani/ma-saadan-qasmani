import Link from "next/link";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Pinyon_Script, Work_Sans } from "next/font/google";
import { getAdminClient } from "@/lib/supabase/admin";
import { invoiceFromOrder } from "@/lib/book/invoice";
import { invoicePayee } from "@/lib/email/order";
import { isRegion } from "@/lib/book/regions";
import { InvoiceSheet } from "@/components/admin/Invoice";

export const dynamic = "force-dynamic";

/**
 * One order's invoice, filled in and ready to go.
 *
 * The three faces the invoice was drawn in are loaded here rather than in
 * the site's own font module: they belong to one page behind a login, and
 * nobody reading the novel should be made to download a wedding script.
 * They are declared as variables so the sheet can name them in plain CSS.
 */
const invSerif = Cormorant_Garamond({
  variable: "--font-inv-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const invSans = Work_Sans({
  variable: "--font-inv-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const invScript = Pinyon_Script({
  variable: "--font-inv-script",
  subsets: ["latin"],
  weight: "400",
});

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const db = getAdminClient();
  if (!db) notFound();

  const { data } = await db.from("book_orders").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  // Which account the money is to be sent to depends on where the order was
  // placed: Easypaisa in Pakistan, a transfer in Türkiye, and for anywhere
  // else nothing is filled in, because there is no standing arrangement to
  // fill in and a guessed account number is worse than an empty line.
  const region = isRegion(data.region) ? data.region : null;
  const invoice = invoiceFromOrder(data, invoicePayee(region));

  return (
    <div className={`${invSerif.variable} ${invSans.variable} ${invScript.variable}`}>
      <div className="inv-bar mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">Invoice</p>
          <h1 className="t-h2 mt-1">{String(data.full_name ?? "Order")}</h1>
        </div>
        <Link
          href="/admin/orders"
          className="t-label text-ink-faint underline-offset-4 hover:text-ink hover:underline"
        >
          ← Back to orders
        </Link>
      </div>

      <InvoiceSheet initial={invoice} orderId={id} />
    </div>
  );
}
