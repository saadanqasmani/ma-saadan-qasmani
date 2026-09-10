"use client";

import { useState } from "react";
import { FloatingGallery } from "@/components/media/FloatingGallery";
import type { MediaSet } from "@/content/media";
import type { Dictionary } from "@/content/i18n/en";
import { fill } from "@/lib/i18n/dictionary";

/**
 * Opens a media set from wherever it is referenced. Renders its children as
 * plain content when the set does not exist, so a missing key is a quiet
 * no-op rather than a control that opens nothing.
 */
export function GalleryTrigger({
  set,
  label,
  copy,
  children,
}: {
  /** Resolved on the server, so its captions are in the reader's language. */
  set: MediaSet | null;
  label: string;
  copy: Dictionary["gallery"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!set) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={fill(copy.openPhotographs, { name: label })}
        className="group block w-full text-start"
      >
        {children}
        <span className="mt-1.5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint transition-colors group-hover:text-ember">
          <span className="inline-block h-px w-5 bg-current transition-all duration-300 group-hover:w-9" />
          {copy.photographs}
        </span>
      </button>
      <FloatingGallery set={set} open={open} onClose={() => setOpen(false)} copy={copy} />
    </>
  );
}
