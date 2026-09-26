import { CampusHome } from "@/components/edviko/campus/CampusHome";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Campus · Edviko" };

export default function CampusPage() {
  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <CampusHome />
    </Portal>
  );
}
