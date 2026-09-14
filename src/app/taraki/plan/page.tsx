import { TarakiNav } from "@/components/taraki/TarakiNav";
import { Plan } from "@/components/taraki/Plan";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>Wish list</p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1rem", maxWidth: "16ch", animationDelay: "0.05s" }}>
          The ones you are going for.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1rem", maxWidth: "46ch", animationDelay: "0.1s" }}>
          Sorted into dream, likely and safe. Open one to see what it needs from you.
        </p>

        <div className="tk-rise" style={{ marginTop: "2.5rem", animationDelay: "0.15s" }}>
          <Plan />
        </div>
      </main>
    </>
  );
}
