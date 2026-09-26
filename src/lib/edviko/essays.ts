/**
 * The personal essay, and an honest reader for it.
 *
 * One essay goes to every American university a student applies to, it is
 * between 250 and 650 words, and it is the only part of the application
 * where the student speaks in their own voice rather than in numbers. In
 * Pakistan and Türkiye it is also the part nobody has been taught to write,
 * because it is not an exam answer and every instinct an exam teaches —
 * announce the topic, use long words, conclude that hard work is important —
 * makes it worse.
 *
 * What this reader does NOT do is score it. There is no model here, and a
 * fake one would be worse than nothing: a student told "8/10, good use of
 * imagery" by a regular expression would believe it. What it does is measure
 * the things that are measurable — length, sentence rhythm, how the piece
 * opens, how many sentences begin with "I", the phrases every admissions
 * officer has read ten thousand times — and hand those to the student and
 * their advisor as evidence, not as a verdict.
 *
 * The prompts are published by the Common Application and are reproduced
 * here with their source, because a workspace that paraphrased them would
 * quietly change the question being answered.
 */

export type Prompt = { id: number; text: string };

export const PROMPT_SOURCE = {
  name: "The Common Application, first-year essay prompts",
  url: "https://www.commonapp.org/apply/essay-prompts",
  asOf: "2026-09-26",
  /** Set true only once checked against the live page for this cycle. */
  verified: false,
};

export const PROMPTS: Prompt[] = [
  { id: 1, text: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story." },
  { id: 2, text: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?" },
  { id: 3, text: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?" },
  { id: 4, text: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?" },
  { id: 5, text: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others." },
  { id: 6, text: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?" },
  { id: 7, text: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design." },
];

export const MIN_WORDS = 250;
export const MAX_WORDS = 650;

export type Draft = {
  id: string;
  promptId: number;
  text: string;
  /** Saved versions, newest last. A draft nobody can go back from is not a draft. */
  versions: { at: string; text: string }[];
  comments: Comment[];
};

export type Comment = {
  id: string;
  by: string;
  at: string;
  /** The sentence being commented on, so a note is attached to something. */
  quote: string;
  text: string;
};

export const ESSAY_KEY = "ev-essay";

export function readDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Draft;
    return d && typeof d.text === "string" ? { ...d, versions: d.versions ?? [], comments: d.comments ?? [] } : null;
  } catch {
    return null;
  }
}

export function emptyDraft(promptId = 1): Draft {
  return { id: "essay", promptId, text: "", versions: [], comments: [] };
}

/* ------------------------------------------------------------------ *
 * Reading it
 * ------------------------------------------------------------------ */

export type Tone = "good" | "watch" | "problem";

export type Finding = {
  id: string;
  tone: Tone;
  title: string;
  detail: string;
};

export function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * The phrases that have been read ten thousand times.
 *
 * Not one of them is wrong English. Every one of them tells an admissions
 * officer that the sentence around it could have been written by anybody,
 * which is the one thing this essay cannot afford.
 */
const WORN = [
  "ever since i was",
  "from a young age",
  "from an early age",
  "little did i know",
  "changed my life",
  "make a difference",
  "passion for",
  "in today's world",
  "taught me the value of",
  "outside my comfort zone",
  "the rest is history",
  "i have always been fascinated",
  "hard work pays off",
  "i realized that",
  "this experience taught me",
];

export function analyse(text: string): Finding[] {
  const out: Finding[] = [];
  const w = words(text);
  const s = sentences(text);
  if (w.length === 0) return out;

  // Length against the published limit.
  if (w.length > MAX_WORDS) {
    out.push({
      id: "too-long",
      tone: "problem",
      title: `${w.length} words, and the limit is ${MAX_WORDS}`,
      detail: `Cut ${w.length - MAX_WORDS}. The form will not take it, and the cut usually improves it: the first paragraph of a first draft is almost always throat-clearing.`,
    });
  } else if (w.length < MIN_WORDS) {
    out.push({
      id: "too-short",
      tone: "problem",
      title: `${w.length} words, and the minimum is ${MIN_WORDS}`,
      detail: "Under the minimum it cannot be submitted. Under 500 it usually means one scene has been summarised rather than shown.",
    });
  } else if (w.length < 500) {
    out.push({
      id: "short",
      tone: "watch",
      title: `${w.length} words, of ${MAX_WORDS} allowed`,
      detail: "Within the limit, but you are giving away room you are allowed to use. Most essays that work sit between 550 and 650.",
    });
  } else {
    out.push({
      id: "length",
      tone: "good",
      title: `${w.length} words, of ${MAX_WORDS} allowed`,
      detail: "Using the room without going over.",
    });
  }

  // Rhythm. One long sentence after another is what makes an essay tiring.
  const lengths = s.map((x) => words(x).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length);
  const longest = Math.max(0, ...lengths);
  if (avg > 25) {
    out.push({
      id: "long-sentences",
      tone: "watch",
      title: `Sentences average ${Math.round(avg)} words`,
      detail: "Long throughout is tiring to read. The fix is not shorter sentences everywhere; it is one short one after three long ones.",
    });
  }
  if (longest > 45) {
    out.push({
      id: "longest",
      tone: "watch",
      title: `Your longest sentence is ${longest} words`,
      detail: "Read it aloud. If you run out of breath, so does the reader.",
    });
  }

  // Paragraphs.
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 1 && w.length > 200) {
    out.push({
      id: "one-block",
      tone: "problem",
      title: "One block of text",
      detail: "Nobody reads a wall. Break it where the scene changes, where time moves, or where you start thinking rather than describing.",
    });
  }

  // The opening. It is the only sentence guaranteed to be read.
  const first = s[0] ?? "";
  const firstWords = words(first).length;
  if (firstWords > 30) {
    out.push({
      id: "opening",
      tone: "watch",
      title: "Your first sentence is long",
      detail: `${firstWords} words. It is the only sentence you are guaranteed a reader for. The strongest openings are short and put us somewhere specific.`,
    });
  }
  if (/^(in this essay|i am going to|this essay will|my name is)/i.test(first)) {
    out.push({
      id: "announcing",
      tone: "problem",
      title: "The opening announces the essay",
      detail: "Exam training. Start in the scene instead; the reader works out what it is about because you show them.",
    });
  }

  // How many sentences start with "I". Some is the point; most is a list.
  const iStart = s.filter((x) => /^i\b/i.test(x)).length;
  if (s.length >= 6 && iStart / s.length > 0.5) {
    out.push({
      id: "i-heavy",
      tone: "watch",
      title: `${iStart} of ${s.length} sentences begin with "I"`,
      detail: "The essay is about you, so some of this is right. Over half reads as a list of things you did rather than a story somebody can picture.",
    });
  }

  // Repeated openings.
  const openers = new Map<string, number>();
  for (const x of s) {
    const o = words(x)[0]?.toLowerCase();
    if (o) openers.set(o, (openers.get(o) ?? 0) + 1);
  }
  const repeated = [...openers.entries()].filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]);
  if (repeated.length > 0) {
    out.push({
      id: "repeated-openers",
      tone: "watch",
      title: `${repeated[0][1]} sentences start with the same word`,
      detail: `"${repeated[0][0]}" opens ${repeated[0][1]} of them. Vary where the sentence begins and the whole piece loosens.`,
    });
  }

  // Worn phrases.
  const lower = text.toLowerCase();
  const found = WORN.filter((phrase) => lower.includes(phrase));
  if (found.length > 0) {
    out.push({
      id: "worn",
      tone: found.length > 2 ? "problem" : "watch",
      title: `${found.length} phrase${found.length === 1 ? "" : "s"} an admissions officer has read ten thousand times`,
      detail: `${found.map((f) => `"${f}"`).join(", ")}. None of them is wrong English. Each one tells the reader this sentence could have been written by anybody.`,
    });
  }

  // Telling rather than showing.
  const telling = (lower.match(/\b(i learned|i realised|i realized|i understood|taught me)\b/g) ?? []).length;
  if (telling >= 3) {
    out.push({
      id: "telling",
      tone: "watch",
      title: `The essay states its lesson ${telling} times`,
      detail: "Saying what you learned is the part the reader can work out themselves. Keep the strongest one and cut the rest; use the room for the scene instead.",
    });
  }

  // Specifics: numbers, names and places are what make a story yours.
  //
  // Counted after the first word of each sentence. Every sentence begins with
  // a capital letter, so counting those as names finds "Ever", "This" and
  // "From" in a draft that contains no name at all — which is exactly the
  // draft this rule exists to catch.
  const proper = s.reduce((n, line) => {
    const rest = words(line).slice(1).join(" ");
    return n + (rest.match(/\b[A-Z][a-z]{2,}\b/g) ?? []).length;
  }, 0);
  const digits = (text.match(/\b\d+\b/g) ?? []).length;
  if (w.length > 300 && proper + digits < 5) {
    out.push({
      id: "unspecific",
      tone: "watch",
      title: "Very few names, places or numbers",
      detail: "Specifics are what stop an essay being interchangeable with the other forty thousand about resilience. Name the street, the teacher, the year, the price.",
    });
  } else if (proper + digits >= 8) {
    out.push({
      id: "specific",
      tone: "good",
      title: "Grounded in specifics",
      detail: "Names, places and numbers. This is what makes it yours rather than anyone's.",
    });
  }

  return out;
}

/** Everything that would stop it being submitted, as opposed to improved. */
export function blocking(findings: Finding[]): Finding[] {
  return findings.filter((f) => f.id === "too-long" || f.id === "too-short");
}

export function stamp(): string {
  return new Date().toISOString();
}
