import { TarakiNav } from "@/components/taraki/TarakiNav";
import { ContactForm } from "@/components/taraki/ContactForm";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>Contact</p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1.25rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          Ask us anything.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1.25rem", maxWidth: "56ch", animationDelay: "0.1s" }}>
          A question about your grades, a country we have not covered yet, a school that wants
          to use this with a whole year group. All of it reaches the same place.
        </p>

        <div className="tk-rise" style={{ marginTop: "3rem", maxWidth: "38rem", animationDelay: "0.15s" }}>
          <ContactForm />
        </div>
      </main>
    </>
  );
}
