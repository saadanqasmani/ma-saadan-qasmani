"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { MARK_TOTAL, type Mark } from "@/content/marginalia";
import type { Dictionary } from "@/content/i18n/en";
import {
  collectMark,
  getServerSnapshot,
  getSnapshot,
  resetMarks,
  subscribe,
} from "@/lib/marginaliaStore";

type CollectionValue = {
  /** The marks in the language the page is in. */
  marks: Mark[];
  copy: Dictionary["marginalia"];
  newsletter: Dictionary["newsletter"];
  found: string[];
  collect: (id: string) => void;
  has: (id: string) => boolean;
  reset: () => void;
  total: number;
  complete: boolean;
  /** id of the mark collected most recently, for the toast */
  lastFound: string | null;
  clearLastFound: () => void;
  panelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
};

const CollectionContext = createContext<CollectionValue | null>(null);

export function CollectionProvider({
  marks,
  copy,
  newsletter,
  children,
}: {
  marks: Mark[];
  copy: Dictionary["marginalia"];
  newsletter: Dictionary["newsletter"];
  children: React.ReactNode;
}) {
  const found = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const collect = useCallback((id: string) => {
    collectMark(id);
    setLastFound(id);
  }, []);

  const reset = useCallback(() => {
    resetMarks();
    setLastFound(null);
  }, []);

  const clearLastFound = useCallback(() => setLastFound(null), []);

  const value = useMemo<CollectionValue>(
    () => ({
      marks,
      copy,
      newsletter,
      found,
      collect,
      has: (id: string) => found.includes(id),
      reset,
      total: MARK_TOTAL,
      complete: found.length >= MARK_TOTAL,
      lastFound,
      clearLastFound,
      panelOpen,
      setPanelOpen,
    }),
    [marks, copy, newsletter, found, collect, reset, lastFound, clearLastFound, panelOpen]
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used inside CollectionProvider");
  return ctx;
}
