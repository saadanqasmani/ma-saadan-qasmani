import { Soon } from "@/components/gcb/Soon";

export default function Page() {
  return (
    <Soon
      label="Costs"
      title="What a year abroad really costs, in your own currency."
      what={[
        "Tuition, housing, food and the living costs a visa requires you to prove, per country.",
        "Converted into PKR so the number means something at home.",
        "Government proof-of-funds figures marked as such: those are requirements, not estimates, and they are what decides a visa.",
        "Every figure carries where it came from and when it was read.",
      ]}
      blocked="Seven of twelve countries have a sourced figure so far. The rest stay blank until they have one."
    />
  );
}
