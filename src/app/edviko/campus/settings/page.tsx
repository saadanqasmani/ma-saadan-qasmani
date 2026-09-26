import { cookies } from "next/headers";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";
import { Settings } from "@/components/edviko/campus/Settings";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const metadata = { title: "Settings · Edviko" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const stored = (await cookies()).get(THRESHOLD_COOKIE)?.value;
  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <Settings current={parseThresholds(stored)} />
    </Portal>
  );
}
