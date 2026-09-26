import { EdvikoNav } from "@/components/edviko/EdvikoNav";
import { Plan } from "@/components/edviko/Plan";

export default function Page() {
  return (
    <>
      <EdvikoNav />
      <main className="ev-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem" }}>
        <p className="ev-label ev-rise" style={{ color: "var(--accent)" }}>Wish list</p>
        <h1 className="ev-h1 ev-rise" style={{ marginTop: "1rem", maxWidth: "16ch", animationDelay: "0.05s" }}>
          The ones you are going for.
        </h1>
        <p className="ev-lead ev-rise" style={{ marginTop: "1rem", maxWidth: "46ch", animationDelay: "0.1s" }}>
          Sorted into dream, likely and safe. Open one to see what it needs from you.
        </p>

        <div className="ev-rise" style={{ marginTop: "2.5rem", animationDelay: "0.15s" }}>
          <Plan />
        </div>
      </main>
    </>
  );
}
