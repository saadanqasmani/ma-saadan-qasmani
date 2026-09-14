import { GcbNav } from "@/components/gcb/GcbNav";
import { ContactForm } from "@/components/gcb/ContactForm";

export default function Page() {
  return (
    <>
      <GcbNav />
      <main className="gcb-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="gcb-label gcb-rise" style={{ color: "var(--accent)" }}>Contact</p>
        <h1 className="gcb-h1 gcb-rise" style={{ marginTop: "1.25rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          Ask us anything.
        </h1>
        <p className="gcb-lead gcb-rise" style={{ marginTop: "1.25rem", maxWidth: "56ch", animationDelay: "0.1s" }}>
          A question about your grades, a country we have not covered yet, a school that wants
          to use this with a whole year group. All of it reaches the same place.
        </p>

        <div className="gcb-rise" style={{ marginTop: "3rem", maxWidth: "38rem", animationDelay: "0.15s" }}>
          <ContactForm />
        </div>
      </main>
    </>
  );
}
