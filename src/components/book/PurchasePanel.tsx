"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { highestBranch } from "@/content/site";
import { DirectOrderForm } from "@/components/forms/DirectOrderForm";

const TABS = [
  { id: "amazon" as const, label: "EU & Americas", note: "via Amazon" },
  { id: "direct" as const, label: "Türkiye & Pakistan", note: "direct order" },
];

export function PurchasePanel() {
  const [tab, setTab] = useState<"amazon" | "direct">("amazon");

  return (
    <div className="grid gap-12 lg:grid-cols-[0.4fr_1fr]">
      <div className="flex flex-col gap-3">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              className={`group relative overflow-hidden border p-6 text-left transition-colors ${
                active ? "border-ink bg-ink text-canvas-light" : "border-line hover:border-ink"
              }`}
            >
              <span className="block text-lg font-medium">{t.label}</span>
              <span
                className={`mt-1 block text-xs uppercase tracking-[0.14em] ${
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
            {tab === "amazon" ? (
              <div className="max-w-xl">
                <p className="font-serif text-xl leading-relaxed text-ink-soft">
                  Available for readers in {highestBranch.purchase.amazon.regions} through
                  Amazon.
                </p>
                {highestBranch.purchase.amazon.url ? (
                  <a
                    href={highestBranch.purchase.amazon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mt-8 inline-flex overflow-hidden border border-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.18em]"
                  >
                    <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                    <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                      Buy on Amazon
                    </span>
                  </a>
                ) : (
                  <p className="mt-8 border border-dashed border-line px-6 py-5 text-sm text-ink-faint">
                    The Amazon link will appear here once the book is listed.
                  </p>
                )}
              </div>
            ) : (
              <div className="max-w-xl">
                <p className="font-serif text-xl leading-relaxed text-ink-soft">
                  {highestBranch.purchase.direct.note}
                </p>
                <div className="mt-10">
                  <DirectOrderForm />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
