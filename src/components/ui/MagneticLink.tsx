"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { cn } from "@/lib/utils";

/** A link that leans toward the cursor. Subtle — 10px of travel, no rubber band. */
export function MagneticLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 18);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 12);
  }

  const inner = (
    <motion.span
      className={cn(
        "t-label group relative inline-flex items-center gap-2 overflow-hidden border border-ink px-7 py-3.5 text-ink transition-colors",
        className
      )}
      style={reduced ? undefined : { x: sx, y: sy }}
    >
      <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
        {children}
      </span>
    </motion.span>
  );

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <LocaleLink href={href}>{inner}</LocaleLink>
      )}
    </span>
  );
}
