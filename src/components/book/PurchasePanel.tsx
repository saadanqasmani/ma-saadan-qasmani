"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AmazonNotify } from "@/components/book/AmazonNotify";
import { PreOrderCard } from "@/components/book/PreOrderCard";
import { ShipToMe } from "@/components/book/ShipToMe";
import { priceOf, type Region } from "@/lib/book/regions";
import type { Dictionary } from "@/content/i18n/en";

/**
 * Where the book can be had, in the order a reader needs it.
 *
 * Amazon first and undivided, because that is most of the world and it is
 * one link. Then the two countries where it is sold directly, on tabs,
 * because their prices, their postage and their ways of paying have nothing
 * in common and showing both at once would only invite reading the wrong
 * one. A reader outside all three has a door of their own under Amazon.
 */
export function PurchasePanel({
  copy,
  forms,
  locale,
  canPayOnline,
  amazonUrl,
}: {
  copy: Dictionary["novel"]["purchase"];
  forms: Dictionary["forms"];
  locale: string;
  /** Whether a card can be taken here yet. Decided on the server. */
  canPayOnline: boolean;
  /**
   * The listing, once it exists. It arrives from the content layer rather
   * than being read from the file here, so that pasting it into the
   * dashboard is enough to turn the waiting note into a button.
   */
  amazonUrl?: string | null;
}) {
  const [region, setRegion] = useState<Region>("pk");

  const tabs: { id: Region; label: string; note: string }[] = [
    { id: "pk", label: copy.pkTab, note: copy.pkNote },
    { id: "tr", label: copy.trTab, note: copy.trNote },
  ];

  return (
    <div className="space-y-12">
      {/* Amazon: the rest of the world, one link, no tabs */}
      <div className="pop-card p-7 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="eyebrow text-ember">{copy.buyEyebrow}</p>
            <p className="mt-3 t-label text-ink-faint">{copy.amazonPrice}</p>
          </div>
          <p className="tnum font-display text-4xl leading-none">{priceOf("world")}</p>
        </div>

        {amazonUrl ? (
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label group relative mt-7 inline-flex overflow-hidden bg-ink px-8 py-4 text-canvas-light"
          >
            <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative">{copy.buyOnAmazon}</span>
          </a>
        ) : (
          <>
            <p className="mt-6 border-s-2 border-line ps-4 text-base leading-relaxed text-ink-soft">
              {copy.amazonSoon}
            </p>
            <AmazonNotify copy={copy} forms={forms} locale={locale} />
          </>
        )}

        <ShipToMe copy={copy} forms={forms} locale={locale} />
      </div>

      {/* the two countries it is sold in directly */}
      <div>
        <div className="flex flex-wrap gap-3">
          {tabs.map((t) => {
            const active = region === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setRegion(t.id)}
                aria-pressed={active}
                className={`group flex-1 basis-40 border p-5 text-start transition-colors ${
                  active ? "border-ink bg-ink text-canvas-light" : "border-line bg-canvas-light hover:border-ink"
                }`}
              >
                <span className="block text-lg font-medium">{t.label}</span>
                <span className={`t-label mt-1 block ${active ? "text-canvas-light/60" : "text-ink-faint"}`}>
                  {t.note}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={region}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <PreOrderCard copy={copy} forms={forms} region={region} canPayOnline={canPayOnline} locale={locale} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
