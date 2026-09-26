import { notFound } from "next/navigation";
import { CaseFile } from "@/components/edviko/advisor/CaseFile";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";
import { STUDENTS } from "@/content/edviko/demo";

export function generateStaticParams() {
  return STUDENTS.map((s) => ({ id: s.id }));
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = STUDENTS.find((s) => s.id === decodeURIComponent(id));
  if (!student) notFound();

  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <CaseFile student={student} />
    </Portal>
  );
}
