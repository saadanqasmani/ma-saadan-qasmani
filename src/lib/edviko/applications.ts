/**
 * Applications, tracked as the things that block them.
 *
 * An application is not a status. It is a set of requirements, each of which
 * is either met or not, and a date by which all of them must be. So a row
 * here does not say "in progress" — it says which two things are missing and
 * how long is left, because "in progress" is what a system says when it has
 * stopped being useful.
 *
 * The lifecycle is deliberately short. Half the application trackers in
 * education invent a dozen intermediate states that nobody updates, and an
 * unreliable status is worse than none: an advisor who has been burned by
 * one goes back to asking the student.
 */

export type ApplicationState =
  | "planned"
  | "preparing"
  | "submitted"
  | "offer"
  | "conditional"
  | "rejected"
  | "withdrawn"
  | "accepted";

export const STATE_LABEL: Record<ApplicationState, string> = {
  planned: "Planned",
  preparing: "Preparing",
  submitted: "Submitted",
  offer: "Offer",
  conditional: "Conditional offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  accepted: "Accepted",
};

/** States where the university, not the student, is the one holding it up. */
export const WAITING_ON_THEM: ApplicationState[] = ["submitted"];

/** States that are finished, one way or the other. */
export const CLOSED: ApplicationState[] = ["rejected", "withdrawn", "accepted"];

export type Requirement = {
  id: string;
  label: string;
  done: boolean;
  /** Who has to do it. Most of the misses are on the second and third. */
  owner: "student" | "advisor" | "school" | "family";
};

export type Application = {
  id: string;
  student: string;
  university: string;
  country: string;
  /** Which round, where the institution offers rounds. */
  round: string;
  state: ApplicationState;
  /** Days until the deadline. Negative means it has passed. */
  deadlineInDays: number | null;
  requirements: Requirement[];
  /** Fee in US dollars, where one is known. */
  feeUsd: number | null;
  /** Set when an offer carries conditions. */
  condition: string | null;
};

export function outstanding(a: Application): Requirement[] {
  return a.requirements.filter((r) => !r.done);
}

export function isBlocked(a: Application): boolean {
  return !CLOSED.includes(a.state) && !WAITING_ON_THEM.includes(a.state) && outstanding(a).length > 0;
}

/**
 * Whether an application is in trouble, and in one sentence why.
 *
 * Deliberately not a score. An advisor with forty applications open needs to
 * know which three will be missed, and a number between one and a hundred
 * does not tell them that.
 */
export type Verdict = { tone: "red" | "amber" | "green"; says: string };

export function verdictOf(a: Application): Verdict {
  const left = outstanding(a);
  const days = a.deadlineInDays;

  if (CLOSED.includes(a.state)) {
    return { tone: a.state === "accepted" ? "green" : "green", says: STATE_LABEL[a.state] };
  }

  if (days !== null && days < 0 && a.state !== "submitted") {
    return { tone: "red", says: `The deadline passed ${Math.abs(days)} days ago and it was never sent.` };
  }

  if (a.state === "submitted") {
    return { tone: "green", says: "Sent. Waiting on the university now, not on you." };
  }

  if (a.state === "offer" || a.state === "conditional") {
    return {
      tone: "amber",
      says: a.condition
        ? `Offer, conditional on ${a.condition}. A decision is owed.`
        : "Offer in hand. A decision is owed, and deposits expire.",
    };
  }

  if (days !== null && days <= 7 && left.length > 0) {
    return { tone: "red", says: `${left.length} thing${left.length === 1 ? "" : "s"} missing and ${days <= 0 ? "no days" : `${days} days`} left.` };
  }

  if (days !== null && days <= 21 && left.length > 1) {
    return { tone: "amber", says: `${left.length} things missing, ${days} days left.` };
  }

  if (left.length === 0) {
    return { tone: "green", says: "Everything is ready. It only has to be sent." };
  }

  return { tone: "amber", says: `${left.length} thing${left.length === 1 ? "" : "s"} still to do.` };
}

/** Counts for a caseload, in the order an advisor reads them. */
export function summarise(apps: Application[]) {
  const open = apps.filter((a) => !CLOSED.includes(a.state));
  return {
    total: apps.length,
    open: open.length,
    readyToSend: open.filter((a) => outstanding(a).length === 0 && a.state !== "submitted").length,
    blocked: open.filter(isBlocked).length,
    awaiting: apps.filter((a) => a.state === "submitted").length,
    offers: apps.filter((a) => a.state === "offer" || a.state === "conditional").length,
    missed: apps.filter((a) => (a.deadlineInDays ?? 1) < 0 && a.state === "planned").length,
    fees: apps.reduce((n, a) => n + (a.feeUsd ?? 0), 0),
  };
}
