import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CounsellorCase } from "@/components/edviko/campus/CounsellorCase";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";
import { ADVISORS } from "@/content/edviko/demo";
import { parseThresholds, THRESHOLD_COOKIE } from "@/lib/edviko/thresholds";

export const dynamic = "force-dynamic";
export const metadata = { title: "Counsellor · Edviko" };

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const wanted = decodeURIComponent(code).toUpperCase();
  if (!ADVISORS.some((a) => a.code === wanted)) notFound();

  const thresholds = parseThresholds((await cookies()).get(THRESHOLD_COOKIE)?.value);

  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <CounsellorCase code={wanted} thresholds={thresholds} />
    </Portal>
  );
}
