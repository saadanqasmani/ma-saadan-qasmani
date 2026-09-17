"use client";

import { useState } from "react";
import { TextInput, FormNotice } from "@/components/forms/fields";
import type { Dictionary } from "@/content/i18n/en";

/**
 * For the reader who wants it from Amazon, where it is not yet listed.
 *
 * The same list as the newsletter, because keeping a second one would mean
 * two places to forget. They are told what they are joining.
 */
export function AmazonNotify({
  copy,
  forms,
  locale,
}: {
  copy: Dictionary["novel"]["purchase"];
  forms: Dictionary["forms"];
  locale: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data.error as string) ?? forms.somethingWrong);
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError(forms.tryAgain);
      setStatus("error");
    }
  }

  if (status === "done") {
    return <FormNotice tone="success">{copy.notifyDone}</FormNotice>;
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-md">
      <label htmlFor="amazon-notify" className="t-label mb-2 block font-medium text-ink-faint">
        {copy.notifyLabel}
      </label>
      <div className="flex items-end gap-3">
        <TextInput
          id="amazon-notify"
          type="email"
          required
          autoComplete="email"
          placeholder={forms.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="t-label shrink-0 border border-ink px-5 py-2.5 transition-colors hover:bg-ink hover:text-canvas-light disabled:opacity-40"
        >
          {status === "sending" ? forms.sending : copy.notify}
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-faint">{copy.notifyNote}</p>
      {error && <FormNotice tone="error">{error}</FormNotice>}
    </form>
  );
}
