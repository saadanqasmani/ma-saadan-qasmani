"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/gcb/browserStore";

/**
 * Points, and the stars that carry them.
 *
 * Earning something has to be visible or it is not earning. When a student
 * opens a panel, a star leaves that panel and flies to the counter in the
 * header, and the counter registers the hit. The number going up on its own
 * would be a number going up; this is a thing arriving somewhere.
 *
 * Kept in the browser, so a student with no account still keeps their score.
 * Each award has an id, so the same panel cannot be opened twice for points.
 */

type PointsApi = {
  points: number;
  earned: Set<string>;
  award: (id: string, amount: number, from?: DOMRect) => void;
};

const Ctx = createContext<PointsApi | null>(null);

const STORE = "gcb-points";

export function usePoints() {
  const api = useContext(Ctx);
  if (!api) throw new Error("usePoints outside PointsProvider");
  return api;
}

export function PointsProvider({ children }: { children: ReactNode }) {
  const bank = useRef<HTMLSpanElement>(null);

  const raw = useSyncExternalStore(subscribe(STORE), snapshot(STORE), serverSnapshot);

  const saved = useMemo(() => {
    if (!raw) return { points: 0, earned: new Set<string>() };
    try {
      const parsed = JSON.parse(raw) as { points?: number; earned?: string[] };
      return { points: parsed.points ?? 0, earned: new Set(parsed.earned ?? []) };
    } catch {
      return { points: 0, earned: new Set<string>() };
    }
  }, [raw]);

  const award = useCallback(
    (id: string, amount: number, from?: DOMRect) => {
      const current = snapshot(STORE)();
      let points = 0;
      let earned: string[] = [];
      if (current) {
        try {
          const parsed = JSON.parse(current) as { points?: number; earned?: string[] };
          points = parsed.points ?? 0;
          earned = parsed.earned ?? [];
        } catch {
          // A corrupted value is replaced rather than argued with.
        }
      }
      // Each panel pays once.
      if (earned.includes(id)) return;

      write(STORE, JSON.stringify({ points: points + amount, earned: [...earned, id] }));
      flyStar(from, bank.current);
    },
    []
  );

  return (
    <Ctx.Provider value={{ points: saved.points, earned: saved.earned, award }}>
      {children}
      <PointsPortal ref={bank} points={saved.points} />
    </Ctx.Provider>
  );
}

/** The counter. Fixed, small, always in the corner of the eye. */
function PointsPortal({
  ref,
  points,
}: {
  ref: React.RefObject<HTMLSpanElement | null>;
  points: number;
}) {
  const [hit, setHit] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setHit(true);
    const t = window.setTimeout(() => setHit(false), 520);
    return () => window.clearTimeout(t);
  }, [points]);

  return (
    <div
      style={{
        position: "fixed",
        top: "14px",
        right: "16px",
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.35rem 0.7rem",
        borderRadius: "99px",
        background: "var(--glass)",
        border: "1px solid var(--glass-edge)",
        backdropFilter: "blur(14px)",
        pointerEvents: "none",
      }}
    >
      <Star size={13} />
      <span
        ref={ref}
        className={`gcb-label ${hit ? "gcb-bank--hit" : ""}`}
        style={{ display: "inline-block", color: "var(--text)", fontSize: "0.75rem" }}
      >
        {points}
      </span>
    </div>
  );
}

export function Star({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M12 2.6l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.8 6.2 20.2l1.5-6.5-5-4.4 6.6-.6z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * One star, from where it was earned to where it is kept.
 *
 * Built by hand rather than by React, because it is a thing that happens
 * once and then is gone, and giving it a place in the tree would mean
 * keeping state for something with no future.
 */
function flyStar(from: DOMRect | undefined, to: HTMLElement | null) {
  if (typeof window === "undefined" || !from || !to) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = to.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "gcb-star";
  el.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2.6l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.8 6.2 20.2l1.5-6.5-5-4.4 6.6-.6z" fill="currentColor"/></svg>';

  const startX = from.left + from.width / 2;
  const startY = from.top + 24;
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  el.style.setProperty("--dx", `${target.left + target.width / 2 - startX}px`);
  el.style.setProperty("--dy", `${target.top + target.height / 2 - startY}px`);

  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}
