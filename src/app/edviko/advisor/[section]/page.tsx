import { notFound } from "next/navigation";
import { Portal } from "@/components/edviko/portal/Portal";
import { PortalSoon } from "@/components/edviko/portal/PortalSoon";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";
import { ADVISOR_SECTIONS, findSection } from "@/content/edviko/sections";

export function generateStaticParams() {
  return ADVISOR_SECTIONS.map((s) => ({ section: s.slug }));
}

export default async function AdvisorSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const found = findSection(ADVISOR_SECTIONS, section);
  if (!found) notFound();

  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <PortalSoon title={found.title} what={found.what} waiting={found.waiting} />
    </Portal>
  );
}
