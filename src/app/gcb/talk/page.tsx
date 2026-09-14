import { Soon } from "@/components/gcb/Soon";

export default function Page() {
  return (
    <Soon
      label="Talk to someone"
      title="A counsellor, or a student already living there."
      what={[
        "A call with a counsellor, priced far under what an agency charges for the same hour.",
        "Or a call with a student currently studying in the country you are aiming at, which is the thing no agency sells.",
        "Booking, scheduling and payment. Free to browse; you pay only for the call.",
      ]}
      blocked="People. This needs counsellors under contract and students recruited in each destination before it can be offered."
    />
  );
}
