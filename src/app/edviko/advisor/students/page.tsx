import { StudentList } from "@/components/edviko/advisor/StudentList";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";
import { SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { studentsOfAdvisor } from "@/lib/edviko/org";

export const metadata = { title: "My students · Edviko" };

export default function StudentsPage() {
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <header>
          <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>My students</h1>
          <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
            {mine.length} cases, sorted by who needs you most rather than by surname.
          </p>
        </header>
        <StudentList students={mine} />
      </div>
    </Portal>
  );
}
