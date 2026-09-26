"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { endSession, useSession } from "@/components/edviko/auth/session";
import { AuthShell } from "@/components/edviko/auth/AuthShell";
import { homeFor, ROLE_LABEL } from "@/lib/edviko/auth";
import { advisorCode, campusCode, parseId, relationshipLabel } from "@/lib/edviko/id";

/**
 * The account itself: who you are to this system, and how to leave.
 *
 * The code is broken into its parts rather than printed as one string,
 * because it is the one thing on this page a person will be asked to read
 * out, and because seeing which part is the school and which part is theirs
 * for life is what makes the migration story believable.
 */
export function AccountPage() {
  const router = useRouter();
  const { account } = useSession();

  if (!account) {
    return (
      <AuthShell
        eyebrow="Account"
        title="Nobody is signed in"
        lede="On this device, at least."
        footer={
          <p className="ev-small">
            <Link href="/edviko/signin" style={{ color: "var(--accent)" }}>Sign in</Link>
            {" or "}
            <Link href="/edviko/join" style={{ color: "var(--accent)" }}>join Edviko</Link>.
          </p>
        }
      >
        <div />
      </AuthShell>
    );
  }

  const id = parseId(account.code);

  return (
    <AuthShell
      eyebrow={ROLE_LABEL[account.role]}
      title={account.name}
      lede={account.email}
      footer={
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href={homeFor(account.role)} className="ev-btn ev-btn--primary">Back to Edviko</Link>
          <button
            type="button"
            className="ev-btn ev-btn--ghost"
            onClick={() => {
              endSession();
              router.push("/edviko/signin");
            }}
          >
            Sign out
          </button>
        </div>
      }
    >
      <div className="ev-card" style={{ padding: "1.25rem" }}>
        <span className="ev-label" style={{ color: "var(--text-faint)" }}>Your Edviko code</span>
        <p className="ev-h2" style={{ marginTop: "0.5rem", fontVariantNumeric: "tabular-nums", fontSize: "1.25rem" }}>
          {account.code}
        </p>
        {id && (
          <dl style={{ display: "grid", gap: "0.4rem", marginTop: "1rem" }}>
            {rowsFor(account.role, id).map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "12rem 1fr", gap: "0.6rem" }}>
                <dt className="ev-small" style={{ color: "var(--text-faint)" }}>{k}</dt>
                <dd className="ev-small" style={{ fontVariantNumeric: "tabular-nums" }}>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "1rem" }}>
          {account.role === "student"
            ? "Everything except your number can change when you move school, campus or advisor. Your number cannot, which is the point of having one."
            : account.role === "family"
              ? "The number in the middle is your child's, and it does not change when they move school. Yours is the same code with your relationship on the end."
              : "The parts before the number are the campus and you. The number itself is unused on a staff code, which is why it reads as zeroes."}
        </p>
      </div>

      {account.guardianEmail && (
        <div className="ev-card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
          <span className="ev-label" style={{ color: "var(--text-faint)" }}>Consent on record</span>
          <p className="ev-small" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
            Given by {account.guardianEmail}
            {account.consentAt ? ` on ${account.consentAt.slice(0, 10)}` : ""}. Kept because it is
            exactly what has to be shown on the day somebody asks.
          </p>
        </div>
      )}

      {account.student && (
        <div className="ev-card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
          <span className="ev-label" style={{ color: "var(--text-faint)" }}>Attached to</span>
          <p className="ev-small" style={{ marginTop: "0.5rem", fontVariantNumeric: "tabular-nums" }}>{account.student}</p>
          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.4rem" }}>
            Their record. You see their position, their costs and what is being asked of you, and not
            their assessment answers, their advisor&rsquo;s notes or their essay.
          </p>
        </div>
      )}
    </AuthShell>
  );
}

/**
 * What each part of the code means to the person holding it.
 *
 * The same six segments read differently depending on who you are: the
 * middle number is a student's for life, a parent's child's, and nothing at
 * all on a staff code, where it is zeroes. Printing "your number, for life:
 * 000000" to an advisor is the kind of small wrongness that makes somebody
 * distrust the rest of the page.
 */
function rowsFor(role: string, id: ReturnType<typeof parseId> & object): [string, string][] {
  if (role === "student") {
    return [
      ["Country", id.country],
      ["School", id.school],
      ["Campus", campusCode(id)],
      ["Your advisor", advisorCode(id)],
      ["Your number, for life", id.serial],
      ["This code belongs to", relationshipLabel(id.relationship)],
    ];
  }
  if (role === "family") {
    return [
      ["Country", id.country],
      ["Their school", id.school],
      ["Their campus", campusCode(id)],
      ["Their advisor", advisorCode(id)],
      ["Their number, for life", id.serial],
      ["You are their", relationshipLabel(id.relationship)],
    ];
  }
  return [
    ["Country", id.country],
    ["School", id.school],
    ["Campus", campusCode(id)],
    [role === "advisor" ? "You, as an advisor" : "You, on this campus", advisorCode(id)],
  ];
}
