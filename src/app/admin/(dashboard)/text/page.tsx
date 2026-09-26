import { AdminHeading } from "@/components/admin/ui";
import { TextEditor } from "@/components/admin/TextEditor";
import { catalogue, sections } from "@/lib/content/catalogue";
import { overridesFor } from "@/lib/content/overrides";
import { isLocale, locales, defaultLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  ru: "Русский",
  ar: "العربية",
  ur: "اردو",
};

export default async function TextPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const { locale: raw } = await searchParams;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const entries = catalogue();
  const edits = await overridesFor(locale);

  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeading eyebrow="Content" title="Every word on the site" />
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Change any line here and it changes on the site. Leave a box empty and the site uses what
        it says now, so clearing a box is how you undo. Each language is edited on its own; a line
        you have not touched in Turkish still reads as the Turkish that was written for it.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Pictures are here too, under <strong>media</strong> for the galleries and{" "}
        <strong>brand</strong> for the mark and the Journal&rsquo;s drawing. Choosing a file
        uploads it and swaps it in one motion. A picture is the same picture in every language, so
        that one change shows in all six.
      </p>
      <TextEditor
        entries={entries}
        sections={sections(entries)}
        edits={edits}
        locale={locale}
        locales={locales.map((code) => ({ code, label: LABELS[code] ?? code }))}
      />
    </div>
  );
}
