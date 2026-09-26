import { Assessments } from "@/components/edviko/advisor/Assessments";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Assessments · Edviko" };

export default function Page() {
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <Assessments />
    </Portal>
  );
}
