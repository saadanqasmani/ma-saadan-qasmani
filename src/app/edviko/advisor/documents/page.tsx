import { Documents } from "@/components/edviko/advisor/Documents";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Documents · Edviko" };

export default function Page() {
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <Documents />
    </Portal>
  );
}
