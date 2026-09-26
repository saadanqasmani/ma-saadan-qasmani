import { EdvikoNav } from "@/components/edviko/EdvikoNav";
import { Dashboard } from "@/components/edviko/Dashboard";
import { ProfileEditor } from "@/components/edviko/ProfileEditor";

export default function Page() {
  return (
    <>
      <EdvikoNav />
      <main className="ev-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", maxWidth: "48rem" }}>
        <p className="ev-label ev-rise" style={{ color: "var(--accent)" }}>Your record</p>
        <h1 className="ev-h1 ev-rise" style={{ marginTop: "1rem", maxWidth: "16ch", animationDelay: "0.05s" }}>
          Where you are, and the next thing to do about it.
        </h1>

        <div className="ev-rise" style={{ marginTop: "2.5rem", animationDelay: "0.1s" }}>
          <Dashboard />
        </div>

        <div className="ev-rise" style={{ marginTop: "3.5rem", animationDelay: "0.12s" }}>
          <p className="ev-label" style={{ color: "var(--text-faint)" }}>Edit your details</p>
          <div style={{ marginTop: "1rem" }}>
            <ProfileEditor />
          </div>
        </div>
      </main>
    </>
  );
}
