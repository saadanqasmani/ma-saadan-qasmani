import { cookies } from "next/headers";
import { Tasks } from "@/components/edviko/advisor/Tasks";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tasks · Edviko" };

export default async function Page() {
  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <Tasks thresholds={thresholds} />
    </Portal>
  );
}
