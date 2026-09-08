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
  iris: {
    title: "IRIS",
    items: [
      { kind: "video", src: null, caption: "IRIS product walkthrough", awaiting: "Demo video" },
      { kind: "image", src: null, caption: "IRIS interface", awaiting: "Screenshot" },
    ],
  },
  "star-scholars-global-engagement": {
    title: "Global Engagement & Brand Strategy",
    items: [{ kind: "image", src: null, caption: "Global engagement work", awaiting: "Photograph" }],
  },
  "unesco-peace-diplomacy": {
    title: "UNESCO Peace and Diplomacy Programmes",
    items: [
      { kind: "image", src: null, caption: "UNESCO programme session", awaiting: "Photograph" },
    ],
  },
  "mun-spotlight": {
    title: "Model United Nations & STARLIGHT",
    items: [
      { kind: "image", src: null, caption: "Model United Nations conference", awaiting: "Photograph" },
      { kind: "image", src: null, caption: "STARLIGHT issue", awaiting: "Cover or spread" },
    ],
  },
  "international-student-recruitment": {
    title: "International Student Recruitment",
    items: [{ kind: "image", src: null, caption: "Recruitment work", awaiting: "Photograph" }],
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
    items: [{ kind: "image", src: null, caption: "MUN programmes", awaiting: "Photographs" }],
  },
  starlight: {
    title: "STARLIGHT",
    items: [{ kind: "image", src: null, caption: "STARLIGHT", awaiting: "Cover or spread" }],
  },
};

export function getMediaSet(key: string): MediaSet | null {
  return mediaSets[key] ?? null;
}
