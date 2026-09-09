/**
 * Central, hand-authored site content.
 * This file is the temporary content layer while the Supabase-backed CMS
 * (see /supabase/migrations) is wired up. Every field here maps to a future
 * database table/column of the same shape, so migrating is a data move,
 * not a rebuild.
 *
 * PLACEHOLDER content is explicitly marked. Nothing here is invented —
 * unconfirmed facts are left blank or flagged rather than guessed.
 */

/**
 * Brand assets that live as files rather than as drawings in the code.
 * A null value means the site falls back to a drawn placeholder; setting a
 * path here is the only change needed to swap in the real thing.
 */
export const brand = {
  /**
   * Saadan's mark, cropped to its ink and sized for the web. The master at
   * full resolution lives in /assets and is not served.
   */
  logo: "/logo.png" as string | null,
};

export const person = {
  name: "Saadan Qasmani",
  positioning: "Writer, Researcher, and Strategist",
  location: "Istanbul, Türkiye",
  /**
   * A line engraving, converted from white-on-black to the site's ink on
   * transparency: the drawing carries its tone in line density, so luminance
   * became opacity. The untouched original is in /assets.
   */
  portrait: "/portrait.png" as string | null,
  bio: `Saadan Qasmani is an internationalization professional, researcher, and novelist based in Istanbul. He directs Global Engagement and Brand Strategy at STAR Scholars Network and co-founded IRIS, a SaaS platform for internationalization management. His practitioner work spans recruitment, partnership management, and intercultural competence training delivered across twelve countries to participants from over seventy nationalities, including UNESCO Peace and Diplomacy Programmes, in Türkiye, Pakistan, Nepal, and Iraq. He is pursuing a master's in Political Science and International Relations at Istanbul Aydın University, where he also founded the campus Model United Nations program and STARLIGHT. His research centers on the political economy of internationalization, nation branding, and the securitization of international students.`,
  roles: [
    {
      title: "Director of Global Engagement & Brand Strategy",
      org: "STAR Scholars Network",
    },
    {
      title: "Co-founder",
      org: "IRIS — internationalization management SaaS platform",
    },
    {
      title: "MA Candidate, Political Science and International Relations",
      org: "Istanbul Aydın University",
    },
  ],
  practitionerNote:
    "Practitioner work in recruitment, partnership management, and intercultural competence development (ICD) training delivered across 12 countries to participants from 70+ nationalities, including UNESCO Peace and Diplomacy Programmes, in Türkiye, Pakistan, Nepal, and Iraq.",
  founded: [
    {
      name: "Model United Nations Program",
      org: "Istanbul Aydın University",
    },
    {
      name: "STARLIGHT",
      org: "Istanbul Aydın University",
    },
  ],
  honors: [
    {
      // Corrected from the plaque itself: "Award", not "Medal".
      title: "Presidential Award of Service and Excellence",
      org: "2024 STAR Global Conference, Kathmandu University, Nepal",
      year: "2024",
      /** Key into mediaSets, so the entry opens its own gallery. */
      media: "award",
    },
  ],
} as const;

/**
 * Public profiles that belong to the same person.
 *
 * Search engines use these to connect this site to an already-established
 * identity, which is the fastest route to ranking for a personal name.
 * PLACEHOLDER — add real, verified URLs only (LinkedIn, ORCID, Google
 * Scholar, ResearchGate, X). An incorrect URL here actively misleads Google,
 * so an empty list is the correct state until they are confirmed.
 */
export const profiles: readonly string[] = [
  "https://www.linkedin.com/in/m-a-saadan-qasmani-718a46216/",
  "https://www.instagram.com/saadan.x/",
];

/** Named links, for the places the site shows them rather than declares them. */
export const social = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/m-a-saadan-qasmani-718a46216/" },
  { label: "Instagram", url: "https://www.instagram.com/saadan.x/" },
] as const;

/**
 * Scheduling. Booking happens on Calendly rather than in a form here, so
 * nothing on this site holds a calendar or takes a payment.
 */
export const booking = {
  provider: "Calendly",
  url: "https://calendly.com/qasmanisaadan",
} as const;

export const highestBranch = {
  title: "The Highest Branch",
  genre: "Allegorical literary fiction, told as a fable",
  /** The line under the title on the cover, in Saadan's own words. */
  tagline: "Because up is where things fall from.",
  /** How the author is credited on the cover, which differs from the site's byline. */
  coverByline: "M. A. Saadan Qasmani",
  wordCount: 144000,
  chapterCount: 29,
  status: "Releasing 19 October 2026",
  synopsis:
    "A boy crosses the pass at seventeen, leaving a forest he knows by its seasons for a country that measures time in semesters. What follows is a fable of arrival, the slow architecture of belonging and its costs, told across the years that turn a student into someone his own mother might not recognize.",
  subject:
    "The international student experience, tracked through a protagonist's life from adolescence through a professional and academic arc abroad.",
  coverImage: "/book-cover.png" as string | null,
  purchase: {
    amazon: {
      url: null as string | null, // PLACEHOLDER — awaiting real Amazon link
      regions: "European Union & the Americas",
    },
    direct: {
      regions: "Türkiye & Pakistan",
      note: "Direct order — payment details are sent manually after review, never automatically.",
    },
  },
} as const;

/**
 * Organisations that have a public home worth sending a reader to. Same rule
 * as collaborators: a null entry renders as plain text, never a dead link.
 */
export const orgLinks: Record<string, string | null> = {
  "STAR Scholars Network": "https://starscholars.org",
  // A path rather than a URL: IRIS has a page on this site, so the role links
  // inward instead of off to somewhere else.
  "IRIS — internationalization management SaaS platform": "/work/iris",
  "Istanbul Aydın University": "https://www.aydin.edu.tr",
};

/**
 * Where "Request a demo" should send someone. Until a booking link exists the
 * request falls back to the contact inbox, so the action always does
 * something real.
 */
export const irisDemo = {
  url: null as string | null, // PLACEHOLDER — awaiting the demo link
  /**
   * A self-contained animated explainer. It is a full-bleed film with its
   * own transport controls, so it opens in its own tab rather than being
   * squeezed into a modal.
   */
  explainer: "/iris-explainer.html",
};

export type WorkCategory =
  | "Academic"
  | "Research"
  | "Publications"
  | "International Education"
  | "Global Engagement"
  | "Strategy"
  | "Writing"
  | "Creative Work"
  | "Projects";

export type WorkItem = {
  slug: string;
  title: string;
  category: WorkCategory;
  summary: string;
  date: string; // ISO — approximate where exact date unknown
};

export const workItems: WorkItem[] = [
  {
    slug: "iris",
    title: "IRIS — International Relations Intelligent System",
    category: "Projects",
    summary:
      "Co-founded with EduYork. Internationalization, transformed from an administrative process into a strategic, measurable, data-driven function, on the IMG and IPI econometric frameworks.",
    date: "2024",
  },
  {
    slug: "international-student-recruitment",
    title: "International Student Recruitment",
    category: "International Education",
    summary:
      "Recruitment practice across Türkiye, Pakistan, Nepal, and Iraq. PLACEHOLDER — full description pending.",
    date: "2021",
  },
  {
    slug: "star-scholars-global-engagement",
    title: "Global Engagement & Brand Strategy",
    category: "Global Engagement",
    summary:
      "Directs global engagement and brand strategy at STAR Scholars Network. PLACEHOLDER — full description pending.",
    date: "2023",
  },
  {
    slug: "unesco-peace-diplomacy",
    title: "UNESCO Peace and Diplomacy Programmes",
    category: "International Education",
    summary:
      "Intercultural competence development (ICD) training delivered in Türkiye, Pakistan, Nepal, and Iraq. PLACEHOLDER — full description pending.",
    date: "2022",
  },
  {
    slug: "mun-spotlight",
    title: "Model United Nations Program & STARLIGHT",
    category: "Projects",
    summary:
      "Founded both at Istanbul Aydın University. PLACEHOLDER — full description pending.",
    date: "2021",
  },
];

/**
 * People the work is credited to, and where a reader can go to read more.
 * A null profile renders as plain text rather than a dead link, so a name is
 * never a broken promise.
 */
export const collaborators: Record<string, { profile: string | null }> = {
  "Dr. Osman Gültekin": {
    profile: "https://www.researchgate.net/profile/Osman-Gultekin-2",
  },
};

/**
 * Instruments a reader can ask to use. The definition is shown verbatim in a
 * tooltip; it stays null until Saadan supplies the wording, because guessing
 * at what a measure means is exactly the kind of invention this site avoids.
 */
export const instruments = {
  "img-ipi": {
    label: "IMG & IPI calculator",
    // Taken from the IRIS explainer rather than written here.
    definition:
      "Two econometric instruments (Gültekin & Qasmani). IMG measures the size of an institution's internationalization management gap, from information asymmetry, workflow fragmentation and digital infrastructure deficit. IPI measures the capacity to close that gap, from leadership commitment and faculty readiness. Read together they place an institution in one of four profiles." as string | null,
  },
} as const;

/** The through-line of the archive, in Saadan's own framing. */
export const researchNote =
  "All research here is in collaboration with Dr. Osman Gültekin, or an expansion of his work.";

export type ResearchAccess = "open" | "restricted";

export type ResearchItem = {
  slug: string;
  title: string;
  /** The part after the colon. Kept separate so listings can set it smaller. */
  subtitle?: string;
  abstract: string;
  date: string;
  area: string;
  keywords: string[];
  type: string;
  coAuthors?: string[];
  institution?: string;
  doiOrLink?: string | null;
  access: ResearchAccess;
  /**
   * Marks a paper that ships an instrument readers can ask to use. Currently
   * only the IMG and IPI calculator.
   */
  instrument?: "img-ipi";
};

export const researchItems: ResearchItem[] = [
  {
    slug: "structural-marginalization-turkish-universities",
    title: "Structural Marginalization of International Students in Turkish Universities",
    subtitle: "Tokenism and Hope Trafficking as Mechanisms of Institutional Failure",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "Upcoming — submitted to JUMP",
    area: "International student experience",
    keywords: ["marginalization", "tokenism", "hope trafficking", "Türkiye"],
    type: "Journal article",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "ai-international-academic-relations",
    title:
      "The Role of Artificial Intelligence in International Academic Relations and the Internationalization of Higher Education Institutions",
    subtitle: "An Empirical Analysis from an Emerging Comprehensive University",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Internationalization theory",
    keywords: ["artificial intelligence", "academic relations", "internationalization"],
    type: "Working paper",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
    instrument: "img-ipi",
  },
  {
    slug: "six-eras-internationalization",
    title: "Six Eras of Internationalization in Higher Education",
    subtitle: "Infrastructure, Adaptation, and the Cost of Delay",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "Upcoming — submitted for review",
    area: "Internationalization theory",
    keywords: ["periodization", "infrastructure", "higher education"],
    type: "Journal article",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "selling-merit",
    title: "Selling Merit",
    subtitle:
      "Scholarship Capture, Hope Trafficking, and the Architecture of Self-Congratulatory Banality in the Internationalisation of Turkish Higher Education",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "International student experience",
    keywords: ["merit", "scholarships", "hope trafficking", "Türkiye"],
    type: "Working paper",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "security-sovereignty-international-student",
    title: "Security, Sovereignty, and the International Student",
    subtitle: "Commercial Dependence and the Governance of Cross-Border Mobility",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Securitization of international students",
    keywords: ["securitization", "sovereignty", "cross-border mobility"],
    type: "Working paper",
    coAuthors: ["Ragıp Kutay Karaca"],
    access: "restricted",
  },
  {
    slug: "unesco-short-term-programmes-icd",
    title:
      "The Role of UNESCO Short-Term Programmes in Students’ Intercultural Competence Development",
    subtitle: "Evidence from the UNESCO Chair Peace and Diplomacy Programmes",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Intercultural competence development",
    keywords: ["UNESCO", "peace and diplomacy", "intercultural competence"],
    type: "Working paper",
    institution: "UNESCO",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "from-survival-to-contribution",
    title: "From Survival to Contribution",
    subtitle:
      "The WISDOM Programme, Displaced Women in STEM, and the Peacebuilding Function of Higher Education",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Displaced scholars, STEM access",
    keywords: ["WISDOM", "displaced scholars", "women in STEM", "peacebuilding"],
    type: "Working paper",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "when-the-mou-is-the-outcome",
    title: "When the MoU Is the Outcome",
    subtitle: "Measuring Partnership Activation in Canadian and Turkish Higher Education",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Partnership management",
    keywords: ["MoUs", "partnership activation", "Canada", "Türkiye"],
    type: "Working paper",
    coAuthors: ["Dr. Alyson E. King", "Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "borrowed-instruments-unbuilt-systems",
    title: "Borrowed Instruments, Unbuilt Systems",
    subtitle: "Bologna Compliance and the Formalism Inheritance in Ukraine and Türkiye",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Political economy of internationalization",
    keywords: ["Bologna Process", "Ukraine", "Türkiye", "policy formalism"],
    type: "Working paper",
    coAuthors: ["Dr. Benjamin Kutsyuruba", "Dr. Osman Gültekin"],
    access: "restricted",
  },
];

export type Publication = {
  slug: string;
  title: string;
  kind: "Book" | "Article" | "Essay" | "Research Paper" | "Other";
  summary: string;
  date: string;
  externalLink?: string | null;
};

// PLACEHOLDER — no confirmed publications on record beyond the research
// listed above and The Highest Branch (treated separately as the
// flagship literary work). Populate as work is actually published.
export const publications: Publication[] = [];

export type BlogPost = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
  excerpt: string;
  body: string;
  coverImage?: string | null;
};

// PLACEHOLDER — no blog posts on record yet. This entry demonstrates the
// content model only and should be replaced or removed.
export const blogPosts: BlogPost[] = [];
