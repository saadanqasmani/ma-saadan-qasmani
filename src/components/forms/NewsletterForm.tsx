"use client";

import { useState } from "react";

export function NewsletterForm() {
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
      <p className="font-serif text-xl italic text-verdant">
        You have entered the correspondence.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-end gap-4 border-b border-ink pb-2 transition-colors focus-within:border-ember">
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
          className="w-full bg-transparent py-1 text-base text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:text-ember disabled:opacity-50"
        >
          {status === "loading" ? "Sending" : "Subscribe"}
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-ember">{error}</p>}
    </form>
  );
}
