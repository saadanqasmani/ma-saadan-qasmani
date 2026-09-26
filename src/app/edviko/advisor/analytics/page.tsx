import { cookies } from "next/headers";
import { Kpis } from "@/components/edviko/portal/Kpis";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";
import { SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { kpisFor } from "@/lib/edviko/kpi";
import { studentsOfAdvisor } from "@/lib/edviko/org";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics · Edviko" };

export default async function Page() {
  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <header>
          <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Your caseload, measured</h1>
          <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
            The same measures the campus sees, over your {mine.length} students only. They are here so
            you see them before anybody else does, which is the difference between a measure and a
            surprise.
          </p>
        </header>
        <Kpis groups={kpisFor(mine, thresholds)} />
      </div>
    </Portal>
  );
}
