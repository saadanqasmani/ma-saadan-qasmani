"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AmazonNotify } from "@/components/book/AmazonNotify";
import { PreOrderCard } from "@/components/book/PreOrderCard";
import { ShipToMe } from "@/components/book/ShipToMe";
import { releaseDateIn } from "@/lib/book/release";
import { priceOf, type Region } from "@/lib/book/regions";
import { fill } from "@/lib/i18n/dictionary";
import type { Dictionary } from "@/content/i18n/en";

/**
 * Where the book can be had: one card, three doors.
 *
 * Türkiye opens, because that is where the site is written from and where
 * the first copies are. Pakistan and everywhere else are one click away.
 * Three prices in three currencies, three ways of paying and three sets of
 * postage have nothing in common, and showing them at once only invites
 * reading the wrong one, so only ever one is on screen.
 */

type Door = Region;

export function PurchasePanel({
  copy,
  forms,
  locale,
  canPayOnline,
  amazonUrl,
  ebookUrl,
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
  /** The Kindle edition, which is up and taking pre-orders already. */
  ebookUrl?: string | null;
}) {
  const [door, setDoor] = useState<Door>("tr");

  const doors: { id: Door; label: string; note: string }[] = [
    { id: "tr", label: copy.trTab, note: copy.trNote },
    { id: "pk", label: copy.pkTab, note: copy.pkNote },
    { id: "world", label: copy.worldTab, note: copy.worldNote },
  ];

  return (
    <div className="pop-card">
      {/* The three doors, along the top of the card rather than above it,
          so it reads as one thing with a setting rather than two things. */}
      <div role="tablist" aria-label={copy.whereYouAre} className="flex border-b border-line">
        {doors.map((d) => {
          const active = door === d.id;
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setDoor(d.id)}
              className={`relative flex-1 px-2 py-3.5 text-center transition-colors sm:px-4 sm:py-4 ${
                active ? "text-ink" : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <span className="block text-sm font-medium leading-tight sm:text-base">{d.label}</span>
              <span className="t-label mt-1 block text-[0.6rem] sm:text-[0.65rem]">{d.note}</span>
              {/* The rule under the live door, drawn rather than coloured in,
                  so switching moves a mark instead of repainting a block. */}
              {active && (
                <motion.span
                  layoutId="door-mark"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-ember"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={door}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {door === "world" ? (
            <Elsewhere
              copy={copy}
              forms={forms}
              locale={locale}
              amazonUrl={amazonUrl}
              ebookUrl={ebookUrl}
            />
          ) : (
            <PreOrderCard
              copy={copy}
              forms={forms}
              region={door}
              canPayOnline={canPayOnline}
              locale={locale}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Everywhere Amazon reaches, and then the places it does not.
 *
 * The paperback first, because that is the book: it was set for a six by
 * nine page and the ending lands differently when you can see how little
 * is left in your right hand. The Kindle edition is offered under it and
 * plainly, for a reader who would rather not wait until October, and the
 * last door is for the reader Amazon will not deliver to at all.
 */
function Elsewhere({
  copy,
  forms,
  locale,
  amazonUrl,
  ebookUrl,
}: {
  copy: Dictionary["novel"]["purchase"];
  forms: Dictionary["forms"];
  locale: string;
  amazonUrl?: string | null;
  ebookUrl?: string | null;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="eyebrow text-ember">{copy.paperbackLabel}</p>
          <p className="t-label mt-2.5 text-ink-faint">{copy.amazonPrice}</p>
        </div>
        <p className="tnum font-display text-3xl leading-none sm:text-4xl">{priceOf("world")}</p>
      </div>

      {amazonUrl ? (
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="t-label group relative mt-6 inline-flex overflow-hidden bg-ink px-7 py-3.5 text-canvas-light"
        >
          <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          <span className="relative">{copy.buyOnAmazon}</span>
        </a>
      ) : (
        <>
          <p className="mt-6 border-s-2 border-ember ps-4 text-base leading-relaxed text-ink-soft">
            {fill(copy.amazonSoon, { date: releaseDateIn(locale) })}
          </p>
          <AmazonNotify copy={copy} forms={forms} locale={locale} />
        </>
      )}

      {/* The ebook, which is already up. Second, and said plainly: it is
          the same book and a worse way to read it. */}
      {ebookUrl && (
        <div className="mt-8 border-t border-line pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="t-label font-medium text-ink">{copy.ebookLabel}</p>
            <p className="t-label text-verdant">{copy.ebookLive}</p>
          </div>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{copy.waitForPaper}</p>
          <a
            href={ebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label mt-5 inline-flex border border-ink px-6 py-3 text-ink transition-colors hover:bg-ink hover:text-canvas-light"
          >
            {copy.ebookButton}
          </a>
        </div>
      )}

      {/* The reader Amazon does not reach. Set off by a rule, because it is
          a different question from the one above it. */}
      <div className="mt-8 border-t border-line pt-6">
        <ShipToMe copy={copy} forms={forms} locale={locale} />
      </div>
    </div>
  );
}
