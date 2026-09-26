/**
 * The skills a student can actually build before they leave school.
 *
 * Kept separate from aptitude on purpose. An aptitude is what somebody finds
 * easy; a skill is what they have practised, and the second one is the only
 * one a seventeen year old can change this year. Half of what makes an
 * application competitive sits in this list rather than in the grades, and
 * almost nobody tells them which half.
 *
 * Each one carries what it means in practice and the smallest real thing
 * that builds it, because "improve your communication skills" is advice
 * nobody has ever acted on.
 */

export type Skill =
  | "digital"
  | "communication"
  | "programming"
  | "research"
  | "presentation"
  | "leadership"
  | "entrepreneurship"
  | "languages";

export const SKILLS: { id: Skill; label: string; means: string; build: string }[] = [
  {
    id: "digital",
    label: "Digital",
    means: "Spreadsheets, documents, files that open on somebody else's machine, and finding your way around software nobody has taught you.",
    build: "Keep one real thing in a spreadsheet for a month: your own budget, a club's accounts, your applications.",
  },
  {
    id: "communication",
    label: "Writing and speaking",
    means: "Saying a complicated thing in a way somebody else understands the first time, in writing and out loud.",
    build: "Write 200 words a week about something you did and read it back a day later. The essay is graded on this.",
  },
  {
    id: "programming",
    label: "Programming",
    means: "Making a computer do something that was not already possible, and reading code somebody else wrote.",
    build: "Finish one small thing end to end rather than three tutorials. A working calculator beats a half-built game.",
  },
  {
    id: "research",
    label: "Research",
    means: "Finding out whether something is true, from a source that is not the first search result.",
    build: "Take one claim you believe and find who first said it and on what evidence.",
  },
  {
    id: "presentation",
    label: "Presenting",
    means: "Standing in front of people with something to say and getting through it without reading the slides.",
    build: "Speak for three minutes at any school event. The first one is the hard one.",
  },
  {
    id: "leadership",
    label: "Leading",
    means: "Getting a group of people who do not report to you to finish something.",
    build: "Run one event from start to finish, including the boring part after it ends.",
  },
  {
    id: "entrepreneurship",
    label: "Starting things",
    means: "Noticing that something is missing and building it anyway, usually without permission or money.",
    build: "Start the smallest version of the thing and show it to ten people.",
  },
  {
    id: "languages",
    label: "Languages",
    means: "Working in a language that is not your first, which is what an entire degree abroad is.",
    build: "Read something you enjoy in that language for fifteen minutes a day. Test preparation is not the same thing.",
  },
];

export function skillMeta(id: Skill) {
  return SKILLS.find((s) => s.id === id);
}
