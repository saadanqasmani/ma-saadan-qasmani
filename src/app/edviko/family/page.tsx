import { FamilyHome } from "@/components/edviko/family/FamilyHome";
import { Portal } from "@/components/edviko/portal/Portal";
import { STUDENTS } from "@/content/edviko/demo";
import { familyMember, formatId, parseId } from "@/lib/edviko/id";

export const metadata = { title: "Family · Edviko" };

/** The demo family is attached to the first student on the campus. */
const CHILD = STUDENTS[0];

export default function FamilyPage() {
  const id = parseId(CHILD.id);
  const code = id ? formatId(familyMember(id, 1)) : CHILD.id;

  return (
    <Portal
      role="family"
      who={{ name: `${CHILD.name.split(" ").slice(-1)[0]} family`, line: `Parent of ${CHILD.name}`, code }}
    >
      <FamilyHome studentId={CHILD.id} />
    </Portal>
  );
}
