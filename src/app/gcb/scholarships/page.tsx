import { Soon } from "@/components/gcb/Soon";

export default function Page() {
  return (
    <Soon
      label="Scholarships"
      title="What you can actually apply for."
      what={[
        "A searchable list filtered by your nationality, your grades and where you want to go.",
        "Deadlines, and what each one is really worth.",
        "Five dollars, because keeping a scholarship list current is ongoing work and a free one goes stale within a year.",
      ]}
      blocked="A payment provider, and a decision about who is billed and from where. No payment details are collected anywhere on this site today."
    />
  );
}
