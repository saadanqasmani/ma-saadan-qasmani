"use client";

import { useState } from "react";

const REASONS = ["My grades", "A university", "Money", "Working together", "Something else"];

const field: React.CSSProperties = {
  width: "100%",
  marginTop: "0.5rem",
  padding: "0.8rem 0.95rem",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "11px",
  color: "var(--text)",
  fontFamily: "inherit",
  fontSize: "1rem",
  outline: "none",
};

/**
 * The form works and goes nowhere yet, and says so rather than pretending.
 *
 * A contact form that silently swallows a message is worse than no form:
 * somebody waits for an answer that was never going to come.
 */
export function ContactForm() {
  const [reason, setReason] = useState(REASONS[0]);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="tk-pane tk-land" style={{ padding: "1.75rem" }}>
        <p className="tk-h2" style={{ fontSize: "1.125rem" }}>Not sent, and here is the honest reason.</p>
        <p className="tk-body" style={{ marginTop: "0.75rem" }}>
          Message delivery is not connected yet, so nothing left your browser. This form is
          here so the page is finished; the inbox behind it is the next thing to wire up.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="tk-btn tk-btn--ghost"
          style={{ marginTop: "1.5rem" }}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="tk-pane"
      style={{ padding: "1.75rem" }}
    >
      <label className="tk-label" style={{ color: "var(--text-faint)" }}>
        What is it about
      </label>
      <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            className="tk-chip"
            data-on={reason === r}
            onClick={() => setReason(r)}
            style={{ minWidth: "auto", padding: "0.45rem 0.8rem" }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <label className="tk-label" style={{ color: "var(--text-faint)" }} htmlFor="c-name">
          Your name
        </label>
        <input id="c-name" name="name" required style={field} />
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <label className="tk-label" style={{ color: "var(--text-faint)" }} htmlFor="c-email">
          Email
        </label>
        <input id="c-email" name="email" type="email" required style={field} />
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <label className="tk-label" style={{ color: "var(--text-faint)" }} htmlFor="c-msg">
          Message
        </label>
        <textarea id="c-msg" name="message" required rows={5} style={{ ...field, resize: "vertical" }} />
      </div>

      <button type="submit" className="tk-btn tk-btn--primary" style={{ marginTop: "1.75rem", width: "100%", justifyContent: "center" }}>
        Send
      </button>

      <p className="tk-small" style={{ marginTop: "1rem" }}>
        Delivery is not connected yet. Nothing you type here is stored or sent.
      </p>
    </form>
  );
}
