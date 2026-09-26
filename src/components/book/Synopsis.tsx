"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The novel's description, opening on the proverb it turns on.
 *
 * The proverb is set apart and in the ember the rest of the page uses for
 * emphasis, and it is a button rather than a line of text: a reader who has
 * met it needs nothing, and a reader who has not gets it explained without
 * the explanation crowding the page. That is the whole reason it is a
 * press and not a footnote.
 */
export function Synopsis({
  proverb,
  paragraphs,
  provenance,
  closeLabel,
}: {
  proverb: { line: string; meaning: string; english: string; englishLabel: string };
  paragraphs: readonly string[];
  provenance: string;
  closeLabel: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <div className="mt-10 max-w-2xl">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        /* Dotted, because that is what a word you can ask about has looked
           like for a hundred years of print, and a designed focus ring
           rather than none at all, because somebody is arriving here on a
           keyboard. */
        className="block text-start font-serif text-2xl italic leading-snug text-ember underline decoration-ember/40 decoration-dotted decoration-2 underline-offset-[7px] transition-colors hover:decoration-ember focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:text-3xl"
      >
        &ldquo;{proverb.line}&rdquo;
      </button>

      <div className="mt-8 space-y-6">
        {paragraphs.map((line, i) => (
          <p key={i} className="font-serif text-xl leading-relaxed text-ink sm:text-[1.35rem]">
            {line}
          </p>
        ))}
      </div>

      <p className="mt-8 font-serif text-lg font-bold leading-relaxed text-ink sm:text-xl">
        {provenance}
      </p>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // The backdrop is the dialog itself; anything inside it is not.
          if (event.target === dialog.current) setOpen(false);
        }}
        aria-label={proverb.line}
        className="egg-dialog w-[min(32rem,calc(100vw-2rem))] border border-ink/15 bg-canvas-light p-0 backdrop:bg-ink/50"
      >
        <div className="p-7 sm:p-9">
          <p className="font-serif text-xl italic leading-snug text-ember sm:text-2xl">
            &ldquo;{proverb.line}&rdquo;
          </p>
          <p className="mt-5 font-serif text-lg leading-relaxed text-ink">{proverb.meaning}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            <span className="t-label text-ink-faint">{proverb.englishLabel}</span>
            <br />
            {proverb.english}
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="t-label mt-7 text-ink-faint transition-colors hover:text-ink"
          >
            {closeLabel}
          </button>
        </div>
      </dialog>
    </div>
  );
}
