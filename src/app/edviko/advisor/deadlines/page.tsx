import { Deadlines } from "@/components/edviko/advisor/Deadlines";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "US deadlines · Edviko" };

export default function DeadlinesPage() {
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <Deadlines />
    </Portal>
  );
}
