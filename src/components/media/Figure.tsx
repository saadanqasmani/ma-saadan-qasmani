"use client";

import { useState } from "react";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Drop-in image slot.
 *
 * With `src` null it renders a designed placeholder that states exactly what
 * belongs there and at what size — so an unfilled slot still looks composed,
 * and Saadan can see what to supply. Pass a real `src` later and the same
 * component renders the photograph with a mask reveal.
 */
export function Figure({
  src,
  alt,
  label,
  spec,
  ratio = "3 / 4",
  className,
  priority = false,
  tone = "verdant",
  bare = false,
}: {
  src?: string | null;
  alt?: string;
  label: string;
  spec: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  tone?: "verdant" | "azure" | "ember";
  /**
   * For an image that carries its own silhouette on transparency. Drops the
   * plate behind it and fits rather than crops, so nothing is painted behind
   * the cut-out and no edge of the drawing is lost.
   */
  bare?: boolean;
}) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const toneVar = `var(--${tone})`;

  return (
    <motion.figure
      className={cn("relative overflow-hidden", !bare && "bg-canvas-deep", className)}
      style={{ aspectRatio: ratio }}
      initial={reduced ? undefined : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduced ? undefined : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          priority={priority}
          className={bare ? "object-contain" : "object-cover"}
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setFailed(true)}
          // A cut-out is already small and must not be re-encoded: the
          // optimizer is the one step between the repo and the page that
          // cannot be checked from here, so it is taken out of the path.
          unoptimized={bare}
        />
      ) : (
        <>
          {/* Engraved hatch — a placeholder that still belongs to the design */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <pattern
                id={`hatch-${label.replace(/\W/g, "")}`}
                width="9"
                height="9"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="9" stroke={toneVar} strokeWidth="0.7" opacity="0.28" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#hatch-${label.replace(/\W/g, "")})`}
            />
          </svg>

          {/* Corner brackets */}
          <span className="absolute left-4 top-4 h-5 w-5 border-l border-t" style={{ borderColor: toneVar }} />
          <span className="absolute right-4 top-4 h-5 w-5 border-r border-t" style={{ borderColor: toneVar }} />
          <span className="absolute bottom-4 left-4 h-5 w-5 border-b border-l" style={{ borderColor: toneVar }} />
          <span className="absolute bottom-4 right-4 h-5 w-5 border-b border-r" style={{ borderColor: toneVar }} />

          <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="bg-canvas px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-soft">
              {label}
            </span>
            <span className="bg-canvas px-3 py-1 text-[11px] text-ink-faint">{spec}</span>
          </figcaption>
        </>
      )}
    </motion.figure>
  );
}
