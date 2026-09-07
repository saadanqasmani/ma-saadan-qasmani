"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="font-serif italic text-gold-bright">
        You have entered the correspondence.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full border-b border-ink-text/30 bg-transparent py-2 text-sm text-ink-text placeholder:text-ink-text-muted focus:border-gold-bright focus:outline-none",
            compact ? "" : "text-base"
          )}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap border border-gold/50 px-4 py-2 text-xs font-sans uppercase tracking-[0.18em] text-gold-bright transition-colors hover:border-gold-bright hover:bg-gold/10 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Subscribe"}
      </button>
      {error && <p className="text-xs text-burgundy-bright sm:basis-full">{error}</p>}
    </form>
  );
}
