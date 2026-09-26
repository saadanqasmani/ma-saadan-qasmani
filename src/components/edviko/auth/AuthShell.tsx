"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { EdvikoMark } from "@/components/edviko/Logo";

/**
 * The frame around signing up and signing in.
 *
 * No product navigation on these two pages. Somebody here is doing one
 * thing, and a header full of tabs they cannot use yet is an invitation to
 * wander off before they finish it. One way back, and the mark, so they can
 * see where they are.
 */
export function AuthShell({
  eyebrow,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  // Somebody creating an account is not playing the student's game yet, and
  // a points counter in the corner of a sign-up form is noise.
  useEffect(() => {
    document.body.dataset.portal = "true";
    return () => {
      delete document.body.dataset.portal;
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "start center", padding: "clamp(1.5rem, 5vw, 4rem) 1.25rem 5rem" }}>
      <div style={{ width: "100%", maxWidth: "34rem" }}>
        <Link href="/edviko" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
          <EdvikoMark size={26} />
          <span className="ev-font-display" style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Edviko</span>
        </Link>

        <p className="ev-label" style={{ color: "var(--accent)", marginTop: "2rem" }}>{eyebrow}</p>
        <h1 className="ev-h1" style={{ marginTop: "0.7rem", fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>{title}</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.8rem" }}>{lede}</p>

        <div style={{ marginTop: "2rem" }}>{children}</div>

        {footer && (
          <div style={{ marginTop: "2rem", paddingTop: "1.4rem", borderTop: "1px solid var(--line)" }}>{footer}</div>
        )}

        <p className="ev-small" style={{ marginTop: "2rem", color: "var(--text-faint)" }}>
          Early build. Your account is held in this browser and nothing is sent anywhere, so it will
          not be there on another device. Your password is never stored: it is put through PBKDF2
          with a random salt, which is what a server will do with it, so nothing has to be reset when
          there is one.
        </p>
      </div>
    </main>
  );
}

/** One labelled input, with its error under it rather than in a tooltip. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: "0.35rem" }}>
      <label className="ev-label" htmlFor={id} style={{ color: "var(--text-soft)" }}>{label}</label>
      {children}
      {error ? (
        <p className="ev-small" style={{ color: "var(--red)" }}>{error}</p>
      ) : hint ? (
        <p className="ev-small" style={{ color: "var(--text-faint)" }}>{hint}</p>
      ) : null}
    </div>
  );
}
