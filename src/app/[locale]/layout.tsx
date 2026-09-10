import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getPerson } from "@/lib/data";
import { getContent } from "@/lib/i18n/content";
import { fontClassNames } from "@/lib/i18n/fonts";
import { isLocale, localeMeta, locales, type Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";
import { siteUrl } from "@/lib/siteUrl";

/**
 * The root of every public page, in every language.
 *
 * This is where the document declares what language it is in and which way
 * it runs, which is the part a browser's own translate feature cannot get
 * right: it reads a page marked English, rewrites it, and leaves the markup
 * claiming English while the words are Arabic. Here the claim is true, so
 * screen readers pick the right voice, the browser stops offering to
 * translate what is already translated, and search engines index five real
 * pages instead of one.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const [content, base] = await Promise.all([getContent(locale), getPerson()]);
  const said = content.person(base);
  const title = `${said.name} — ${said.positioning}`;
  const description = said.bio.slice(0, 155);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${said.name}` },
    description,
    alternates: localeAlternates("/", locale),
    openGraph: {
      title,
      description,
      url: localeMeta[locale].tag === "en" ? siteUrl : `${siteUrl}/${locale}`,
      siteName: said.name,
      locale: localeMeta[locale].tag,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed = locale as Locale;
  const { dir, tag } = localeMeta[typed];

  return (
    <html
      lang={tag}
      dir={dir}
      className={`${fontClassNames(typed)} h-full antialiased`}
      // The browser's own translate bar is what sent people here with bad
      // Arabic in the first place. On a page that is already in their
      // language, it has nothing to offer.
      translate="no"
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">{children}</body>
    </html>
  );
}
