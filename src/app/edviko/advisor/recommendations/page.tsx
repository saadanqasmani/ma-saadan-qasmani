import { RecommendationQueue } from "@/components/edviko/advisor/RecommendationQueue";
import { Portal } from "@/components/edviko/portal/Portal";
import { ADVISOR_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Recommendations · Edviko" };

export default function Page() {
  return (
    <Portal role="advisor" who={ADVISOR_WHO}>
      <RecommendationQueue />
    </Portal>
  );
}
