"use client";

import { useEffect, useSyncExternalStore } from "react";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/gcb/browserStore";

const STORE = "gcb-theme";

/**
 * Dark or light, for the whole product.
 *
 * The choice is written onto the .gcb element, which carries the whole
 * palette, so one attribute swaps every colour on the page at once rather
 * than each component deciding for itself.
 *
 * Dark is the default. A student who has told their phone they prefer light
 * gets light on a first visit; after that their choice here wins.
 */
export function ThemeToggle() {
  const saved = useSyncExternalStore(subscribe(STORE), snapshot(STORE), serverSnapshot);
  const theme: "dark" | "light" = saved === "light" ? "light" : "dark";

  // The attribute carries the whole palette, so one write swaps every colour
  // on the page at once.
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={() => write(STORE, next)}
      aria-label={`Switch to ${next} mode`}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        border: "1px solid var(--line)",
        color: "var(--text-soft)",
        transition: "color 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
      }}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}

function Sun() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 100 17 8.5 8.5 0 0010.5-6.5z" />
    </svg>
  );
}
