"use client";

import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Word-by-word mask reveal. Each word rises out of a clipped line.
 *
 * The mask needs to be taller than the line box. At display sizes with tight
 * leading, an italic serif's descenders and ascenders overflow the line, and
 * the clip that makes the reveal work was slicing them off. The padding gives
 * the mask room and the negative margin gives the space back, so the line
 * spacing is unchanged; the hidden state starts further down to stay hidden
 * behind the taller box.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("inline-block", className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="inline-block overflow-hidden align-bottom pb-[0.24em] pt-[0.1em] [margin-bottom:-0.24em] [margin-top:-0.1em]"
            aria-hidden
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "165%" }}
              animate={inView ? { y: "0%" } : { y: "165%" }}
              transition={{
                duration: 0.9,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
