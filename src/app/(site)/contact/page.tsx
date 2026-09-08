import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
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
                  Scheduled booking will appear here once a calendar provider is connected. Until
                  then, use the form and a time will be arranged by email.
                </p>
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
