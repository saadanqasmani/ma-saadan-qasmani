"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ResearchItem } from "@/content/site";
import { RequestAccessForm } from "@/components/forms/RequestAccessForm";

export function ResearchRow({ item }: { item: ResearchItem }) {
  const [open, setOpen] = useState(false);

  return (
    <article id={item.slug} className="scroll-mt-28 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
            {item.type} · {item.date}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink-text">{item.title}</h2>
          {item.coAuthors && item.coAuthors.length > 0 && (
            <p className="mt-1 text-sm text-ink-text-muted">
              with {item.coAuthors.join(", ")}
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-ink-text-muted">{item.abstract}</p>
          {item.keywords.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.keywords.map((k) => (
                <li
                  key={k}
                  className="border border-ink-text/15 px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-ink-text-muted"
                >
                  {k}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0">
          {item.access === "open" && item.doiOrLink ? (
            <a
              href={item.doiOrLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gold/50 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-gold-bright transition-colors hover:border-gold-bright hover:bg-gold/10"
            >
              View Paper
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-block border border-ink-text/30 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-ink-text-muted transition-colors hover:border-ink-text hover:text-ink-text"
            >
              Request Access
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-deep/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Request access to ${item.title}`}
        >
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-ink-text/15 bg-ink p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-6 top-6 text-ink-text-muted hover:text-ink-text"
            >
              <X size={20} />
            </button>
            <h3 className="pr-8 font-serif text-xl text-ink-text">Request Access</h3>
            <div className="mt-6">
              <RequestAccessForm
                researchSlug={item.slug}
                researchTitle={item.title}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
