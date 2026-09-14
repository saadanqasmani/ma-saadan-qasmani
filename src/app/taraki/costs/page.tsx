import { TarakiNav } from "@/components/taraki/TarakiNav";
import { CostCalculator } from "@/components/taraki/Costs";
import { sourcedCount, countries } from "@/content/taraki/countries";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", maxWidth: "48rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>What it costs</p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          Tuition is the number you are quoted. It is rarely half the bill.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1.25rem", maxWidth: "54ch", animationDelay: "0.08s" }}>
          Eleven lines, all the years, your scholarship, and the gap between the total and what your family can
          actually put in. We hold sourced figures for {sourcedCount} of {countries.length} countries and fill those
          in for you; the rest are yours to enter, and stay empty until you do.
        </p>
        <div className="tk-rise" style={{ marginTop: "2.5rem", animationDelay: "0.1s" }}>
          <CostCalculator />
        </div>
      </main>
    </>
  );
}
