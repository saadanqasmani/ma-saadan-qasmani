import { cookies } from "next/headers";
import { AdvisorHome } from "@/components/edviko/advisor/AdvisorHome";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Advisor desk · Edviko" };

export default async function AdvisorPage() {
  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <AdvisorHome thresholds={thresholds} />
    </Portal>
  );
}
