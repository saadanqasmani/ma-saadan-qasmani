import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { booking, social } from "@/content/site";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Correspondence",
  description: "Get in touch, request professional contact, or arrange an appointment.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Correspondence"
        title="Get in Touch"
        lede="For professional inquiries, speaking requests, research collaboration, or general correspondence."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[0.32fr_1fr]">
          <div className="space-y-10">
            <Reveal>
              <div>
                <p className="eyebrow">Based in</p>
                <p className="mt-3 font-serif text-xl">Istanbul, Türkiye</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="eyebrow">Appointments</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                  Booking runs on {booking.provider}. Pick a time that suits you and it lands
                  directly in the calendar.
                </p>
                <a
                  href={booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-5 inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
                >
                  <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                    Book a time
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div>
                <p className="eyebrow">Elsewhere</p>
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
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
