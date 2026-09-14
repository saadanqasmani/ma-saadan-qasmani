"use client";

import { useState } from "react";

const MONTHLY = 5;
const YEARLY_DISCOUNT = 0.1;
const yearly = Math.round(MONTHLY * 12 * (1 - YEARLY_DISCOUNT));

const plans = [
  {
    id: "free",
    name: "Free",
    tag: "Everything that matters",
    price: () => "$0",
    per: "always",
    tone: "var(--free)",
    features: [
      "Grade equivalence for every Pakistani system",
      "University matching across twelve countries",
      "Real costs, with the source on every figure",
      "The full application checklist and every deadline",
      "Your wish list and progress, saved as you go",
    ],
    cta: "Start now",
    featured: false,
  },
  {
    id: "plus",
    name: "Plus",
    tag: "For the ones going after money",
    price: (annual: boolean) => (annual ? `$${yearly}` : `$${MONTHLY}`),
    per: "",
    tone: "var(--accent)",
    features: [
      "Scholarship database, filtered to what you can actually win",
      "Deadline alerts so you do not lose one to a calendar",
      "Career guidance: which degree leads where, and what it pays",
      "Personal statement review against what admissions officers say they read for",
      "Everything in Free",
    ],
    cta: "Go Plus",
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    tag: "We do it with you",
    price: () => "Let's talk",
    per: "quoted per student",
    tone: "var(--paid)",
    features: [
      "An expert on call, around the clock, through the whole cycle",
      "Visa application support, start to decision",
      "Accommodation found before you land",
      "Airport pickup when you arrive",
      "Everything in Plus",
    ],
    cta: "Get a quote",
    featured: false,
  },
];

export function Plans() {
  const [annual, setAnnual] = useState(true);
  const [asked, setAsked] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {plans.map((p) => (
          <article
            key={p.id}
            className="tk-card"
            style={{
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              borderColor: p.featured ? "var(--accent)" : "var(--line)",
              boxShadow: p.featured ? "0 0 0 1px var(--accent), 0 30px 60px -40px rgba(91,140,255,0.8)" : undefined,
              transform: p.featured ? "translateY(-6px)" : undefined,
            }}
          >
            <span className="tk-label" style={{ color: p.tone }}>{p.name}</span>
            <p className="tk-small" style={{ marginTop: "0.5rem" }}>{p.tag}</p>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "var(--tk-font-display), system-ui, sans-serif",
                  fontSize: "clamp(2rem, 5vw, 2.75rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                }}
              >
                {p.price(annual)}
              </span>
              <span className="tk-small">
                {p.id === "plus" ? (annual ? "a year" : "a month") : p.per}
              </span>
            </div>

            {/* Only on the plan it applies to, and only once someone is
                looking at it. A currency switch floating above three cards
                is a control looking for a home. */}
            {p.id === "plus" && (
              <div style={{ marginTop: "0.9rem" }}>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    type="button"
                    className="tk-chip"
                    data-on={!annual}
                    onClick={() => setAnnual(false)}
                    style={{ flex: 1, padding: "0.45rem 0.5rem" }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className="tk-chip"
                    data-on={annual}
                    onClick={() => setAnnual(true)}
                    style={{ flex: 1, padding: "0.45rem 0.5rem" }}
                  >
                    Yearly
                  </button>
                </div>
                <p className="tk-small" style={{ marginTop: "0.5rem", color: annual ? "var(--free)" : "var(--text-faint)" }}>
                  {annual
                    ? `Two months free. $${yearly} instead of $${MONTHLY * 12}.`
                    : `Go yearly and keep $${MONTHLY * 12 - yearly}.`}
                </p>
              </div>
            )}

            <ul style={{ marginTop: "1.75rem", display: "grid", gap: "0.7rem", paddingLeft: 0, listStyle: "none", flex: 1 }}>
              {p.features.map((f) => (
                <li key={f} className="tk-body" style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                  <span aria-hidden style={{ color: p.tone, flexShrink: 0, lineHeight: 1.55 }}>—</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setAsked(p.id)}
              className={`tk-btn ${p.featured ? "tk-btn--primary" : "tk-btn--ghost"}`}
              style={{ marginTop: "2rem", width: "100%", justifyContent: "center" }}
            >
              {p.cta}
            </button>

            {asked === p.id && (
              <div className="tk-land" style={{ marginTop: "1rem", padding: "0.9rem 1rem", border: "1px solid var(--line)", borderRadius: "11px" }}>
                <p className="tk-small" style={{ color: "var(--text-soft)" }}>
                  {p.id === "free"
                    ? "Free needs no signing up yet. Everything marked free already works: start with the equivalence calculator."
                    : p.id === "pro"
                      ? "Pro is quoted per student. Use the contact page and tell us where you are applying; quoting is not automated yet."
                      : "Checkout is not connected yet. Card payments are still being set up, so nothing can be charged today. Use the contact page and we will tell you the moment it opens."}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>

      <p className="tk-small" style={{ marginTop: "2rem", maxWidth: "60ch" }}>
        Nothing is charged yet. There is no payment provider connected and no card details are
        collected anywhere on this site.
      </p>
    </div>
  );
}
