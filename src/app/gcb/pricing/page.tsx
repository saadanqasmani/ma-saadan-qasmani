import { GcbNav } from "@/components/gcb/GcbNav";
import { Plans } from "@/components/gcb/Plans";

export default function Page() {
  return (
    <>
      <GcbNav />
      <main className="gcb-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="gcb-label gcb-rise" style={{ color: "var(--accent)" }}>
          Pricing
        </p>
        <h1 className="gcb-h1 gcb-rise" style={{ marginTop: "1.25rem", maxWidth: "20ch", animationDelay: "0.05s" }}>
          The part that decides where you go is free. Forever.
        </h1>
        <p className="gcb-lead gcb-rise" style={{ marginTop: "1.25rem", maxWidth: "60ch", animationDelay: "0.1s" }}>
          Finding universities, converting your grades, seeing real costs and knowing what to
          send costs nothing, because an agency charging for that is charging for arithmetic.
          You pay when a person gets involved.
        </p>

        <div className="gcb-rise" style={{ marginTop: "3.5rem", animationDelay: "0.15s" }}>
          <Plans />
        </div>
      </main>
    </>
  );
}
