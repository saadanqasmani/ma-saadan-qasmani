import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Correspondence",
  description: "Get in touch, request professional contact, or book an appointment.",
};

export default function ContactPage() {
  return (
    <Container className="py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
            Correspondence
          </p>
          <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-6xl">Get in Touch</h1>
          <p className="mt-6 text-base text-ink-text-muted">
            For professional inquiries, speaking requests, or general correspondence.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 border-t border-ink-text/10 pt-10">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
              Appointments
            </p>
            <p className="mt-3 text-sm text-ink-text-muted">
              Appointment booking will be available here once a scheduling provider (such as
              Calendly) is connected. In the meantime, please reach out using the form above.
            </p>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
