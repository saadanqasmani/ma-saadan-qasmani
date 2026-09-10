import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { booking, social } from "@/content/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { fill, getDictionary } from "@/lib/i18n/dictionary";
import { getContent } from "@/lib/i18n/content";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";
import { getPerson } from "@/lib/data";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.contact.eyebrow,
    description: dict.contact.metaDescription,
    alternates: localeAlternates("/contact", locale),
  };
}

export default async function ContactPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const [dict, content, person] = await Promise.all([
    getDictionary(locale),
    getContent(locale),
    getPerson(),
  ]);
  const t = dict.contact;
  const said = content.person(person);

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.titleLead}
        accent={t.titleAccent}
        accentTone="azure"
        lede={t.lede}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[0.32fr_1fr]">
          <div className="space-y-10">
            <Reveal>
              <div>
                <p className="eyebrow">{t.basedIn}</p>
                <p className="mt-3 font-serif text-xl">{said.location}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="eyebrow">{t.appointments}</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                  {fill(t.bookingNote, { provider: booking.provider })}
                </p>
                <a
                  href={booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-5 inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
                >
                  <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                    {t.bookATime}
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div>
                <p className="eyebrow">{t.elsewhere}</p>
                <ul className="mt-3 space-y-1">
                  {social.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 font-serif text-lg text-ink transition-colors hover:text-ember"
                      >
                        <span className="inline-block h-px w-5 bg-current transition-all duration-300 group-hover:w-9" />
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="max-w-2xl">
              <ContactForm copy={dict.forms} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
