import { Applications } from "@/components/edviko/advisor/Applications";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Applications · Edviko" };

export default function Page() {
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <Applications />
    </Portal>
  );
}
