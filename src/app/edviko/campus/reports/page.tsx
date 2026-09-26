import { cookies } from "next/headers";
import { Kpis } from "@/components/edviko/portal/Kpis";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";
import { CAMPUS, STUDENTS } from "@/content/edviko/demo";
import { kpisFor } from "@/lib/edviko/kpi";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports and analytics · Edviko" };

export default async function Page() {
  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);
  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <header>
          <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Reports and analytics</h1>
          <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
            {CAMPUS.name}, {STUDENTS.length} students. Every number is computed from the cases as this
            page is read, so it cannot drift from what the individual records say — which is how a
            management report and the people it describes come to disagree.
          </p>
        </header>
        <Kpis groups={kpisFor(STUDENTS, thresholds)} />
      </div>
    </Portal>
  );
}
