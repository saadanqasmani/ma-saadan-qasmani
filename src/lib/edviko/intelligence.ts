/**
 * What the assessment actually shows, including where it contradicts itself.
 *
 * Three inputs, kept apart on purpose. What a student says interests them.
 * What they say they are good at. And what twelve questions with right
 * answers say. Collapsing those into one number is how careers software
 * becomes a horoscope, so nothing here averages them.
 *
 * The interesting output is not the score. It is the disagreement. A student
 * who rated themselves two out of five on numbers and got both numerical
 * questions right is not "moderately numerate"; they are somebody whose plan
 * may rest on a wrong belief about themselves, and that is worth twenty
 * minutes of an advisor's time. The opposite case matters more still,
 * because a student who believes they are strong at something they are not
 * will meet that fact in a first-year exam, eight thousand kilometres from
 * home, with the fees already paid.
 *
 * Two questions per dimension cannot measure an aptitude. Everything here
 * says so, in words, wherever a number appears.
 */

import { ITEMS, MEASURED, type Item } from "@/content/edviko/aptitude";
import { APTITUDES, type Aptitude, type Family } from "@/content/edviko/careers";
import { SKILLS, type Skill } from "@/content/edviko/skills";

/** itemId to the index the student chose. */
export type IndicatorAnswers = Record<string, number>;

export const INDICATOR_KEY = "ev-indicator";
export const SKILLS_KEY = "ev-skills";

export function readAnswers(raw: string | null): IndicatorAnswers {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as IndicatorAnswers;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readSkills(raw: string | null): Partial<Record<Skill, number>> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Partial<Record<Skill, number>>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function isRight(item: Item, chosen: number | undefined): boolean {
  return chosen === item.answer;
}

export type Score = { of: Aptitude; label: string; right: number; asked: number; answered: number };

export function scoreIndicator(answers: IndicatorAnswers): Score[] {
  return MEASURED.map((of) => {
    const items = ITEMS.filter((i) => i.of === of);
    const answered = items.filter((i) => typeof answers[i.id] === "number").length;
    const right = items.filter((i) => isRight(i, answers[i.id])).length;
    return {
      of,
      label: APTITUDES.find((a) => a.id === of)?.label ?? of,
      right,
      asked: items.length,
      answered,
    };
  });
}

export function answeredCount(answers: IndicatorAnswers): number {
  return ITEMS.filter((i) => typeof answers[i.id] === "number").length;
}

export type Divergence = {
  of: Aptitude;
  label: string;
  /** What they said about themselves, 1 to 5. Null means they did not say. */
  self: number | null;
  right: number;
  asked: number;
  kind: "underrates" | "overrates" | "agrees" | "unknown";
  sentence: string;
};

/**
 * Where belief and evidence disagree.
 *
 * Only the two clear cases are called a disagreement. Everything in between
 * is called agreement, because with two questions per dimension a one-step
 * difference is noise and dressing noise up as insight is the whole disease
 * this file exists to avoid.
 */
export function divergences(
  answers: IndicatorAnswers,
  selfRated: Partial<Record<Aptitude, number>>
): Divergence[] {
  return scoreIndicator(answers)
    .filter((s) => s.answered === s.asked)
    .map((s) => {
      const self = selfRated[s.of] ?? null;
      const label = s.label.toLowerCase();

      if (self === null) {
        return {
          of: s.of,
          label: s.label,
          self,
          right: s.right,
          asked: s.asked,
          kind: "unknown" as const,
          sentence: `You answered ${s.right} of ${s.asked} on ${label} and have not rated yourself on it, so there is nothing to compare.`,
        };
      }

      if (self <= 2 && s.right === s.asked) {
        return {
          of: s.of,
          label: s.label,
          self,
          right: s.right,
          asked: s.asked,
          kind: "underrates" as const,
          sentence: `You rated yourself ${self} out of 5 on ${label} and got both questions right. Two questions prove nothing on their own, but a belief this far from the evidence is worth testing before it decides your degree.`,
        };
      }

      if (self >= 4 && s.right === 0) {
        return {
          of: s.of,
          label: s.label,
          self,
          right: s.right,
          asked: s.asked,
          kind: "overrates" as const,
          sentence: `You rated yourself ${self} out of 5 on ${label} and got neither question right. Read both explanations. If they were careless mistakes, say so and move on; if they were not, better to find out here than in a first-year exam with the fees paid.`,
        };
      }

      return {
        of: s.of,
        label: s.label,
        self,
        right: s.right,
        asked: s.asked,
        kind: "agrees" as const,
        sentence: `You rated yourself ${self} out of 5 on ${label} and answered ${s.right} of ${s.asked}. Near enough to agree.`,
      };
    });
}

/**
 * The skills each family of careers actually leans on.
 *
 * A rule of thumb per family rather than a claim about a job. It is here so
 * that "what should I build this year" has an answer more specific than
 * "get good grades", and it is deliberately short: four things a student
 * might actually do beats eight they will not.
 */
const FAMILY_SKILLS: Record<Family, Skill[]> = {
  health: ["communication", "research", "languages", "presentation"],
  engineering: ["digital", "programming", "research", "presentation"],
  computing: ["programming", "digital", "research", "entrepreneurship"],
  business: ["communication", "digital", "leadership", "entrepreneurship"],
  law: ["communication", "research", "presentation", "languages"],
  design: ["digital", "presentation", "communication", "entrepreneurship"],
  social: ["research", "communication", "languages", "presentation"],
  science: ["research", "digital", "programming", "communication"],
  creative: ["communication", "digital", "presentation", "entrepreneurship"],
};

export function skillsForFamily(family: Family): Skill[] {
  return FAMILY_SKILLS[family] ?? [];
}

export type Gap = { skill: Skill; label: string; rated: number | null; means: string; build: string };

/** What this student would have to build for this family of work. */
export function skillGaps(
  skills: Partial<Record<Skill, number>>,
  family: Family
): Gap[] {
  return skillsForFamily(family)
    .map((id) => {
      const meta = SKILLS.find((s) => s.id === id)!;
      return { skill: id, label: meta.label, rated: skills[id] ?? null, means: meta.means, build: meta.build };
    })
    .filter((g) => g.rated === null || g.rated <= 3)
    // A gap the student has already named comes before one nobody has looked
    // at. "You said two out of five" is something to act on this week;
    // "you have not rated this" is only something to answer.
    .sort((a, b) => (a.rated ?? 3.5) - (b.rated ?? 3.5));
}

/** How far through the whole assessment somebody is, as parts rather than a percentage. */
export type Progress = { id: string; label: string; done: boolean; note: string };

export function progressOf(
  answers: IndicatorAnswers,
  skills: Partial<Record<Skill, number>>,
  careerAnswered: boolean
): Progress[] {
  const answered = answeredCount(answers);
  const rated = Object.keys(skills).length;
  return [
    {
      id: "career",
      label: "Interests, strengths and the working day you want",
      done: careerAnswered,
      note: careerAnswered ? "Answered." : "Four questions. Start here.",
    },
    {
      id: "indicator",
      label: "Twelve questions with right answers",
      done: answered === ITEMS.length,
      note: answered === 0 ? "Not started." : `${answered} of ${ITEMS.length} answered.`,
    },
    {
      id: "skills",
      label: "What you have actually practised",
      done: rated >= SKILLS.length,
      note: rated === 0 ? "Not started." : `${rated} of ${SKILLS.length} rated.`,
    },
  ];
}
