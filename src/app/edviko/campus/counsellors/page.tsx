import { Counsellors } from "@/components/edviko/campus/Lists";
import { Portal } from "@/components/edviko/portal/Portal";
import { CAMPUS_WHO } from "@/components/edviko/portal/who";

export const metadata = { title: "Career counsellors · Edviko" };

export default function Page() {
  return (
    <Portal role="campus" who={CAMPUS_WHO}>
      <Counsellors />
    </Portal>
  );
}
