import { TarakiNav } from "@/components/taraki/TarakiNav";
import { Plans } from "@/components/taraki/Plans";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>
          Pricing
        </p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1.25rem", maxWidth: "20ch", animationDelay: "0.05s" }}>
          The part that decides where you go is free. Forever.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1.25rem", maxWidth: "60ch", animationDelay: "0.1s" }}>
          Finding universities, converting your grades, seeing real costs and knowing what to
          send costs nothing, because an agency charging for that is charging for arithmetic.
          You pay when a person gets involved.
        </p>

        <div className="tk-rise" style={{ marginTop: "3.5rem", animationDelay: "0.15s" }}>
          <Plans />
        </div>
      </main>
    </>
  );
}
