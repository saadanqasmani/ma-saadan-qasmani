"use client";

import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { textDirection } from "@/lib/i18n/config";
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
 *
 * Reduced motion is handled twice, on purpose. The hook below is the clean
 * path, but it reported false in a browser whose matchMedia said otherwise,
 * while the library still declined to animate the transform, which left every
 * word parked below its mask and the heading invisible. A heading that does
 * not render is a worse failure than one that does not animate, so
 * .split-word is also pinned to translateY(0) in the stylesheet, where no
 * hydration timing can reach it.
 *
 * Direction is declared rather than inherited. Each word is its own
 * inline-block, and an inline-block is an atomic neutral to the bidi
 * algorithm: with every strong character sealed inside one, nothing is left
 * at this level for the browser to infer a direction from. Reading it from
 * the text itself is what keeps Arabic running right to left and an English
 * title inside an Arabic page running left to right.
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
  const dir = textDirection(text);

  if (reduced) {
    return (
      <Tag className={className} dir={dir}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("inline-block", className)}
      dir={dir}
      aria-label={text}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="inline-block overflow-hidden align-bottom pb-[0.24em] pt-[0.1em] [margin-bottom:-0.24em] [margin-top:-0.1em]"
            aria-hidden
          >
            <motion.span
              className="split-word inline-block will-change-transform"
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
