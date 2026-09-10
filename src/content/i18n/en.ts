/**
 * The English source of every string the interface says.
 *
 * This file is canonical. The other four languages are overlays on it
 * (src/content/i18n/ar.ts and so on), each holding the same keys with the
 * same meaning said in another language, and anything an overlay leaves out
 * falls back to what is written here. That fallback is deliberate: a half
 * translated page should read as English in the gaps, never as a raw key.
 *
 * Prose that belongs to the content itself — the bio, the work summaries,
 * the abstracts — lives under `content`, keyed by the slug it describes, so
 * a translation can be attached to a record without duplicating the record.
 */

export const en = {
  /** How the language names itself, for the switcher. */
  languageName: "English",

  nav: {
    author: "The Author",
    work: "The Work",
    research: "Research",
    journal: "The Journal",
    contact: "Correspondence",
    novel: "The Novel",
    novelTitle: "The Highest Branch",
  },

  header: {
    home: "Saadan Qasmani — home",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    language: "Language",
    chooseLanguage: "Choose a language",
    /** The heading above the links inside the phone menu. */
    browse: "Browse",
  },

  /** The panel that opens once, on a first visit, about the novel. */
  announcement: {
    eyebrow: "Out 19 October 2026",
    heading: "The Highest Branch",
    body: "A boy crosses the pass at seventeen, leaving a forest he knows by its seasons for a country that measures time in semesters.",
    ask: "Leave an address and you will hear the day it is out. Nothing else.",
    placeholder: "you@example.com",
    submit: "Tell me when it is out",
    sending: "Sending",
    done: "You will hear from me on the day.",
    readMore: "Read about the novel",
    dismiss: "Close",
    later: "Not now",
  },

  newsletter: {
    emailLabel: "Email address",
    placeholder: "your@email.com",
    subscribe: "Subscribe",
    sending: "Sending",
    done: "You have entered the correspondence.",
    failed: "Something went wrong. Please try again.",
  },

  footer: {
    releaseLine: "19 October 2026",
    theNovel: "The novel",
    correspondence: "Correspondence",
    lettersHeading: "Letters from the archive, sent rarely.",
    lettersBody: "New research, journal entries, and news of",
    lettersBodyAfter: "— only when there is something worth saying.",
    index: "Index",
    orderACopy: "Order a copy",
    rights: "Saadan Qasmani · Istanbul",
    positioning: "Writer, researcher, and strategist",
  },

  /** The banner that says a translation is a translation. */
  translation: {
    machineNotice:
      "This page is a translation. Where a word carries weight, the English original is the one that was written.",
    abstractNotice: "Unofficial translation. The published abstract is in English.",
    showOriginal: "Show the English original",
    hideOriginal: "Hide the English original",
    originalHeading: "The English original",
  },
};

export type Dictionary = typeof en;
