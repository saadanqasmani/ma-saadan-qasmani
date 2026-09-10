"use client";

import { createContext, useContext } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Which language the page being read is in.
 *
 * Server components take the locale from the route and never need this. It
 * exists for the interactive parts — the header, the galleries, the forms —
 * which sit below the route and would otherwise have to be handed the
 * locale through every layer between.
 */
const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
