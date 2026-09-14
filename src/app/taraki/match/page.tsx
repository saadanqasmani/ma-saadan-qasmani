import { TarakiNav } from "@/components/taraki/TarakiNav";
import { Match } from "@/components/taraki/Match";
import { totalUniversities } from "@/content/taraki/universities";
import { countries } from "@/content/taraki/countries";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>
          Free · No account needed
        </p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1.25rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          {totalUniversities} universities, {countries.length} countries.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1.25rem", maxWidth: "60ch", animationDelay: "0.1s" }}>
          Browse them, and put the ones you care about on your list. Entry requirements are
          being compiled university by university, each with its own source, and every card
          says plainly whether it has them yet.
        </p>

        <div className="tk-rise" style={{ marginTop: "3rem", animationDelay: "0.15s" }}>
          <Match />
        </div>
      </main>
    </>
  );
}
