import { cookies } from "next/headers";
import { CampusHome } from "@/components/edviko/campus/CampusHome";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Campus · Edviko" };

export default async function CampusPage() {
  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);
  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <CampusHome thresholds={thresholds} />
    </Portal>
  );
}
