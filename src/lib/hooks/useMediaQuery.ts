"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query currently matches.
 *
 * The browser already holds this answer and already publishes changes to it,
 * so it is read as an external store rather than copied into state: no
 * effect, no render with a stale value, and no chance of the two drifting.
 *
 * The server has no viewport and answers false. Anything using this must
 * therefore be correct — not merely tolerable — while the answer is still
 * false, which in practice means letting CSS own the layout and using this
 * only for what CSS cannot decide.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True on a screen wide enough for the desktop layout (Tailwind's `lg`). */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * True where the pointer cannot hover — a phone or a tablet.
 *
 * Anything revealed only on hover is unreachable here, so this is what tells
 * a component to show it outright instead.
 */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none)");
}
