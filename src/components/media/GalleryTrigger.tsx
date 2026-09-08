"use client";

import { useState } from "react";
import { FloatingGallery } from "@/components/media/FloatingGallery";
import { getMediaSet } from "@/content/media";

/**
 * Opens a media set from wherever it is referenced. Renders its children as
 * plain content when the set does not exist, so a missing key is a quiet
 * no-op rather than a control that opens nothing.
 */
export function GalleryTrigger({
  mediaKey,
  label,
  children,
}: {
  mediaKey?: string;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const set = mediaKey ? getMediaSet(mediaKey) : null;

  if (!set) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open photographs of ${label}`}
        className="group block w-full text-left"
      >
        {children}
        <span className="mt-1.5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint transition-colors group-hover:text-ember">
          <span className="inline-block h-px w-5 bg-current transition-all duration-300 group-hover:w-9" />
          Photographs
        </span>
      </button>
      <FloatingGallery set={set} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
