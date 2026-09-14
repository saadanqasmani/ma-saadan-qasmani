import { TarakiNav } from "@/components/taraki/TarakiNav";
import { Dashboard } from "@/components/taraki/Dashboard";
import { ProfileEditor } from "@/components/taraki/ProfileEditor";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", maxWidth: "48rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>Your record</p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1rem", maxWidth: "16ch", animationDelay: "0.05s" }}>
          Where you are, and the next thing to do about it.
        </h1>

        <div className="tk-rise" style={{ marginTop: "2.5rem", animationDelay: "0.1s" }}>
          <Dashboard />
        </div>

        <div className="tk-rise" style={{ marginTop: "3.5rem", animationDelay: "0.12s" }}>
          <p className="tk-label" style={{ color: "var(--text-faint)" }}>Edit your details</p>
          <div style={{ marginTop: "1rem" }}>
            <ProfileEditor />
          </div>
        </div>
      </main>
    </>
  );
}
