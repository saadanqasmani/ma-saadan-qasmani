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
    ask: "Leave an address and you will hear the day it is out.",
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
    recruitmentTitleLead: "International Student",
    recruitmentTitleAccent: "Recruitment",
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

  journal: {
    eyebrow: "The Journal",
    titleLead: "Essays",
    titleAccent: "& Notes",
    lede: "Writing that sits between the research and the fiction.",
    metaDescription: "Essays, reflections, and commentary.",
    comingSoon: "Coming soon",
    comingSoonHeading: "The first essays are still being written.",
    comingSoonBody:
      "You are on the list, so each one reaches you as it is published. This is where the writing between the research and the fiction will live.",
    coverLabel: "Cover",
    gate: {
      eyebrow: "For subscribers",
      heading: "The essays and notes are for subscribers.",
      body: "Notes from the archive, arguments still forming, and the occasional piece that belongs to neither the research nor the fiction. Subscribe and this page opens straight away; you are emailed an access code for next time, and a note whenever something new goes up.",
      subscribe: "Subscribe",
      emailPlaceholder: "you@example.com",
      enter: "Enter",
      unlocksNote: "The page unlocks the moment you subscribe.",
      haveCode: "Already have a code",
      codePlaceholder: "Access code",
      unlock: "Unlock",
      codeNote: "It was in the email you were sent when you subscribed.",
      enterCode: "Enter your access code.",
      wrongCode: "That code is not right. Check the email you were sent.",
      badEmail: "Enter a valid email address.",
      notConnected: "The list isn't connected yet. Use your access code for now.",
      failed: "Something went wrong. Please try again.",
    },
  },

  contact: {
    eyebrow: "Correspondence",
    titleLead: "Get in",
    titleAccent: "Touch",
    lede: "For professional inquiries, speaking requests, research collaboration, or general correspondence.",
    metaDescription:
      "Get in touch, request professional contact, or arrange an appointment.",
    basedIn: "Based in",
    appointments: "Appointments",
    /** {provider} is Calendly. */
    bookingNote:
      "Booking runs on {provider}. Pick a time that suits you and it lands directly in the calendar.",
    bookATime: "Book a time",
    elsewhere: "Elsewhere",
  },

  forms: {
    required: "Required",
    invalidEmail: "Enter a valid email address",
    somethingWrong: "Something went wrong.",
    tryAgain: "Something went wrong. Please try again.",
    sending: "Sending…",
    close: "Close",
    cancel: "Cancel",

    name: "Name",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    phoneNumber: "Phone number",
    subject: "Subject",
    message: "Message",
    optionalMessage: "Optional message",
    country: "Country",
    city: "City",
    institution: "Institution",
    position: "Position / title",
    reason: "Reason for requesting access",
    shippingAddress: "Shipping address",
    quantity: "Quantity",

    sendMessage: "Send Message",
    contactDone: "Your message has been received. Thank you.",

    submitRequest: "Submit Request",
    /** {title} is the paper. Written whole so the quotation marks travel. */
    requestingAccess:
      "Requesting access to {title}. Every request is reviewed before anything is sent.",
    requestDone:
      "Your request for {title} has been received. Every request is reviewed individually — you will hear back if it is approved.",

    submitOrder: "Submit Order",
    orderDone:
      "Your order has been received. Our team reviews every order personally — you will receive payment and shipping instructions by email once it is confirmed. No payment is required yet.",
    orderNote:
      "This form does not collect payment or banking details. Our team reviews every order personally and sends payment instructions directly once your order is confirmed.",
  },

  novel: {
    aNovel: "A Novel",
    /** The title is set in two lines, the second in colour. */
    titleLead: "The Highest",
    titleAccent: "Branch",
    theBook: "The Book",
    /** {title} is the novel. */
    coverAlt: "Cover of {title}",
    coverLabel: "Book cover",
    chapters: "Chapters",
    words: "Words",
    form: "Form",
    status: "Status",
    availability: "Availability",
    orderACopy: "Order a copy",
    /** {name} is the author. */
    byline: "{title} — a novel by {name}",
    purchase: {
      amazonTab: "EU & Americas",
      amazonNote: "via Amazon",
      directTab: "Türkiye & Pakistan",
      directNote: "direct order",
      /** {regions} is where Amazon ships it. */
      amazonBody: "Available for readers in {regions} through Amazon.",
      buyOnAmazon: "Buy on Amazon",
      amazonPending: "The Amazon link will appear here once the book is listed.",
    },
  },

  detail: {
    /** The eyebrow above each of the three deep pages. */
    workPractice: "The Work · Practice",
    workProgramme: "The Work · Programme",
    workProject: "The Work · Project",
    backToTheWork: "Back to the work",

    iris: {
      requestDemo: "Request a demo",
      enterAccessCode: "Enter the access code",
      sectionProblem: "The problem",
      sectionBackbone: "The diagnostic backbone",
      sectionFilm: "The film",
      sectionWhatItDoes: "What it does",
      sectionArchitecture: "The architecture",
      withheldModules: "The eight modules IRIS runs are held with the film.",
      withheldArchitecture: "How IRIS is built, end to end, is held with the film.",
      openFilmFullScreen: "Open the film full screen",
      unlockTheFilm: "Unlock the film",
      filmTitle: "IRIS — the explainer film",
      soundNote: "Sound is off until you turn it on, inside the film.",
      lock: {
        eyebrow: "Access code required",
        heading: "The film, the module list and the architecture are held back.",
        body: "IRIS is not public yet. Get in touch with Saadan for the access code and the three sections open together, on this page, for a month.",
        requestTheCode: "Request the code",
        enterCode: "Enter code",
        checking: "Checking…",
        unlock: "Unlock",
        wrongCode: "That code is not right.",
        enterSomething: "Enter the access code.",
      },
    },

    icd: {
      sectionWhoFor: "Who it is for",
      sectionHowItRuns: "How it runs",
      sectionWorkingTogether: "Working together",
      bringToInstitution: "Bring this to your institution.",
      outcomes: "Outcomes",
      deliveredIn: "Delivered in",
      fromTheSessions: "From the sessions",
      galleryLabel: "ICD training",
      photographs: "Photographs",
      getInTouch: "Get in touch",
      theResearchBehindIt: "The research behind it",
    },

    recruitment: {
      sectionWhatItAnswers: "What it answers",
      sectionWorkingTogether: "Working together",
      thePipeline: "The pipeline",
      /** {stages} is the pipeline's own stage names, already joined. */
      pipelineLabel: "Recruitment pipeline: {stages}",
      /** How the stage names are joined in that sentence. */
      pipelineJoin: ", then ",
      marketIntelligence: "Market intelligence",
      movesUpOn: "A partner moves up on",
      tier: {
        status: "Status",
        relationship: "Relationship",
        incentives: "Incentives",
        meetings: "Meetings",
      },
      fromTheField: "From the field",
      galleryLabel: "recruitment work",
      scheduleConsultation: "Schedule a consultation",
      sendMessageInstead: "Send a message instead",
    },
  },

  gallery: {
    eyebrow: "Gallery",
    photographs: "Photographs",
    /** Under the stack of prints. {count} is how many there are. */
    photographCount: "{count} photographs",
    photographCountOne: "1 photograph",
    /** {name} is what the photographs are of. */
    openPhotographs: "Open photographs of {name}",
    close: "Close",
  },

  marginalia: {
    name: "The Marginalia",
    /** {found} of {total} marks. */
    foundCount: "{found} of {total} found",
    body: "Seven marks are left in the margins of this site, the way a reader annotates a book they intend to keep. Each one gives up something true.",
    readersCard: "The Reader’s Card",
    readersCardHeading: "You read the margins. Most people don’t.",
    readersCardBody: "Come into the correspondence — new research, journal entries, and news of",
    readersCardBodyAfter: ", sent rarely.",
    clear: "Clear the collection",
    /** {title} and {line} are the mark's own words. */
    markFound: "Marginalia found: {title}. {line}",
    /** {hint} is the clue shown before a mark is collected. */
    markUnfound: "A mark in the margin: {hint}",
    /** {found} of {total}, on the header counter. */
    indicator: "Marginalia: {found} of {total} found. Open the collection.",
    close: "Close",
  },

  /** Descriptions of the drawings, for anyone who cannot see them. */
  art: {
    tiers:
      "Three partner tiers, with movement upward earned on conversion, responsiveness and referral quality",
    constellation: "A constellation of research areas and papers",
    constellationHint: "Hover a node to trace a paper back through its field.",
    globe:
      "A map of the eastern hemisphere with routes from Istanbul to Germany, Qatar, the United Arab Emirates, Pakistan, Nepal and Iraq",
    branch:
      "A tree whose branches and roots mark the stages of Saadan Qasmani's work, from A and O Levels at the roots to the novel The Highest Branch at the crown",
    /** The one place name drawn into the map. */
    istanbul: "Istanbul",
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
