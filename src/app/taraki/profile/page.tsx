import { TarakiNav } from "@/components/taraki/TarakiNav";
import { ProfileEditor } from "@/components/taraki/ProfileEditor";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", maxWidth: "46rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>Profile</p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1rem", maxWidth: "16ch", animationDelay: "0.05s" }}>
          The more we know, the better the answer.
        </h1>
        <div className="tk-rise" style={{ marginTop: "2.5rem", animationDelay: "0.1s" }}>
          <ProfileEditor />
        </div>
      </main>
    </>
  );
}
