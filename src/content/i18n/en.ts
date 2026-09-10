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

  home: {
    location: "Istanbul",
    hoverHint: "Hover the marked junctions to trace the work",
    scroll: "Scroll",
    author: "The Author",
    portraitLabel: "Author portrait",
    readBiography: "Read the biography",
    practice: "The Practice",
    practiceHeading: "Training delivered where the questions are hardest.",
    countries: "Countries",
    nationalities: "Nationalities",
    papersInProgress: "Research papers in progress",
    archive: "The Archive",
    researchInProgress: "Research in progress",
    allResearch: "All research",
    novelEyebrow: "The Novel",
    enterTheNovel: "Enter the novel",
    chapters: "chapters",
    words: "words",
  },

  about: {
    eyebrow: "The Author",
    /**
     * The heading is set in two parts, the second in colour. A language is
     * free to put the whole phrase in `titleLead` and leave the accent
     * empty, since not every language splits where English does.
     */
    titleLead: "The",
    titleAccent: "Person",
    biography: "Biography",
    portraitLabel: "Author portrait",
    theWork: "The Work",
    currentRoles: "Current roles",
    practice: "Practice",
    founded: "Founded",
    recognition: "Recognition",
    theResearch: "The research",
    getInTouch: "Get in touch",
    /** {name} and {positioning} are filled in. */
    metaDescription: "Biography of {name}, {positioning}.",
  },

  work: {
    eyebrow: "The Work",
    titleLead: "A Living",
    titleAccent: "Archive",
    lede: "Academic, professional, and creative work — added continuously rather than curated once.",
    metaDescription: "A living archive of projects, roles, and initiatives.",
    viewGallery: "View gallery",
    /** {name} is the entry the gallery belongs to. */
    openGallery: "Open the gallery for {name}",
    /** {name} is IRIS, ICD or recruitment. */
    lookInto: "Look into {name}",
    detailLabels: {
      iris: "IRIS",
      icd: "ICD",
      recruitment: "recruitment",
    },
    /** The category shown at the end of each row. */
    categories: {
      Academic: "Academic",
      Research: "Research",
      Publications: "Publications",
      "International Education": "International Education",
      "Global Engagement": "Global Engagement",
      Strategy: "Strategy",
      Writing: "Writing",
      "Creative Work": "Creative Work",
      Projects: "Projects",
    },
  },

  research: {
    eyebrow: "The Archive",
    titleLead: "Research",
    titleAccent: "Archive",
    lede: "Working papers on the political economy of internationalization, nation branding, and the securitization of international students. Restricted papers are sent only after a request is reviewed personally.",
    metaDescription:
      "Working papers and academic research on the political economy of internationalization, nation branding, and the securitization of international students.",
    shapeEyebrow: "The Shape of It",
    shapeHeading: "Nine papers, one question.",
    shapeBody:
      "How institutions say one thing about international students and do another — traced through policy instruments, partnerships, merit, and security.",
    trilogyNote: "Three of these belong to one set",
    all: "All",
    /** {count} entries. Written whole so a language can inflect it. */
    entryCount: "{count} entry",
    entryCountPlural: "{count} entries",
    readAbstract: "Read abstract",
    fullEntry: "Full entry",
    openFullEntry: "Open the full entry",
    abstract: "Abstract",
    /** {names} is the list of co-authors, already joined. */
    withAuthors: "With {names}",
    /** The same list, on the one-line summary under a title. */
    withAuthorsInline: "with {names}",
    and: "and",
    viewPaper: "View paper",
    requestAccess: "Request access",
    requestInstrument: "Request the {name}",
    requestTheInstrument: "Request the instrument",
    restricted: "Restricted",
    close: "Close",
    whatAreImgIpi: "What are IMG and IPI?",
    /** {title} is the paper. */
    abstractOf: "Abstract — {title}",
    requestAccessTo: "Request access to {title}",
    keywords: "Keywords",
    authors: "Authors",
    instrumentNote: "This paper carries an instrument readers can ask to use.",
    backToArchive: "Back to the archive",
  },

  paper: {
    backToArchive: "The Archive",
    abstract: "Abstract",
    keywords: "Keywords",
    openAccess: "Open access",
    restricted: "Restricted",
    readThePaper: "Read the paper",
    requestAccess: "Request access",
    viewPaper: "View paper",
    allNine: "All nine papers",
    and: "and",
  },

  seasons: {
    eyebrow: "The Novel · The Thesis",
    heading: "Two ways of measuring a life.",
    forestLead: "A forest he knows by its seasons",
    forestRest:
      "— time that returns, circles, and forgives. Growth measured in rings, not results.",
    semestersLead: "A country that measures time in semesters",
    semestersRest:
      "— time that advances, bills, and expires. Growth measured against a deadline.",
    note: "The distance between those two clocks is the subject of both the research and the novel.",
    forest: "Forest",
    city: "City",
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
