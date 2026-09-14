import { Soon } from "@/components/gcb/Soon";

export default function Page() {
  return (
    <Soon
      label="How to apply"
      title="Every document, every deadline, every fee."
      what={[
        "What each country and university actually asks for, as a checklist you can work through.",
        "Application fees, and which universities charge none.",
        "What a personal statement is for, and what admissions officers say they are reading it for.",
        "The honest version of how to improve your chances, for a student still two years out.",
      ]}
      blocked="Per-country requirement sets, sourced from each university's own admissions page."
    />
  );
}
