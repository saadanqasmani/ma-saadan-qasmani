/**
 * Media attached to a section of the site.
 *
 * Every entry ships with its slots declared but its files absent, so the
 * gallery is live and clickable before a single photograph arrives. A slot
 * with no `src` renders as a designed placeholder that states what belongs
 * there, rather than a broken image or an empty modal.
 *
 * When a file arrives, set `src` (a path under /public, or a Supabase public
 * URL) and, for video, `kind: "video"`. Nothing else changes.
 */

export type MediaItem = {
  kind: "image" | "video";
  /** null until the real file exists. */
  src: string | null;
  /** Describes the image for screen readers and doubles as the caption. */
  caption: string;
  /** What is expected here, shown on the placeholder. */
  awaiting?: string;
};

export type MediaSet = {
  title: string;
  items: MediaItem[];
};

/** Keyed by work item slug, plus a few standalone sets used on The Author. */
export const mediaSets: Record<string, MediaSet> = {
  "star-scholars-global-engagement": {
    title: "Global Engagement & Brand Strategy",
    items: [
      { kind: "image", src: "/star1.png.jpeg", caption: "At the STAR Scholars Network stand" },
      { kind: "image", src: "/star3.png.jpeg", caption: "2024 STAR Global Conference, Kathmandu University" },
      { kind: "image", src: "/star5.png.jpeg", caption: "At the conference backdrop" },
      { kind: "image", src: "/star2.png.jpeg", caption: "In front of the conference programme" },
      { kind: "image", src: "/star6.png.jpeg", caption: "The STAR Scholars Network stand" },
      { kind: "image", src: "/star4.png.jpeg", caption: "Delegates at the 2024 STAR Global Conference" },
      { kind: "image", src: "/star8.png.jpeg", caption: "Delegates outside the venue" },
      { kind: "image", src: "/star7.png.jpeg", caption: "With a colleague at the conference" },
      { kind: "image", src: "/star9.png.jpeg", caption: "Kathmandu University, 2024 STAR Global Conference" },
    ],
  },
  "unesco-peace-diplomacy": {
    title: "UNESCO Peace and Diplomacy Programmes",
    items: [
      { kind: "image", src: "/unesco.png.jpeg", caption: "Leading a session" },
      { kind: "image", src: "/unesco3.png.jpeg", caption: "Participants in session" },
      { kind: "image", src: "/unesco2.png.jpeg", caption: "With the host institution" },
      { kind: "image", src: "/unesco4.png.jpeg", caption: "Outside the venue" },
    ],
  },
  "international-student-recruitment": {
    title: "International Student Recruitment",
    items: [
      { kind: "image", src: "/recruitment1.png.jpeg", caption: "At the fair, İstanbul Nişantaşı University stand" },
      { kind: "image", src: "/recruitment2.png.jpeg", caption: "Talking a prospective student through the offer" },
      { kind: "image", src: "/recruitment3.png.jpeg", caption: "On the stand" },
    ],
  },
  icd: {
    title: "ICD training",
    items: [
      { kind: "image", src: "/icd1.png.jpeg", caption: "Leading a session" },
      { kind: "image", src: "/icd2.png.jpeg", caption: "A session in progress" },
      { kind: "image", src: "/icd6.png.jpeg", caption: "Presenting on the marginalization of the international student community" },
      { kind: "image", src: "/icd4.png.jpeg", caption: "The full cohort" },
      { kind: "image", src: "/icd5.png.jpeg", caption: "Certificates at the close of a session" },
      { kind: "image", src: "/icd3.png.jpeg", caption: "Participants between sessions" },
    ],
  },
  award: {
    title: "Presidential Award of Service and Excellence",
    items: [
      {
        kind: "image",
        src: "/award-1.jpg",
        caption: "The award, 2024 STAR Global Conference",
      },
      {
        kind: "image",
        src: "/award-2.jpg",
        caption: "With Dr. Osman Gültekin, Kathmandu University, Nepal",
      },
    ],
  },
  mun: {
    title: "Model United Nations",
    items: [
      { kind: "image", src: "/mun4.png.jpeg", caption: "On stage at IAUMUN" },
      { kind: "image", src: "/mun2.png.jpeg", caption: "Delegates and organisers, Istanbul Aydın University" },
      { kind: "image", src: "/mun3.png.jpeg", caption: "The opening session" },
      { kind: "image", src: "/mun5.png.jpeg", caption: "A committee in session" },
      { kind: "image", src: "/mun1.png.jpeg", caption: "Receiving a certificate at the conference" },
      { kind: "image", src: "/mun10.png.jpeg", caption: "A committee room" },
      { kind: "image", src: "/mun11.png.jpeg", caption: "Committee work" },
    ],
  },
  starlight: {
    title: "STARLIGHT",
    items: [
      { kind: "image", src: "/starlight2.png.jpeg", caption: "A STARLIGHT cover" },
      { kind: "image", src: "/starlight1.png.jpeg", caption: "With copies of the magazine" },
    ],
  },
};

export function getMediaSet(key: string): MediaSet | null {
  return mediaSets[key] ?? null;
}
