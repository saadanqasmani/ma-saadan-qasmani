"use client";

import { useRef, useState } from "react";
import { INK, INVOICE_FIXED as F, type Invoice } from "@/lib/book/invoice";
import { sendInvoice } from "@/app/admin/actions";

/**
 * The invoice, exactly as it prints, and editable in place.
 *
 * The page is the A4 artwork at its true size: 794 by 1123 at 96dpi, the
 * same numbers the design was drawn to. Nothing is re-laid-out for the
 * screen, so what is on the screen is what comes out of the printer.
 *
 * Every variable line is a contentEditable span rather than an input. An
 * input would need a width guessed in advance and would not wrap; a span
 * grows with what is typed, wraps like the text around it, and prints as
 * text. On screen each one carries a faint dotted rule so it is obvious
 * what can be changed; the rule is dropped in print.
 */

/**
 * The three faces the invoice was drawn in. The page that renders this
 * loads them and defines these variables; the fallbacks are what a printer
 * would otherwise reach for.
 */
const SERIF = "var(--font-inv-serif), Georgia, 'Times New Roman', serif";
const SANS = "var(--font-inv-sans), Helvetica, Arial, sans-serif";
const SCRIPT = "var(--font-inv-script), 'Segoe Script', cursive";

type Field = keyof Invoice;

function Edit({
  value,
  onChange,
  onType,
  field,
  style,
  block = false,
}: {
  value: string;
  onChange: (field: Field, next: string) => void;
  onType: (field: Field, next: string) => void;
  field: Field;
  style?: React.CSSProperties;
  block?: boolean;
}) {
  return (
    <span
      className="inv-edit"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      style={{
        display: block ? "block" : "inline-block",
        // Wide enough to click when empty; no wider than its own words,
        // so the rule that marks it does not run across the page.
        width: block ? "fit-content" : undefined,
        maxWidth: "100%",
        minWidth: 24,
        ...style,
      }}
      // Every keystroke is remembered, but only off a ref: re-rendering a
      // node the caret is inside puts the caret back at the start of it. So
      // state waits for the blur, and the ref is what is actually sent, so
      // a half-typed correction cannot go out as the old value.
      onInput={(e) => onType(field, e.currentTarget.textContent ?? "")}
      onBlur={(e) => onChange(field, e.currentTarget.textContent ?? "")}
    >
      {value}
    </span>
  );
}

const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

export function InvoiceSheet({ initial, orderId }: { initial: Invoice; orderId: string }) {
  const [inv, setInv] = useState<Invoice>(initial);
  const [sending, setSending] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  const sheet = useRef<HTMLDivElement>(null);

  /** What is in the boxes right now, keystroke by keystroke. */
  const typed = useRef<Partial<Invoice>>({});

  const type = (field: Field, next: string) => {
    typed.current[field] = next;
  };

  const set = (field: Field, next: string) => {
    typed.current[field] = next;
    setInv((was) => (was[field] === next ? was : { ...was, [field]: next }));
  };

  async function send() {
    setSending(true);
    setSaid(null);
    try {
      const res = await sendInvoice(orderId, { ...inv, ...typed.current });
      setSaid(res.message ?? (res.ok ? "Sent." : "It did not go."));
    } catch {
      setSaid("It did not go. Nothing was sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* The controls. Never printed. */}
      <div className="inv-bar mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="t-label bg-ink px-6 py-3 text-canvas-light"
        >
          Download as PDF
        </button>
        <button
          type="button"
          onClick={send}
          disabled={sending}
          className="t-label border border-ink px-6 py-3 text-ink transition-colors hover:bg-ink hover:text-canvas-light disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send email"}
        </button>
        <p className="text-sm text-ink-faint">
          {said ?? "Click any underlined value to change it. Nothing is saved until you send."}
        </p>
      </div>

      <div className="inv-scroll">
        <div
          ref={sheet}
          className="inv-sheet"
          style={{
            width: 794,
            height: 1123,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: INK.paper,
            fontFamily: SANS,
            color: INK.text,
            fontSize: 12,
            lineHeight: 1.45,
          }}
        >
          {/* the ribbon */}
          <div style={{ display: "flex", alignItems: "flex-start", height: 16 }}>
            <div style={{ flex: "0 0 40px", height: 16, background: "#1E2433" }} />
            <div style={{ flex: "3 1 0", height: 12, background: INK.accent }} />
            <div style={{ flex: "1 1 0", height: 16, background: INK.plum }} />
            <div style={{ flex: "2 1 0", height: 9, background: "#8E8FB5" }} />
            <div style={{ flex: "1 1 0", height: 14, background: INK.slate }} />
            <div style={{ flex: "2 1 0", height: 10, background: "#B9B4CC" }} />
          </div>

          <div
            style={{
              padding: "26px 52px 14px 52px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              // Takes whatever is left between the ribbon and the foot, and
              // keeps to it: an invoice with a four-line address is still
              // one page, with the foot where the foot goes.
              flex: "1 1 auto",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {/* masthead */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/invoice/emblem.png" alt="" style={{ width: 76, height: 66, objectFit: "contain" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 25, letterSpacing: "0.08em", lineHeight: 1.1 }}>
                    {F.author}
                  </div>
                  <div style={{ fontSize: 12, color: INK.soft, letterSpacing: "0.04em" }}>
                    Author of{" "}
                    <span style={{ fontStyle: "italic", fontFamily: SERIF, fontSize: 15, color: INK.plum }}>
                      {F.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: INK.soft }}>
                    {F.site} · {F.email}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 48, lineHeight: 0.9, letterSpacing: "0.06em", color: INK.accent }}>
                  Invoice
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: 14, rowGap: 2, fontSize: 12, textAlign: "right" }}>
                  <span style={{ color: INK.faint }}>Invoice no.</span>
                  <Edit field="number" value={inv.number} onChange={set} onType={type} style={{ fontWeight: 600 }} />
                  <span style={{ color: INK.faint }}>Date issued</span>
                  <Edit field="issued" value={inv.issued} onChange={set} onType={type} style={{ fontWeight: 600 }} />
                  <span style={{ color: INK.faint }}>Payment due</span>
                  <Edit field="due" value={inv.due} onChange={set} onType={type} style={{ fontWeight: 600 }} />
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: INK.rule }} />

            {/* who, where, and the order */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ ...label, color: INK.plum }}>Billed to</div>
                <Edit field="customerName" value={inv.customerName} onChange={set} onType={type} block
                  style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, lineHeight: 1.15 }} />
                <div style={{ color: "#45455C" }}>
                  WhatsApp: <Edit field="customerPhone" value={inv.customerPhone} onChange={set} onType={type} />
                </div>
                <Edit field="customerEmail" value={inv.customerEmail} onChange={set} onType={type} block style={{ color: "#45455C" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ ...label, color: INK.plum }}>Ship to</div>
                <Edit field="addressLine1" value={inv.addressLine1} onChange={set} onType={type} block />
                <Edit field="addressLine2" value={inv.addressLine2} onChange={set} onType={type} block />
                <Edit field="addressCity" value={inv.addressCity} onChange={set} onType={type} block />
                <div style={{ color: INK.faint, fontStyle: "italic" }}>
                  Note: <Edit field="deliveryNote" value={inv.deliveryNote} onChange={set} onType={type} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, background: INK.tint, padding: "12px 14px", borderRadius: 6 }}>
                <div style={{ ...label, color: INK.slate }}>Order</div>
                <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 10, rowGap: 2 }}>
                  <span style={{ color: INK.faint }}>Placed</span>
                  <Edit field="placed" value={inv.placed} onChange={set} onType={type} />
                  <span style={{ color: INK.faint }}>Via</span>
                  <span>{F.site}</span>
                  <span style={{ color: INK.faint }}>Status</span>
                  <Edit field="status" value={inv.status} onChange={set} onType={type} style={{ fontWeight: 600, color: INK.plum }} />
                  <span style={{ color: INK.faint }}>Dispatch</span>
                  <Edit field="dispatch" value={inv.dispatch} onChange={set} onType={type} />
                </div>
              </div>
            </div>

            {/* the item and the sum */}
            <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${INK.rule}`, borderRadius: 8, overflow: "hidden", background: "#FFFFFF" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 60px 110px 120px", gap: 12, padding: "10px 18px", background: INK.deep, color: "#FFFFFF", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <span>Item</span>
                <span style={{ textAlign: "center" }}>Qty</span>
                <span style={{ textAlign: "right" }}>Unit price</span>
                <span style={{ textAlign: "right" }}>Amount</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 60px 110px 120px", gap: 12, padding: "16px 18px", alignItems: "center", borderBottom: "1px solid #E6E2EE" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/invoice/cover.jpg" alt="" style={{ width: 62, height: 88, objectFit: "cover", borderRadius: 2, boxShadow: "0 4px 10px rgba(30, 30, 60, 0.22)" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.1 }}>{F.title}</div>
                    <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: INK.plum }}>{F.tagline}</div>
                    <div style={{ color: INK.soft }}>{F.edition}</div>
                    <div style={{ color: INK.soft }}>ISBN {F.isbn}</div>
                  </div>
                </div>
                <Edit field="quantity" value={inv.quantity} onChange={set} onType={type} style={{ textAlign: "center", fontSize: 14, fontWeight: 600, justifySelf: "center" }} />
                <Edit field="unitPrice" value={inv.unitPrice} onChange={set} onType={type} style={{ textAlign: "right", fontSize: 13, justifySelf: "end" }} />
                <Edit field="amount" value={inv.amount} onChange={set} onType={type} style={{ textAlign: "right", fontSize: 14, fontWeight: 600, justifySelf: "end" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 18px 14px 18px" }}>
                <div style={{ width: 290, display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: INK.soft }}>Subtotal</span>
                    <Edit field="subtotal" value={inv.subtotal} onChange={set} onType={type} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: INK.soft }}>
                      Promo code <Edit field="promoCode" value={inv.promoCode} onChange={set} onType={type} />
                    </span>
                    <span style={{ color: INK.green }}>
                      − <Edit field="discount" value={inv.discount} onChange={set} onType={type} />
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: INK.soft }}>
                      <Edit field="deliveryLabel" value={inv.deliveryLabel} onChange={set} onType={type} />
                    </span>
                    <Edit field="delivery" value={inv.delivery} onChange={set} onType={type} />
                  </div>
                  <div style={{ height: 1, background: INK.rule, margin: "3px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12 }}>Total due</span>
                    <Edit field="total" value={inv.total} onChange={set} onType={type}
                      style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK.accent }} />
                  </div>
                </div>
              </div>
            </div>

            {/* how to pay, and the thanks */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, border: `1px solid ${INK.rule}`, borderRadius: 8, padding: "16px 18px", background: "#FFFFFF" }}>
                <div style={{ ...label, color: INK.slate }}>How to pay</div>
                <Step n="1" tone={INK.deep}>
                  <Edit field="payHow" value={inv.payHow} onChange={set} onType={type} />
                  <br />
                  {/* An IBAN is twice the length of an Easypaisa number and
                      must not be allowed to run off the box, so the account
                      is set a size down once it is long. */}
                  <Edit field="payNumber" value={inv.payNumber} onChange={set} onType={type}
                    style={{
                      fontFamily: SERIF,
                      fontSize: inv.payNumber.length > 22 ? 15 : 20,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }} />
                  <br />
                  <span style={{ color: INK.soft }}>
                    Account title: <Edit field="payTitle" value={inv.payTitle} onChange={set} onType={type} />
                  </span>
                </Step>
                <Step n="2" tone={INK.plum}>
                  Write your invoice number <b>{inv.number}</b> in the payment note.
                </Step>
                <Step n="3" tone={INK.slate}>
                  Share your payment receipt by email to{" "}
                  <b><Edit field="payEmail" value={inv.payEmail} onChange={set} onType={type} /></b> or on WhatsApp to our
                  management at <b><Edit field="payWhatsApp" value={inv.payWhatsApp} onChange={set} onType={type} /></b>.
                </Step>
                <div style={{ color: INK.soft, fontSize: 12, borderTop: `1px dashed ${INK.rule}`, paddingTop: 8 }}>
                  Your copy is confirmed once the receipt is received, and it is dispatched to the address above.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, borderRadius: 8, padding: "18px 20px", background: INK.deep, color: "#F3F1F8", position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/invoice/watermark.png" alt="" style={{ position: "absolute", right: -40, bottom: -36, width: 200, height: 174, objectFit: "contain", opacity: 0.12 }} />
                <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, lineHeight: 1.05, color: "#FFFFFF" }}>
                  Thank you for your order
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#E4E1EE" }}>
                  Thank you for choosing to climb <i>{F.title}</i> with me. Every copy ordered means a great
                  deal, and I truly hope this story stays with you long after the last page.
                </div>
                <div style={{ fontFamily: SCRIPT, fontSize: 30, color: "#FFFFFF", lineHeight: 1, marginTop: 4 }}>
                  Saadan
                </div>
              </div>
            </div>
          </div>

          {/* the foot */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, padding: "14px 52px 16px 52px", borderTop: `1px solid ${INK.rule}` }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, color: INK.soft, maxWidth: 470 }}>
                <div style={{ fontWeight: 600, color: INK.text }}>{F.title} · M. A. Saadan Qasmani · ISBN {F.isbn}</div>
                <div>© 2026 M. A. Saadan Qasmani. All rights reserved. No part of this book may be reproduced without the author&rsquo;s written permission.</div>
                <div>Questions about your order? WhatsApp {F.whatsapp} · {F.site}</div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/invoice/barcode.png" alt={`ISBN barcode ${F.isbn}`} style={{ width: 150, height: 82, objectFit: "contain", background: "#FFFFFF", padding: 4, borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", height: 12 }}>
              <div style={{ flex: "2 1 0", background: INK.green }} />
              <div style={{ flex: "1 1 0", background: INK.plum }} />
              <div style={{ flex: "3 1 0", background: INK.accent }} />
              <div style={{ flex: "1 1 0", background: INK.slate }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Step({ n, tone, children }: { n: string; tone: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ flex: "0 0 22px", height: 22, borderRadius: "50%", background: tone, color: "#FFFFFF", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {n}
      </div>
      <div>{children}</div>
    </div>
  );
}
