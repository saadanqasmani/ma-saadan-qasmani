import { TarakiNav } from "@/components/taraki/TarakiNav";
import { CareerAssessment } from "@/components/taraki/Career";
import { totalCareers } from "@/content/taraki/careers";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", maxWidth: "50rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>Career first</p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          Do not choose a university first. Choose the work first.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1.25rem", maxWidth: "54ch", animationDelay: "0.08s" }}>
          Almost everyone does this backwards: pick a university, pick a course that gets you in, find out four years
          later what the job is actually like. Four questions, about fifteen minutes, and {totalCareers} careers read
          against your answers. Nothing you enter leaves this device.
        </p>
        <div className="tk-rise" style={{ marginTop: "2.5rem", animationDelay: "0.1s" }}>
          <CareerAssessment />
        </div>
      </main>
    </>
  );
}
