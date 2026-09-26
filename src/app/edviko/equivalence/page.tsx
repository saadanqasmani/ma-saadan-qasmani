import { EdvikoNav } from "@/components/edviko/EdvikoNav";
import { Equivalence } from "@/components/edviko/Equivalence";

export default function Page() {
  return (
    <>
      <EdvikoNav />
      <main className="ev-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="ev-label ev-rise" style={{ color: "var(--accent)" }}>
          Free · No account needed
        </p>
        <h1 className="ev-h1 ev-rise" style={{ marginTop: "1.25rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          Work out what your grades are worth.
        </h1>
        <p className="ev-lead ev-rise" style={{ marginTop: "1.25rem", maxWidth: "58ch", animationDelay: "0.1s" }}>
          O Level, A Level, Matric, FSc, IB or an American diploma. Tap what you got and see
          the number a university will actually read, with the arithmetic shown.
        </p>

        <div className="ev-rise" style={{ marginTop: "3.5rem", animationDelay: "0.15s" }}>
          <Equivalence />
        </div>
      </main>
    </>
  );
}
