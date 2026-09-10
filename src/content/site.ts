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
  bio: `Saadan Qasmani is an internationalization professional, researcher, and novelist based in Istanbul. He is a Global Engagement and Brand Strategist and co-founded IRIS, a SaaS platform for internationalization management. His practitioner work spans recruitment, partnership management, and intercultural competence training delivered across twelve countries to participants from over seventy nationalities, including UNESCO Peace and Diplomacy Programmes, in Türkiye, Pakistan, Nepal, and Iraq. He is pursuing a master's in Political Science and International Relations at Istanbul Aydın University, where he also founded the campus Model United Nations program and STARLIGHT. His research centers on the political economy of internationalization, nation branding, and the securitization of international students.`,
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
  /** An outward link, where the work has a home of its own. */
  link?: { label: string; url: string };
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
    slug: "icd",
    title: "Intercultural Competence Development",
    category: "International Education",
    summary:
      "Training for students, faculty and administration, designed around the finding that intercultural competence is an institutional property rather than an individual one. Delivered in Türkiye, Pakistan, Iraq, Nepal and Germany.",
    date: "2022",
  },
  {
    slug: "star-scholars-global-engagement",
    title: "Global Engagement & Brand Strategy",
    category: "Global Engagement",
    summary:
      "Directing global engagement and brand strategy for a network spanning 115 countries, 2,353 universities and more than 20,000 scholars.",
    date: "2023",
    link: { label: "Visit STAR Scholars", url: "https://starscholars.org" },
  },
  {
    slug: "international-student-recruitment",
    title: "International Student Recruitment",
    category: "International Education",
    summary:
      "Recruitment across Türkiye, Pakistan, Nepal and Iraq, run on a tiered partnership framework: agents move from prospecting to high-value on consistent conversion, responsive communication and referral quality, each tier carrying its own incentives and review cycle.",
    date: "2021",
  },
  {
    slug: "unesco-peace-diplomacy",
    title: "UNESCO Peace and Diplomacy Programmes",
    category: "International Education",
    summary:
      "Short-term international programmes run under the UNESCO Chair, with intercultural competence development at their centre.",
    date: "2022",
    link: { label: "Visit the programme site", url: "https://unesco.aydin.edu.tr" },
  },
];

/**
 * People the work is credited to, and where a reader can go to read more.
 * A null profile renders as plain text rather than a dead link, so a name is
 * never a broken promise.
 */
export const collaborators: Record<
  string,
  { profile: string | null; linkedin?: string | null }
> = {
  "Dr. Osman Gültekin": {
    profile: "https://www.researchgate.net/profile/Osman-Gultekin-2",
    linkedin: "https://tr.linkedin.com/in/osmangultekin",
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

/**
 * The through-line of the archive, in Saadan's own framing. Split around the
 * name so the name itself can carry a link to his profile.
 */
export const researchNote = {
  before: "All research here is in collaboration with ",
  name: "Dr. Osman Gültekin",
  after: ", or an expansion of his work.",
};

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
  /**
   * The full byline in the order the paper itself states, Saadan included.
   * `coAuthors` drives the "with ..." line in the archive; this drives the
   * detail page and the structured data, where author order is a claim.
   */
  authors?: string[];
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
    abstract:
      "Universities across the Global South have expanded international student recruitment considerably faster than the institutional infrastructure required to support it, yet marginalization in these settings remains largely undefined and unmeasured. This study examines the multidimensional experiences of international students in Turkish universities, focusing on structural marginalization, discriminatory practices, and the gap between institutional promises and lived realities. Drawing on cross-sectional survey data from 580 international students representing 70 nationalities, the research evaluates seven thematic dimensions: marginalization, discrimination, intercultural competence, tokenism, expectation versus reality alignment (operationalized here as hope trafficking), psychological impact, and institutional trust. Results indicate weak institutional support systems, widespread stereotyping, emotional exhaustion, and social isolation. Marginalization and hope trafficking are each significantly associated with psychological stress, and intercultural competence shows the strongest association with marginalization. Drawing on Deardorff's (2006) Pyramid Model of Intercultural Competence, Gültekin's (2020a) educational soft power framework, and Pham and Tran's (2015) intercultural capital model, the paper argues that marginalization is best understood as a systemic rather than an individual failure, and introduces tokenism and hope trafficking as mid-level theoretical tools linking institutional practice to macro-political consequence. Because the design is cross-sectional and relies on self-report, the associations reported here describe patterns of co-occurrence rather than causal effects, and the two proposed frameworks require validation in other host-country contexts.",
    date: "Upcoming — submitted to JUMP",
    area: "International student experience",
    keywords: ["marginalization", "tokenism", "hope trafficking", "intercultural competence", "international higher education", "international relations"],
    authors: ["Osman Gültekin", "Muhammad Ahmed Saadan Qasmani"],
    type: "Journal article",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "ai-international-academic-relations",
    title:
      "The Role of Artificial Intelligence in International Academic Relations and the Internationalization of Higher Education Institutions",
    subtitle: "An Empirical Analysis from an Emerging Comprehensive University",
    abstract:
      "The internationalization of higher education has become a defining marker of institutional legitimacy, yet the administrative infrastructure supporting it remains remarkably underdeveloped. International offices across the Global North and Global South continue to manage complex multi-institutional relationships through email, spreadsheets, and manual approval chains, generating what this paper conceptualizes as the Internationalization Management Gap (IMG): the structural disjuncture between an institution's stated internationalization ambitions and its capacity to realize them. Drawing on qualitative data from two structured focus groups and fifteen to twenty semi-structured interviews with faculty members and international office professionals, this paper examines three questions: what barriers prevent faculty from engaging in international academic activities; what tools would meaningfully enhance that engagement; and what AI-driven institutional solutions could address these barriers systemically. The paper introduces a dual-equation framework comprising the IMG, a composite index measuring the severity of the gap across three dimensions (Information Asymmetry, Workflow Fragmentation, and Digital Infrastructure Deficit), with empirically justified equal weighting, and the Internationalization Potential Index (IPI), which measures institutional readiness to close that gap through leadership commitment and faculty readiness. There is an obvious need for automated internationalization management infrastructure within higher education institutions that is not regionally specific: it is a structural condition of twenty-first century higher education globally. The paper highlights the fact that AI-powered internationalization management systems represent the most viable structural response to IMG, and evaluates the conditions under which such systems are most likely to produce meaningful and equitable outcomes.",
    date: "In progress",
    area: "Internationalization theory",
    keywords: ["artificial intelligence", "internationalization", "international academic relations", "Internationalization Management Gap", "Internationalization Potential Index", "faculty engagement", "MOU automation", "digital infrastructure", "workflow fragmentation", "Global South", "Global North", "institutional capacity", "composite index"],
    authors: ["Osman Gültekin", "Muhammad Ahmed Saadan Qasmani"],
    type: "Working paper",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
    instrument: "img-ipi",
  },
  {
    slug: "six-eras-internationalization",
    title: "Six Eras of Internationalization in Higher Education",
    subtitle: "Infrastructure, Adaptation, and the Cost of Delay",
    abstract:
      "The history of higher education internationalization is not a story of linear progress. It is a story of discontinuous leaps; moments at which the rules of international academic engagement were fundamentally rewritten, and at which institutions that recognized the shift early built structural advantages that compounded over decades, while those that delayed were rendered progressively obsolete. Universities are, by profession, the world's experts on knowledge and change. They are, by institutional habit, among the world's most consistent late adopters of it. Drawing on a structured review and qualitative content analysis of the internationalization literature, this paper proposes a periodization of higher education internationalization into six analytically distinct eras: the Diplomatic Era (1950s–1970s); the Agreement Era (1980s–2000); the Commercialization Era (1995–2005); the Rankings Era (2004–2015); the Digital Era (2012–2023); and the AI Era (2024 onwards). Building on a staged adaptation reading of Gültekin's phase-based classification (Gültekin, 2021, 2025), infrastructure theory (Star & Ruhleder, 1996; Bowker & Star, 1999), and the internationalization literature (Knight, 2004; Kehm & Teichler, 2007), the paper introduces three original theoretical contributions: i) the Invisible Threshold: the observation that each era's defining capability was only recognized as decisive after the window for first-mover advantage had closed; ii) Paper Internationalization: the structural tendency for institutions to perform each era's capability without building it; and iii) the Leapfrog Illusion: the fallacy that institutions can skip foundational infrastructure layers and arrive at the capabilities of the current era. The paper identifies four cross-era patterns: the compounding advantage thesis, the non-recovery pattern, the acceleration of each successive era, and the era-skipping problem. It concludes with a forward-looking analysis of the AI era; including the risk that AI, if confined to academic output generation rather than management infrastructure, may entrench existing hierarchies rather than disrupt them. Era 6 is the first era whose Invisible Threshold has been named in real time. The question is whether institutions will act on it before it closes.",
    date: "Upcoming — submitted for review",
    area: "Internationalization theory",
    keywords: ["higher education internationalization", "periodization", "AI era", "international politics", "Paper Internationalization", "Leapfrog Illusion", "Invisible Threshold"],
    authors: ["Osman Gültekin", "Muhammad Ahmed Saadan Qasmani"],
    type: "Journal article",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "selling-merit",
    title: "Selling Merit",
    subtitle:
      "Scholarship Capture, Hope Trafficking, and the Architecture of Self-Congratulatory Banality in the Internationalisation of Turkish Higher Education",
    abstract:
      "Türkiye's emergence as a leading destination for international students (a roughly ninefold rise in a decade to more than 356,000 students, an estimated US$3 billion in annual revenue, and a state target of 500,000 by 2028) is narrated officially as a triumph of internationalisation and soft power. This paper documents a corruption architecture operating beneath that narrative, which it terms scholarship capture: the diversion of institutional scholarship allocations, mandated as instruments of merit, into a commercial channel in which they function as commission paid in kind to recruitment agencies and are then retailed to self-financing families as discounted tuition misdescribed as merit. Drawing on insider ethnography within the recruitment sector, a corpus of public agency advertising, and official enrolment statistics, the paper reconstructs the mechanism across three converging evidentiary scales. It advances a primary theoretical contribution: self-congratulatory banality, which is an extension of Arendt's account of administrative thoughtlessness in which the functionary is not fearful and obedient but proud and entrepreneurial, experiencing participation in harm as competence. It further argues that hope trafficking, the systematic mis-marketing of opportunity that generates the student volume which earns the scholarship reward, and the post-arrival abandonment of students into conditions of racialised marginalisation are not separate phenomena but the entry and exit wounds of a single incentive, within which the student is neither client nor beneficiary but a bearer instrument whose delivery triggers payment. The analysis is situated within academic capitalism, the sociology of corruption, and the political economy of credential systems, mobilising Marx, Weber, Durkheim, Bourdieu, Fanon, and Akerlof alongside contemporary scholarship. It concludes that the corruption has no orchestrating author; only a drift, structurally generated and ideologically pre-absolved, and proposes a registry-licensing-escrow architecture directed at the design rather than the personnel of the market.",
    date: "In progress",
    area: "International student experience",
    keywords: ["internationalisation of higher education", "corruption", "education agents", "scholarships", "Türkiye", "academic capitalism", "banality of evil", "soft power"],
    authors: ["Muhammad Ahmed Saadan Qasmani", "Osman Gültekin"],
    type: "Working paper",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "security-sovereignty-international-student",
    title: "Security, Sovereignty, and the International Student",
    subtitle: "Commercial Dependence and the Governance of Cross-Border Mobility",
    abstract:
      "States once recruited international students as instruments of influence; increasingly, they recruit them as sources of revenue. This paper argues that the commercialisation of international higher education has generated a structural security problem that the dominant soft-power framework is unable to perceive. As universities in many states have come to depend on international tuition for a substantial share of their income, frequently concentrated in students from a single, sometimes rival, state, this financial dependence has become a vulnerability of national sovereignty: a form of leverage, a source of systemic fragility, and an erosion of state control over a critical knowledge infrastructure. Drawing on the international dependency tradition and securitisation theory, this paper conceptualises the resulting dynamic as the securitisation of commercial dependence, and illustrates it through three cases (the United Kingdom, China, and Türkiye). It further argues that the influence rationale still invoked to justify open mobility rests on a causal mechanism, exposure producing affinity, whose conditions of efficacy have substantially eroded. The international student is thus positioned at the intersection of three state imperatives, revenue, influence, and security, that no longer cohere. The paper concludes that the governance of cross-border mobility has become the management of a contradiction that states created and cannot resolve.",
    date: "In progress",
    area: "Securitization of international students",
    keywords: ["securitization", "sovereignty", "cross-border mobility"],
    authors: ["M. A. Saadan Qasmani", "R. Kutay Karaca"],
    type: "Working paper",
    coAuthors: ["Ragıp Kutay Karaca"],
    access: "restricted",
  },
  {
    slug: "unesco-short-term-programmes-icd",
    title:
      "The Role of UNESCO Short-Term Programmes in Students’ Intercultural Competence Development",
    subtitle: "Evidence from the UNESCO Chair Peace and Diplomacy Programmes",
    abstract:
      "Short-term mobility programmes have become a principal mechanism through which universities extend international experience to students for whom semester-length mobility is financially or academically inaccessible. Their contribution to intercultural competence development, however, remains unevenly evidenced, and the programmes delivered under the UNESCO Chairs and UNITWIN Programme have been almost entirely absent from this literature despite training and capacity-building forming an explicit component of the Chair mandate. This study evaluates intercultural competence outcomes across [N] participants from [N] countries who took part in the UNESCO Peace and Diplomacy Programmes delivered by the UNESCO Chair on Cultural Diplomacy, Governance and Education at Istanbul Aydın University between [year] and [year]. Employing a pre-programme and post-programme design supplemented by qualitative participant accounts, the study measures change across knowledge, attitude and application dimensions of intercultural competence as specified in Deardorff's process model, and examines the contribution of the programme's Model United Nations component as an applied pedagogical element. Findings indicate [results summary]. The study establishes that short-term programmes delivered under an institutional peace and diplomacy mandate produce measurable intercultural competence gains, that the Chair structure provides a replicable and portable delivery model of demonstrated international reach, and that the integration of simulation-based practice addresses a structural limitation in how compressed programmes pursue behavioural outcomes. We argue for the expansion of this model across the UNITWIN network and for the adoption of participant-level outcome measurement as standard practice within it.",
    date: "In progress",
    area: "Intercultural competence development",
    keywords: ["intercultural competence development", "UNESCO Chairs", "UNITWIN", "short-term mobility", "Model United Nations", "peace education", "internationalisation of higher education"],
    authors: ["Osman Gültekin", "Yaren Sude Fadir", "M. A. Saadan Qasmani", "Pragya Upreti"],
    type: "Working paper",
    institution: "UNESCO",
    coAuthors: ["Dr. Osman Gültekin", "Yaren Sude Fadir", "Pragya Upreti"],
    access: "restricted",
  },
  {
    slug: "from-survival-to-contribution",
    title: "From Survival to Contribution",
    subtitle:
      "The WISDOM Programme, Displaced Women in STEM, and the Peacebuilding Function of Higher Education",
    abstract:
      "Higher education is routinely described as a route out of displacement, but the mechanism by which a scholarship becomes something more than material relief is rarely specified. This article examines the Women in Science Displacement Outreach Master's (WISDOM) Programme, a partnership between Istanbul Aydın University (IAU) and the Organization for Women in Science for the Developing World (OWSD), which has supported a cohort of displaced women in STEM master's programmes in Istanbul since September 2024. Drawing on a census survey of the full cohort (N = 13) and semi-structured interviews with [n] participants, the study uses a retrospective pre-post design to examine change across four domains: perceived structural barriers, academic self-efficacy, social and professional integration, and future orientation. Findings indicate [direction and magnitude to be inserted after analysis]. We argue that the programme's distinctive contribution is not access itself but the conversion of access into agency: participants moved from a survival horizon, in which education is instrumental to immediate security, toward a contribution horizon, in which education is instrumental to reconstruction of their countries of origin. We situate this within Türkiye's own history of absorbing displaced scholars, and argue that the 1933 University Reform offers both a precedent and a warning, since the women among those émigrés were largely written out of the record. The article maps the programme against the Sustainable Development Goals and proposes a replicable framework for gender-responsive scholarship design. Limitations arising from cohort size, self-report, and the authors' administrative relationship to the programme are addressed directly.",
    date: "In progress",
    area: "Displaced scholars, STEM access",
    keywords: ["refugee higher education", "women in STEM", "displacement", "peacebuilding", "Sustainable Development Goals", "educational diplomacy", "Türkiye"],
    authors: ["Osman Gültekin", "Muhammad Ahmed Saadan Qasmani"],
    type: "Working paper",
    coAuthors: ["Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "when-the-mou-is-the-outcome",
    title: "When the MoU Is the Outcome",
    subtitle: "Measuring Partnership Activation in Canadian and Turkish Higher Education",
    abstract:
      "Internationalization strategies in both mature and emerging higher education systems increasingly report partnership counts as evidence of global engagement. This article asks what those counts measure. Drawing on neo-institutional accounts of ceremonial conformity and decoupling, and on critiques of partnership asymmetry developed within community-engaged research, we treat the memorandum of understanding as a ceremonial instrument whose signing is frequently the terminal act rather than the initiating one. We construct a comparative dataset of announced institutional partnerships at Canadian and Turkish universities and test each against observable activation within a five-year window, measured through indexed co-authorship, recorded student and staff mobility, jointly delivered programmes, doctoral co-supervision and jointly held external funding. We introduce the partnership activation rate as a diagnostic, together with a measure of agreement half-life, and report substantial non-activation in both systems reached by different routes: legitimacy maintenance under enrolment constraint in the Canadian case, capacity substitution under a national growth target in the Turkish case. The pattern recalls the interwar proliferation of bilateral instruments whose density was mistaken for the condition they were intended to produce. We argue that partnership announcement operates as institutional performance, that it is sustained by ranking, accreditation and reporting regimes which count agreements rather than audit them, and that the reform implication is not fewer partnerships but mandatory disclosure of activation. We close by proposing a reporting standard for institutional partnership portfolios.",
    date: "In progress",
    area: "Partnership management",
    keywords: ["MoUs", "partnership activation", "Canada", "Türkiye"],
    authors: ["Alyson E. King", "Osman Gültekin", "M. A. Saadan Qasmani"],
    type: "Working paper",
    coAuthors: ["Dr. Alyson E. King", "Dr. Osman Gültekin"],
    access: "restricted",
  },
  {
    slug: "borrowed-instruments-unbuilt-systems",
    title: "Borrowed Instruments, Unbuilt Systems",
    subtitle: "Bologna Compliance and the Formalism Inheritance in Ukraine and Türkiye",
    abstract:
      "Ukraine and Turkiye are both peripheral adopters of the Bologna Process, and both display near-complete formal compliance: three-cycle structures, credit transfer, diploma supplements, qualifications frameworks and national quality assurance agencies. Both also display persistent gaps between instrument and function, including credit recognition that does not travel, learning outcomes generated retrospectively, and quality assurance that audits documentation rather than provision. This article asks why two systems with dissimilar institutional histories converge on the same pattern of hollow adoption. Drawing on policy borrowing scholarship and on the literature on trust and moral agency in educational institutions, we argue that each system carries a distinct inheritance of administrative formalism: in the Turkish case, a Tanzimat-era pattern in which the importation of European institutional form is treated as the acquisition of the institution itself; in the Ukrainian case, a post-Soviet reporting culture in which the produced record substitutes for the activity reported. Using national implementation reports, quality assurance agency documentation, legislative texts and mobility and recognition data, supplemented by expert interviews in both countries, we trace how each inheritance shapes which Bologna instruments are activated and which remain ceremonial. We introduce instrument activation as a diagnostic and formalism inheritance as an explanatory construct. We argue that the principal cost of hollow compliance is not administrative inefficiency but the erosion of institutional trust, and that this erosion is self-reinforcing: once academics and students learn to read institutional documents as performances, subsequent substantive reform arrives already discredited.",
    date: "In progress",
    area: "Political economy of internationalization",
    keywords: ["Bologna Process", "Ukraine", "Türkiye", "policy formalism"],
    authors: ["Benjamin Kutsyuruba", "Osman Gültekin", "M. A. Saadan Qasmani"],
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

// The journal, oldest entry last. Notes written here move to Supabase once
// the admin has them; until then this file is the record.
export const blogPosts: BlogPost[] = [
  {
    slug: "before-anything-else",
    title: "Before Anything Else",
    subtitle: "A prayer, the work, and why this site exists.",
    date: "10 September 2026",
    category: "Note",
    tags: ["Internationalization", "The Highest Branch", "First note"],
    readingTime: "4 min",
    excerpt:
      "The first note. Why the research, the training, and the novel had to end up in the same room, and who I am writing all of it for.",
    body: `Lord, for the ones setting out,
keep them.
For the ones who have already arrived
and still cannot say the word for home,
keep them.
And for the mothers at the windows,
counting the road:
let the counting end.

I wanted to begin there, because everything under it is only detail.

My work is with international students. For years I have stood in rooms in twelve countries, in front of people from more than seventy, running training on intercultural competence, building partnerships between institutions, and helping students get from one country to another in one piece. Some of those rooms were UNESCO Peace and Diplomacy Programmes, in Turkiye, Pakistan, Nepal and Iraq. When I am not in them I am in Istanbul, writing about the same thing from the other side: the political economy of internationalization, the way countries brand themselves through the students they attract, and how quickly a student can turn, in a government's language, from an asset into a risk.

Those two halves rarely speak to each other. The people who do this work seldom publish. The people who publish seldom sit in the rooms. I have done both, and I have never been able to write a sentence about one without the other pulling at my sleeve.

And then there is the novel.

The Highest Branch is about a boy who crosses a pass at seventeen, leaving a forest he knows by its seasons for a country that measures time in semesters. I am not going to pretend that boy is a stranger to me. He is not me, not exactly. But the crossing is mine, and so is most of what came after it: the first winter, the language that arrives long before the belonging does, the phone calls home in which everything is going well, the slow and unannounced business of becoming someone your own mother might not entirely recognise. I wrote a hundred and forty-four thousand words across twenty-nine chapters because I went looking for that book on a shelf, could not find it, and could not leave it unwritten.

For years these three things lived in three separate places. The research in journals, the training in rooms that emptied at five o'clock, the novel in a drawer. Anyone who came across one of them had no way of knowing the others were there. This site is me putting them in one room and admitting, finally, what I had been slow to admit: that they were never three projects. They were one, approached from three directions.

Who am I writing for. The student sitting in a visa queue with a folder of documents and no idea whether any of it will work. The one in a new city who has learned the word for thank you and not yet the word for lonely. The officer on the other side of the desk with forty files to get through before lunch, who does not know that each one is somebody's entire life. The colleague who has been running these programmes for a decade and has never once been asked what they learned.

What I want out of all of it is smaller than it sounds. I would like the next seventeen-year-old who crosses a pass to arrive somewhere that was expecting them. Not welcomed in a brochure. Expected. There is a difference, and everyone who has made that crossing knows exactly what it is.

Thank you for being here at the start of it.

Because up is where things fall from.

M. A. Saadan Qasmani`,
    coverImage: null,
  },
];
