"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { highestBranch } from "@/content/site";
import { AmazonNotify } from "@/components/book/AmazonNotify";
import { PreOrderCard } from "@/components/book/PreOrderCard";
import type { Dictionary } from "@/content/i18n/en";
import { fill } from "@/lib/i18n/dictionary";

export function PurchasePanel({
  copy,
  forms,
  regions,
  locale,
  canPayOnline,
}: {
  copy: Dictionary["novel"]["purchase"];
  forms: Dictionary["forms"];
  /** Where the book can be had, in this language. */
  regions: { amazon: string; direct: string; directNote: string };
  locale: string;
  /** Whether a card can be taken here yet. Decided on the server. */
  canPayOnline: boolean;
}) {
  // The two countries it can be pre-ordered in open first: that is the one
  // thing a reader can act on today.
  const [tab, setTab] = useState<"direct" | "amazon">("direct");

  const tabs = [
    { id: "direct" as const, label: copy.directTab, note: copy.preOrderNote },
    { id: "amazon" as const, label: copy.amazonTab, note: copy.amazonNote },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[0.4fr_1fr]">
      <div className="flex flex-col gap-3">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              className={`group relative overflow-hidden border p-6 text-start transition-colors ${
                active ? "border-ink bg-ink text-canvas-light" : "border-line hover:border-ink"
              }`}
            >
              <span className="block text-lg font-medium">{t.label}</span>
              <span
                className={`t-label mt-1 block ${
                  active ? "text-canvas-light/60" : "text-ink-faint"
                }`}
              >
                {t.note}
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[18rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "direct" ? (
              <PreOrderCard copy={copy} forms={forms} canPayOnline={canPayOnline} />
            ) : (
              <div className="max-w-xl">
                <p className="font-serif text-xl leading-relaxed text-ink-soft">
                  {fill(copy.amazonBody, { regions: regions.amazon })}
                </p>
                {highestBranch.purchase.amazon.url ? (
                  <a
                    href={highestBranch.purchase.amazon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-label group relative mt-8 inline-flex overflow-hidden border border-ink px-8 py-4"
                  >
                    <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                    <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                      {copy.buyOnAmazon}
                    </span>
                  </a>
                ) : (
                  <>
                    <p className="mt-6 border-s-2 border-line ps-4 text-base leading-relaxed text-ink-soft">
                      {fill(copy.amazonPending, { regions: regions.amazon })}
                    </p>
                    <AmazonNotify copy={copy} forms={forms} locale={locale} />
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
