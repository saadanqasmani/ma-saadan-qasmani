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
  // PLACEHOLDER — awaiting the logo file. Put it at /public and name it here,
  // e.g. "/logo.svg".
  logo: null as string | null,
};

export const person = {
  name: "Saadan Qasmani",
  positioning: "Writer, Researcher, and Strategist",
  location: "Istanbul, Türkiye",
  // PLACEHOLDER — supply a portrait at /public/portrait.jpg (1200×1600 or larger)
  portrait: null as string | null,
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
      title: "STAR Scholars Presidential Medal of Service and Excellence",
      year: "2024",
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
export const profiles: readonly string[] = [];

export const highestBranch = {
  title: "The Highest Branch",
  genre: "Allegorical literary fiction, told as a fable",
  wordCount: 144000,
  chapterCount: 29,
  status: "PLACEHOLDER — publication status not yet confirmed (self-published / seeking representation / imprint / target date)",
  synopsis:
    "A boy crosses the pass at seventeen, leaving a forest he knows by its seasons for a country that measures time in semesters. What follows is a fable of arrival, the slow architecture of belonging and its costs, told across the years that turn a student into someone his own mother might not recognize.",
  subject:
    "The international student experience, tracked through a protagonist's life from adolescence through a professional and academic arc abroad.",
  coverImage: null as string | null, // PLACEHOLDER — no cover exists yet; requires artwork approval per art direction protocol
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
  "Istanbul Aydın University": "https://www.aydin.edu.tr",
};

/**
 * Where "Request a demo" should send someone. Until a booking link exists the
 * request falls back to the contact inbox, so the action always does
 * something real.
 */
export const irisDemo = {
  url: null as string | null, // PLACEHOLDER — awaiting the demo link
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
    title: "IRIS — Internationalization Management Platform",
    category: "Projects",
    summary:
      "Co-founded SaaS platform for internationalization management. PLACEHOLDER — full description pending.",
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
    definition: null as string | null, // PLACEHOLDER — awaiting definitions
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
export const blogPosts: BlogPost[] = [
  {
    slug: "welcome-to-the-journal",
    title: "Notes on Beginning an Archive",
    subtitle: "Placeholder entry",
    date: "2026-01-01",
    category: "Notes",
    tags: ["placeholder"],
    readingTime: "1 min",
    excerpt:
      "This is a placeholder journal entry demonstrating the post template. Replace with real writing.",
    coverImage: null,
    body: "This is a placeholder journal entry demonstrating the post template. Replace with real writing.",
  },
];
