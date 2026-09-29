/**
 * The opening of the novel, set as the printed book sets it.
 *
 * This is the interior of The Highest Branch, front matter through the
 * prologue, and then the note about the man who wrote it. It is the real
 * text, not a summary: a reader who clicks the cover should be reading the
 * book within a second, and should stop at exactly the place the free part
 * stops, which is the first line of chapter one.
 *
 * Inline emphasis is written the way it is written in a manuscript, with
 * *one asterisk* for italic and **two** for bold, because a content file
 * that is readable by the person whose words are in it is worth more than
 * one that saves the reader a parser.
 */

export type Line =
  | { tag: "p" | "sub" | "quote"; text: string }
  | { tag: "gap"; text?: undefined };

export type Section = {
  id: string;
  /** Printed at the head of the section, the way the book prints it. */
  heading: string;
  /** The right-hand running head on every page after the first. */
  running: string;
  lines: Line[];
};

/** For Osman, on the page that is only for him. */
export const dedication = {
  body: [
    "For Osman Gültekin, on his forty-fifth birthday.",
    "There is no part of this that is only mine.",
    "Most of the questions are mine, most of the answers are yours.",
    "I’m sure many wonder why I keep coming back to your office on random Thursdays.",
    "This is the answer, and it *only* took four hundred pages.",
  ] as const,
  postscript: "P.S. Nobody laughs at your jokes. I always will.",
};

/**
 * What the book holds, with the page each thing starts on.
 *
 * These are the folios of the printed 6x9 interior, not of anything on this
 * site, which is why they are written out rather than counted.
 */
export const contents: readonly { title: string; page: number; chapter?: number }[] = [
  { title: "Author’s Note", page: 5 },
  { title: "Who It Is For", page: 8 },
  { title: "Prologue", page: 10 },
  { title: "Questions With Teeth", page: 12, chapter: 1 },
  { title: "The Upright", page: 25, chapter: 2 },
  { title: "What a Future Costs", page: 40, chapter: 3 },
  { title: "A Jungle With No Down", page: 53, chapter: 4 },
  { title: "The Shape of a Season", page: 73, chapter: 5 },
  { title: "The Specimen", page: 91, chapter: 6 },
  { title: "What It Costs to Stay", page: 110, chapter: 7 },
  { title: "The Criminal", page: 124, chapter: 8 },
  { title: "The Verrian Year", page: 148, chapter: 9 },
  { title: "Otto", page: 178, chapter: 10 },
  { title: "What an Institution Cannot Do", page: 203, chapter: 11 },
  { title: "Six Years of Goodwill", page: 219, chapter: 12 },
  { title: "The Seventh Region", page: 238, chapter: 13 },
  { title: "سعدان", page: 254, chapter: 14 },
  { title: "The Eleven", page: 276, chapter: 15 },
  { title: "Flagged", page: 284, chapter: 16 },
  { title: "The Shaving", page: 307, chapter: 17 },
  { title: "The Resignation", page: 324, chapter: 18 },
  { title: "The Refusal", page: 334, chapter: 19 },
  { title: "What Am I For", page: 351, chapter: 20 },
  { title: "A Thirdday", page: 360, chapter: 21 },
  { title: "The Desk", page: 369, chapter: 22 },
  { title: "Good At It", page: 379, chapter: 23 },
  { title: "An Extension of Your Body", page: 388, chapter: 24 },
  { title: "Tavi", page: 397, chapter: 25 },
  { title: "The Sample They Carry", page: 405, chapter: 26 },
  { title: "The Offer", page: 421, chapter: 27 },
  { title: "The More Interesting Result", page: 430, chapter: 28 },
  { title: "The Highest Branch", page: 437, chapter: 29 },
  { title: "Ending Note", page: 446 },
  { title: "About the Author", page: 447 },
];

export const sections: readonly Section[] = [
  {
    id: "authors-note",
    heading: "Author’s Note",
    running: "Author’s Note",
    lines: [
      { tag: "p", text: "I did not set out to write a novel." },
      { tag: "p", text: "I set out, some years ago and with a colleague who became a friend, to answer a question about universities. The question was ordinary. The answer took three years and over four papers, and at the end of it I had a great deal of evidence and a vocabulary that almost nobody outside a small field can read." },
      { tag: "p", text: "This book is what happened when I gave up on the vocabulary." },
      { tag: "p", text: "I should say plainly that I was not standing outside any of this while I studied it. I was inside it, on a permit, doing the arithmetic, and so were most of the people who told me the things that ended up in these pages." },
      { tag: "p", text: "Every institutional mechanism in this novel is real and most of them are documented. I want to be specific, because a fable can be dismissed as an exaggeration and I would rather be checked." },
      { tag: "p", text: "**The differential fee.** International students pay several times what domestic students pay for the same seat. This is not concealed. It is published, it is defended on reasonable grounds, and it is the financial foundation of the entire arrangement." },
      { tag: "p", text: "**The award that is not what it says.** Scholarships calculated against a published fee that is not the fee the recipient will be charged. Letters that are accurate in every particular, and that a family cannot read against a schedule four pages away in a different document. I have seen this. The wording gets corrected. The cohort already issued does not." },
      { tag: "p", text: "**The commission.** Agencies are paid a percentage of first-year fee, per enrolment, by the institution. Between fifteen and twenty per cent is standard. It is paid on enrolment and not on completion. Nobody in that chain has a financial interest in what happens to a student after they sit down." },
      { tag: "p", text: "**Scholarship capture.** In some institutions, a substantial proportion of merit awards are allocated through agents. Every recipient meets the published criteria. Far more candidates meet the criteria than there are awards, and the ranking among them is performed on capacity to pay the remainder, because an award that is not taken up is a seat unfilled and a commission unpaid. The word on the letter is still merit." },
      { tag: "p", text: "**Attrition.** A student who withdraws in the second year has paid for a place that can be refilled. Nobody designs for this and nobody has to. Look at what an institution earns from those who leave against what it earns from those who finish, and then look at what it spends on keeping them, and the ratio will tell you what the arrangement is actually for." },
      { tag: "p", text: "**Tokenism.** The cultural festival, the photograph, the page in the prospectus. I have stood behind that table. I have written the cards by hand. The people who organise these events care enormously and work themselves into the ground, and the events are, in most institutions, the entire visible answer to a question nobody has asked out loud. Measure the visible expenditure against the structural expenditure in the same document, by cohort, and you will have a number." },
      { tag: "p", text: "**Hope trafficking.** This is the term my colleague and I arrived at and could not avoid. It describes the extraction of value from aspiration by means of statements that are true. Nobody is deceived. There is no lie anywhere in the transaction. A family sells land for a sentence, and the sentence is accurate, and the price is written on the underside where it cannot be read from where they are standing." },
      { tag: "quote", text: "*You cannot catch a clever animal with a lie. A clever animal smells a lie. You catch him with a true thing that costs more than he can see.*" },
      { tag: "p", text: "There are no villains in this book because there are none in the system." },
      { tag: "p", text: "This is the finding I most want to survive being read as fiction. In all the years of this work I have met almost nobody who was cruel, and a great many people who were decent, overworked and constrained. The adviser who tells a student how he is coming across believes she is helping, and she is. The officer who corrects a stranger's paperwork is doing an unpaid kindness. The director who cannot establish a post has applied six times and been refused six times." },
      { tag: "p", text: "Marginalisation is not discrimination. Discrimination is an act with an actor, and it can be named, and there is a policy about it and a poster in the corridor. Marginalisation is the absence of a mechanism. It has no author, and there is nobody to be angry at, and that is exactly what makes it durable." },
      { tag: "p", text: "Every document in this arrangement is accurate. Every fee is posted. Every criterion is published. And the aggregate is a system for converting hope into revenue at a known rate of attrition." },
      { tag: "quote", text: "*The most dangerous lies are not the ones that help nobody. They are the ones that help someone, a little, for a long time.*" },
    ],
  },
  {
    id: "who-it-is-for",
    heading: "Who It Is For",
    running: "Who It Is For",
    lines: [
      { tag: "p", text: "**For the ones inside it.** If you have counted your own permit days on the back of an envelope, if you have been picked out of a queue in under a second and told it was routine, if you have gone home and found that you can no longer sit properly in your own house, if you have changed something about yourself in order to be a little more legible in a room and told nobody afterward: I have no advice. This is not a self-help book and there is no chart. I want only to say that the thing you have been carrying alone is a structure and not a personal failing, that it was built before you arrived, and that hundreds of thousands of people in one country are each carrying it alone, believing they are the only one at the window." },
      { tag: "p", text: "**For the ones who run it.** You are not who I thought you were when I arrived. Most of you are trying. That is exactly the problem and it is why this book has no villain in it. If you take one thing: put two numbers on the same page. What you earn from the ones who leave and what you spend on keeping them. The visible spend and the structural spend. Nothing else in this book is as cheap or as effective, and the reason it does not happen is not malice, it is that nobody has ever had to." },
      { tag: "p", text: "**For the ones who left and did not arrive.** There are more of you than of us. You are not in the brochure and there is no photograph of you and no institution counts you after the fourth column. This book is largely about a man who, by every count the arrangement keeps, made it, and I want to say plainly that he is not the point. He is what the arrangement calls a survivor, from a consignment that was costed with the losses in it before the ship sailed, and the ones who did not survive are not a failure of the arrangement. They are the arrangement." },
      { tag: "sub", text: "The debt" },
      { tag: "p", text: "Everything of value in this book was worked out with Dr. Osman, over three years, mostly after seven at night, in an office with a window that did not open. Whole chapters of it are his. So is about half of what I believe." },
      { tag: "p", text: "I want to record one thing that the novel could not say, because a novel has to keep its dignity and I do not." },
      { tag: "p", text: "There is a version of me that did not get out. Not one. Several, and I can name them, and two of them were the best minds in the room. The difference between us was not merit and it was not effort. In one case it was four measures of what a household had in a particular season, and in another it was the price of shipping in a year when the rates collapsed, and in a third it was that a letter went to an address that an office already held a correction for." },
      { tag: "p", text: "That is the finding, after all the papers." },
      { tag: "p", text: "I do not know what to do with it either." },
    ],
  },
  {
    id: "prologue",
    heading: "Prologue",
    running: "Prologue",
    lines: [
      { tag: "p", text: "The bird did not know it was a bird." },
      { tag: "p", text: "It knew three things. It knew the wind. It knew the fold, which is what the body does when it has decided. And it knew the gap." },
      { tag: "p", text: "Not the canopy. The canopy is closed and holds nothing and a bird can cross a thousand acres of that and go home with the day unspent. What it wanted was the place where the roof had failed. A clearing. A felled giant. Any opening where the light came down whole and the small warm things came out to work in it." },
      { tag: "p", text: "It hunted the light." },
      { tag: "p", text: "That is the part nobody says. The gap is not a wound in a forest; the gap is where a forest happens. Every fast green thing on earth grew in an opening. Every seed that ever made anything of itself was one that landed where the roof had gone. The gap is the promise. It is the only promise a floor ever gets, and everything that is going to rise, rises there, and everything that can be taken is taken there, and those are not two facts." },
      { tag: "p", text: "The bird did not know that either. It knew that it went where the light got in." },
      { tag: "gap" },
      { tag: "p", text: "It came down on a hot afternoon with its wings folded, and opened at the last possible moment with a crack like a branch giving way, and took the smaller of two children out of the shade of an overturned basket without seeming to slow." },
      { tag: "p", text: "The child made a sound. It was not a scream. It was the small startled almost polite sound a child makes when a cup is taken out of her hands." },
      { tag: "p", text: "The bird did not hate her. There was nothing in it that could have held a thing like hate; it had no room and no use for one. It had gone where the trees opened because that is where a body like that can work. She had been in the opening because that is where the fruit falls. The fruit falls there because the trees open." },
      { tag: "p", text: "Every part of it was old. None of it was arranged. There was no one in that clearing, or above it, or a thousand years behind it, who had decided anything at all." },
      { tag: "p", text: "And above, in the high branches, the forest looked, and understood, and resumed." },
      { tag: "gap" },
      { tag: "p", text: "Somewhere in it a boy of ten crouched on a low limb, holding on with all four hands, and watched a woman run across open ground towards a place where there was nothing." },
      { tag: "p", text: "He was the asking kind. He would want to know who had done it." },
      { tag: "p", text: "He would spend his whole life looking, in many countries, in multiple languages, in rooms with no windows on one side, and he would find, every single time, a competent person doing a reasonable thing, and the fruit still falling in the gap, and the small warm things still working in it because the light gets in there and nowhere else." },
      { tag: "gap" },
      { tag: "p", text: "The bird was three miles out and climbing." },
      { tag: "p", text: "It went up in a slow spiral on the warm air that comes off cleared ground in the afternoon. The ground's own heat, given back, lifting the thing that hunts it. That is not cruelty either. That is only how air behaves when the roof is gone." },
      { tag: "p", text: "When it had climbed high enough it could see the whole of that forest at once. The river. The ridge. The pale line of the eastern trade. The notch at the top where the canopy failed." },
      { tag: "p", text: "It had no word for any of it and needed none." },
      { tag: "p", text: "It knew only this, which is the whole of what it knew and the whole of what it was:" },
      { tag: "p", text: "that from up here you can see where the openings are." },
      { tag: "p", text: "And that a thing which can see the openings does not have to be cruel, or clever, or even hungry very often." },
      { tag: "p", text: "It only has to be higher." },
    ],
  },
];

/** The last page of the preview: who wrote it, and how to reach him. */
export const aboutTheAuthor: Section = {
  id: "about-the-author",
  heading: "About the Author",
  running: "About the Author",
  lines: [
    { tag: "p", text: "M. A. Saadan Qasmani grew up in Islamabad, Pakistan and now lives in Istanbul, Türkiye, which is his second city and has been for some years." },
    { tag: "p", text: "He is an intercultural competence development practitioner and a researcher working on the political economy of the internationalisation of higher education, and on the marginalisation of international students: how institutions recruit, price and count the people who cross borders to study, and what that arrangement does to them afterwards. He has trained participants across the globe from more than seventy nationalities, and is reading for a master's in Political Science and International Relations." },
    { tag: "p", text: "*The Highest Branch* is his first novel, and it did not start off as fiction. What he wrote first, from inside the arrangement, drowning in it, watching the people around him drown, was the only thing he had been taught to write, which was papers. The papers were correct and nothing moved. The problem was never that the evidence was missing. It was that nobody with the power to act gave a fuck, and nobody was ever going to. Fiction was the only form left that anybody would actually read." },
    { tag: "p", text: "If you are an international student, and something in this book was yours, he would like to hear from you. Not as a case, and not for research, and nothing you say will appear anywhere. Write to him at qasmanisaadan@gmail.com. He answers his own post, and it may take him a while, but he will answer." },
    { tag: "p", text: "saadanqasmani.com" },
  ],
};
