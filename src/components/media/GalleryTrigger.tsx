"use client";

import { useState } from "react";
import { FloatingGallery } from "@/components/media/FloatingGallery";
import { PolaroidStrip } from "@/components/media/PolaroidStrip";
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

  const available = set.items.filter((item) => item.src).length;
  const count =
    available === 1
      ? copy.photographCountOne
      : fill(copy.photographCount, { count: available });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={fill(copy.openPhotographs, { name: label })}
        className="group/gallery block w-full text-start"
      >
        {children}
        <span className="mt-3 block">
          <PolaroidStrip set={set} count={count} />
        </span>
      </button>
      <FloatingGallery set={set} open={open} onClose={() => setOpen(false)} copy={copy} />
    </>
  );
}
