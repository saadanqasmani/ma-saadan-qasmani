import { cookies } from "next/headers";
import { Counsellors } from "@/components/edviko/campus/Lists";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Career counsellors · Edviko" };

export default async function Page() {
  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);
  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <Counsellors thresholds={thresholds} />
    </Portal>
  );
}
