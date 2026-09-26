import { AdvisorHome } from "@/components/edviko/advisor/AdvisorHome";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Advisor desk · Edviko" };

export default function AdvisorPage() {
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <AdvisorHome />
    </Portal>
  );
}
