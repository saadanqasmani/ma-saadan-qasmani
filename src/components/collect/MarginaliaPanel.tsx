"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MARKS } from "@/content/marginalia";
import { useCollection } from "@/components/collect/CollectionProvider";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

/** Header indicator + the collection sheet + the found-a-mark toast. */
export function MarginaliaPanel() {
  const { found, total, complete, reset, lastFound, clearLastFound, panelOpen, setPanelOpen } =
    useCollection();
  const open = panelOpen;
  const setOpen = setPanelOpen;

  // Auto-dismiss the toast
  useEffect(() => {
    if (!lastFound) return;
    const t = setTimeout(clearLastFound, 5000);
    return () => clearTimeout(t);
  }, [lastFound, clearLastFound]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const toastMark = MARKS.find((m) => m.id === lastFound);

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toastMark && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-6 z-[80] max-w-xs border border-ink bg-canvas-light p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Marginalia · {found.length} of {total}
            </p>
            <p className="mt-2 font-display text-2xl text-ink">{toastMark.title}</p>
            <p className="mt-1 text-sm leading-snug text-ink-soft">{toastMark.line}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="The Marginalia"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto border border-ink bg-canvas p-8 sm:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow">The Marginalia</p>
                  <h2 className="mt-3 font-display text-4xl">
                    {found.length} of {total} found
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-2xl leading-none text-ink-faint transition-colors hover:text-ink"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
                Seven marks are left in the margins of this site, the way a reader annotates a
                book they intend to keep. Each one gives up something true.
              </p>

              <ul className="mt-8 border-t border-line">
                {MARKS.map((m) => {
                  const isFound = found.includes(m.id);
                  return (
                    <li
                      key={m.id}
                      className="grid gap-1 border-b border-line py-4 sm:grid-cols-[1.5rem_1fr]"
                    >
                      <span className={isFound ? "text-ember" : "text-ink-faint/50"}>
                        {isFound ? "✳" : "·"}
                      </span>
                      {isFound ? (
                        <div>
                          <p className="font-serif text-lg text-ink">{m.title}</p>
                          <p className="mt-0.5 text-sm text-ink-soft">{m.line}</p>
                        </div>
                      ) : (
                        <p className="font-serif text-lg italic text-ink-faint">{m.hint}</p>
                      )}
                    </li>
                  );
                })}
              </ul>

              {complete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-10 border border-ember p-7"
                >
                  <p className="eyebrow text-ember">The Reader&rsquo;s Card</p>
                  <p className="mt-3 font-display text-3xl">
                    You read the margins. Most people don&rsquo;t.
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                    Come into the correspondence — new research, journal entries, and news of{" "}
                    <span className="italic text-ember">The Highest Branch</span>, sent rarely.
                  </p>
                  <div className="mt-6 max-w-md">
                    <NewsletterForm />
                  </div>
                </motion.div>
              )}

              <button
                type="button"
                onClick={reset}
                className="mt-8 text-[11px] uppercase tracking-[0.14em] text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Clear the collection
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
