"use client";

import { useRef, useState, type ReactNode } from "react";
import { usePoints, Star } from "@/components/taraki/Points";

/**
 * A sheet you can pick up, tip toward you, and open.
 *
 * Three things happen on one object. The sheet tilts a few degrees toward
 * the cursor, so it reads as something with a front and a back rather than a
 * rectangle. A light follows the cursor across it. And the whole thing opens
 * on a click, into the space it already occupies rather than into a modal
 * that covers the page.
 *
 * The tilt is deliberately small. Past about six degrees the text inside
 * starts to skew enough to be harder to read, and this is a site people come
 * to for an answer.
 *
 * On a touch screen there is no cursor, so there is no tilt and no light;
 * the tap opens it, which is all a phone needs.
 */
export function Pane({
  id,
  title,
  summary,
  points = 10,
  children,
  tone = "var(--accent)",
}: {
  id: string;
  title: string;
  summary: string;
  points?: number;
  children: ReactNode;
  tone?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [lit, setLit] = useState(false);
  const { award, earned } = usePoints();
  const alreadyEarned = earned.has(id);

  function track(e: React.MouseEvent) {
    const node = ref.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    node.style.setProperty("--mx", `${px * 100}%`);
    node.style.setProperty("--my", `${py * 100}%`);
    // Tip away from the cursor, which is how a real sheet would move.
    const rx = (0.5 - py) * 7;
    const ry = (px - 0.5) * 7;
    node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  }

  function rest() {
    setLit(false);
    const node = ref.current;
    if (node) node.style.transform = "";
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) award(id, points, ref.current?.getBoundingClientRect());
  }

  return (
    <div
      ref={ref}
      className="tk-pane"
      data-lit={lit}
      data-open={open}
      onMouseEnter={() => setLit(true)}
      onMouseMove={track}
      onMouseLeave={rest}
      style={{ padding: "1.6rem" }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="tk-pane__lift"
        style={{
          all: "unset",
          cursor: "pointer",
          display: "block",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 className="tk-h2" style={{ fontSize: "1.125rem" }}>{title}</h3>
            <p className="tk-body" style={{ marginTop: "0.5rem" }}>{summary}</p>
          </div>
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              color: tone,
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
              transform: open ? "rotate(45deg)" : "none",
              fontSize: "1.4rem",
              lineHeight: 1,
            }}
          >
            +
          </span>
        </div>
      </button>

      <div className="tk-reveal tk-pane__lift" data-open={open} style={{ marginTop: open ? "1.25rem" : 0 }}>
        <div>
          {children}
          {!alreadyEarned && (
            <p className="tk-small" style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--free)" }}>
              <Star size={12} /> +{points}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
