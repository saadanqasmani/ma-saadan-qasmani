import { Soon } from "@/components/gcb/Soon";

export default function Page() {
  return (
    <Soon
      label="Match"
      title="Where your grades can actually take you."
      what={[
        "You enter your GPA or grade average, the year you finish school, the grade you are in now, and what you do outside class.",
        "You set what your family can spend in a year.",
        "It shows your profile against what each university publishes about the students it admits, with the source and date beside every figure.",
        "It does not give you a percentage chance. Nobody can, and a number like that would decide things it has no right to decide.",
      ]}
      blocked="Admissions data. A published admitted-student range per university, from the university itself, not an aggregator. Twenty universities across twelve countries is 240 of those, and each one has to be found and dated."
    />
  );
}
