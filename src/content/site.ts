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

export const person = {
  name: "Saadan Qasmani",
  positioning: "Writer, Researcher, and Strategist",
  location: "Istanbul, Türkiye",
  // PLACEHOLDER — supply a portrait at /public/portrait.jpg (1200×1600 or larger)
  portrait: null as string | null,
  bio: `Saadan Qasmani is an internationalization professional, researcher, and novelist based in Istanbul. He directs Global Engagement and Brand Strategy at STAR Scholars Network and co-founded IRIS, a SaaS platform for internationalization management. His practitioner work spans recruitment, partnership management, and intercultural competence training delivered across twelve countries to participants from over seventy nationalities, including UNESCO Peace and Diplomacy Programmes in Istanbul, Kathmandu, and Baghdad. He is pursuing a master's in Political Science and International Relations at Istanbul Aydın University, where he also founded the campus Model United Nations program and Spotlight Magazine. His research centers on the political economy of internationalization, nation branding, and the securitization of international students.`,
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
    "Practitioner work in recruitment, partnership management, and intercultural competence development (ICD) training delivered across 12+ countries to participants from 70+ nationalities, including UNESCO Peace and Diplomacy Programmes in Istanbul, Kathmandu, and Baghdad.",
  founded: [
    {
      name: "Model United Nations Program",
      org: "Istanbul Aydın University",
    },
    {
      name: "Spotlight Magazine",
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
      "Intercultural competence development (ICD) training delivered in Istanbul, Kathmandu, and Baghdad. PLACEHOLDER — full description pending.",
    date: "2022",
  },
  {
    slug: "mun-spotlight",
    title: "Model United Nations Program & Spotlight Magazine",
    category: "Projects",
    summary:
      "Founded both at Istanbul Aydın University. PLACEHOLDER — full description pending.",
    date: "2021",
  },
];

export type ResearchAccess = "open" | "restricted";

export type ResearchItem = {
  slug: string;
  title: string;
  abstract: string;
  date: string;
  area: string;
  keywords: string[];
  type: string;
  coAuthors?: string[];
  institution?: string;
  doiOrLink?: string | null;
  access: ResearchAccess;
};

export const researchItems: ResearchItem[] = [
  {
    slug: "bologna-instrument-adoption",
    title:
      "Bologna Without Substance: Instrument Adoption in Ukraine–Türkiye Higher Education Cooperation",
    abstract:
      "PLACEHOLDER — abstract pending. Co-authored with Benjamin Kutsyuruba.",
    date: "In progress",
    area: "Political economy of internationalization",
    keywords: ["Bologna Process", "Ukraine", "Türkiye", "higher education policy"],
    type: "Working paper",
    coAuthors: ["Benjamin Kutsyuruba"],
    access: "restricted",
  },
  {
    slug: "mou-activation-canada-turkiye",
    title: "Partnership Theatre: MoU Activation Between Canada and Türkiye",
    abstract: "PLACEHOLDER — abstract pending. Co-authored with Alyson King.",
    date: "In progress",
    area: "Partnership management",
    keywords: ["MoUs", "Canada", "Türkiye", "internationalization"],
    type: "Working paper",
    coAuthors: ["Alyson King"],
    access: "restricted",
  },
  {
    slug: "marginalization-n580",
    title: "Marginalization Among International Students (n = 580)",
    abstract:
      "PLACEHOLDER — abstract pending. Resubmitted to JUMP. First paper of a corruption trilogy.",
    date: "Resubmitted",
    area: "International student experience",
    keywords: ["marginalization", "international students", "corruption"],
    type: "Journal article — resubmitted to JUMP",
    access: "restricted",
  },
  {
    slug: "selling-merit",
    title: "Selling Merit",
    abstract:
      "PLACEHOLDER — abstract pending. Third paper of the corruption trilogy.",
    date: "In progress",
    area: "International student experience",
    keywords: ["merit", "recruitment", "corruption"],
    type: "Working paper",
    access: "restricted",
  },
  {
    slug: "six-eras",
    title: "Six Eras",
    abstract:
      "PLACEHOLDER — abstract pending. Theoretical paper, in preparation for Frontiers in Education.",
    date: "In preparation",
    area: "Internationalization theory",
    keywords: ["internationalization", "higher education", "periodization"],
    type: "Theoretical paper — in prep for Frontiers in Education",
    access: "restricted",
  },
  {
    slug: "security-sovereignty-international-student",
    title: "Security, Sovereignty, and the International Student",
    abstract:
      "PLACEHOLDER — abstract pending. Co-authored with Ragıp Kutay Karaca.",
    date: "In progress",
    area: "Securitization of international students",
    keywords: ["securitization", "sovereignty", "international students"],
    type: "Working paper",
    coAuthors: ["Ragıp Kutay Karaca"],
    access: "restricted",
  },
  {
    slug: "unesco-icd-peace-diplomacy",
    title: "Intercultural Competence Development in UNESCO Peace and Diplomacy Programmes",
    abstract: "PLACEHOLDER — abstract pending.",
    date: "In progress",
    area: "Intercultural competence development",
    keywords: ["UNESCO", "peace and diplomacy", "ICD"],
    type: "Working paper",
    institution: "UNESCO",
    access: "restricted",
  },
  {
    slug: "wisdom-programme-displaced-women-stem",
    title: "The WISDOM Programme: Displaced Women in STEM",
    abstract:
      "PLACEHOLDER — abstract pending. Istanbul Aydın University × OWSD.",
    date: "In progress",
    area: "Displaced scholars, STEM access",
    keywords: ["WISDOM", "displaced women", "STEM", "OWSD"],
    type: "Working paper",
    institution: "Istanbul Aydın University × OWSD",
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
