import { notFound } from "next/navigation";
import { Portal } from "@/components/edviko/portal/Portal";
import { PortalSoon } from "@/components/edviko/portal/PortalSoon";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";
import { CAMPUS_SECTIONS, findSection } from "@/content/edviko/sections";

export function generateStaticParams() {
  return CAMPUS_SECTIONS.map((s) => ({ section: s.slug }));
}

export default async function CampusSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const found = findSection(CAMPUS_SECTIONS, section);
  if (!found) notFound();

  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <PortalSoon title={found.title} what={found.what} waiting={found.waiting} />
    </Portal>
  );
}
