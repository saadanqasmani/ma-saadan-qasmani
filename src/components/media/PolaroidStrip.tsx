"use client";

import Image from "next/image";
import type { MediaSet } from "@/content/media";

/**
 * The photographs, shown rather than announced.
 *
 * A line of small caps saying "View gallery" is a link people do not read;
 * a little stack of prints is a thing people recognise and reach for. So the
 * first few frames of a set are laid out as Polaroids, tilted and
 * overlapping the way prints do on a desk, and the whole stack is the
 * control that opens the set.
 *
 * The count sits under the prints rather than beside them: on a narrow phone
 * a label to the side of four prints runs off the edge, and the one line
 * that says how many there are is the last thing that should go missing.
 *
 * Thumbnails are served at thumbnail size. Loading four full photographs to
 * draw them an inch wide would cost more than the gallery they open.
 */

/** Enough to read as a stack, few enough to stay small on a phone. */
const SHOWN = 4;

/** Fixed rather than random: a set must not reshuffle between renders. */
const TILT = [-5, 3.5, -2.5, 5.5];

export function PolaroidStrip({ set, count }: { set: MediaSet; count: string }) {
  const available = set.items.filter((item) => item.src);
  if (available.length === 0) return null;

  const frames = available.slice(0, SHOWN);
  const rest = available.length - frames.length;

  return (
    <span className="polaroid-strip block">
      <span className="flex items-end">
        {frames.map((item, i) => (
          <span
            key={item.src}
            className="polaroid relative block shrink-0 border border-line bg-white p-[3px] pb-[10px] shadow-[0_10px_22px_-14px_rgba(21,20,15,0.75)]"
            style={{
              ["--tilt" as string]: `${TILT[i]}deg`,
              zIndex: SHOWN - i,
              marginInlineStart: i ? "-12px" : 0,
            }}
          >
            <Image
              src={item.src as string}
              alt=""
              width={132}
              height={108}
              className="block h-[46px] w-[56px] object-cover sm:h-[54px] sm:w-[66px]"
            />
          </span>
        ))}

        {rest > 0 && (
          <span
            className="polaroid relative flex h-[59px] w-[44px] shrink-0 items-center justify-center border border-line bg-canvas-light text-[11px] tabular-nums text-ink-soft shadow-[0_10px_22px_-14px_rgba(21,20,15,0.75)] sm:h-[67px] sm:w-[50px]"
            style={{ ["--tilt" as string]: "-4deg", marginInlineStart: "-12px" }}
            aria-hidden
          >
            +{rest}
          </span>
        )}
      </span>

      <span className="mt-2.5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors group-hover/gallery:text-ember">
        <span className="inline-block h-px w-5 bg-current transition-all duration-300 group-hover/gallery:w-9" />
        {count}
      </span>
    </span>
  );
}
