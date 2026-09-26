/**
 * The careers, and what actually leads to each one.
 *
 * THE RULE FOR THIS FILE, the same one the rest of the data follows: nothing
 * in here may be a number somebody would act on unless it carries a source.
 * So there are no salaries, no employment rates, no "fastest growing field"
 * claims and no rankings. Those are exactly the figures a careers site
 * invents, a parent repeats, and a student builds a decade on.
 *
 * What is here instead is the part that does not need a citation and is the
 * part students are actually missing: what the work is when you do it, which
 * degrees lead to it, which school subjects you must already be taking,
 * where the licensing gates are, and what usually goes wrong. A seventeen
 * year old who wants to be a doctor rarely knows that the physics they
 * dropped last year has closed the door, and nobody told them.
 *
 * Durations are given as the range that is common across the countries this
 * site covers, and are labelled as varying, because they genuinely do.
 */

export type Family =
  | "health"
  | "engineering"
  | "computing"
  | "business"
  | "law"
  | "design"
  | "social"
  | "science"
  | "creative";

export const FAMILIES: { id: Family; label: string }[] = [
  { id: "health", label: "Medicine and health" },
  { id: "engineering", label: "Engineering" },
  { id: "computing", label: "Computing, data and AI" },
  { id: "business", label: "Business, finance and economics" },
  { id: "law", label: "Law and policy" },
  { id: "design", label: "Architecture and design" },
  { id: "social", label: "Social sciences and education" },
  { id: "science", label: "Natural sciences and maths" },
  { id: "creative", label: "Arts, media and writing" },
];

/**
 * The seven reasoning strengths the assessment asks about.
 *
 * Self-rated, and treated as such everywhere: this is a student's own
 * reading of themselves, not a measured aptitude, and the interface never
 * calls it one.
 */
export type Aptitude =
  | "numerical"
  | "verbal"
  | "logical"
  | "analytical"
  | "spatial"
  | "abstract"
  | "practical";

export const APTITUDES: { id: Aptitude; label: string; asked: string }[] = [
  { id: "numerical", label: "Numbers", asked: "Working with figures, calculations and quantities." },
  { id: "verbal", label: "Words", asked: "Reading closely, writing clearly, arguing a case." },
  { id: "logical", label: "Logic", asked: "Following a chain of reasoning and spotting where it breaks." },
  { id: "analytical", label: "Analysis", asked: "Taking a messy problem apart to find what is really going on." },
  { id: "spatial", label: "Space and shape", asked: "Picturing objects, plans and how things fit together." },
  { id: "abstract", label: "Abstraction", asked: "Working with ideas and patterns that have no picture." },
  { id: "practical", label: "Hands on", asked: "Building, fixing and making things work in the real world." },
];

/** How someone wants to spend their working day. */
export type Pref =
  | "people"
  | "independent"
  | "research"
  | "creative"
  | "leadership"
  | "hands-on"
  | "structured"
  | "outdoors";

export const PREFS: { id: Pref; label: string }[] = [
  { id: "people", label: "With people all day" },
  { id: "independent", label: "Mostly on my own" },
  { id: "research", label: "Digging into a question for months" },
  { id: "creative", label: "Making something that did not exist" },
  { id: "leadership", label: "Running things and deciding" },
  { id: "hands-on", label: "Physically making or fixing" },
  { id: "structured", label: "Clear rules and a known routine" },
  { id: "outdoors", label: "Not at a desk" },
];

/**
 * School subjects, in the forms this site's students actually study them.
 * Deliberately coarse: the point is whether a door is open, not which board.
 */
export const SUBJECTS = [
  "Mathematics",
  "Further Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "Business Studies",
  "Accounting",
  "Psychology",
  "Sociology",
  "History",
  "Geography",
  "Literature",
  "Languages",
  "Art and Design",
  "Statistics",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export type Career = {
  id: string;
  name: string;
  family: Family;
  /** What the work is on an ordinary day, not what a brochure says. */
  work: string;
  /** Degrees that lead here. The first is the most direct. */
  degrees: string[];
  /** Subjects a student must already be taking. A closed door if missing. */
  required: Subject[];
  /** Subjects that help and are commonly expected, but are not a gate. */
  helpful: Subject[];
  /** The reasoning strengths the work leans on hardest. */
  strengths: Aptitude[];
  /** The working days this suits. */
  prefs: Pref[];
  /** Undergraduate length, commonly, across the countries here. */
  years: string;
  /** What comes after the first degree, where it is usual or required. */
  after: string;
  /** Registration, licensing or accreditation gates, where they exist. */
  licence: string | null;
  /** The thing people find out too late. Always present, never a warning off. */
  reality: string;
};

export const CAREERS: Career[] = [
  /* ---- health ---------------------------------------------------------- */
  {
    id: "medicine",
    name: "Medicine",
    family: "health",
    work: "Diagnosing and treating patients, most of it in hospitals and clinics, much of it on shift patterns that include nights and weekends for years after you qualify.",
    degrees: ["MBBS or MD", "Medicine (graduate entry)"],
    required: ["Biology", "Chemistry"],
    helpful: ["Physics", "Mathematics"],
    strengths: ["analytical", "logical", "verbal"],
    prefs: ["people", "structured", "research"],
    years: "5 to 6 years, varying by country",
    after: "Foundation or house job, then specialty training that commonly runs several more years.",
    licence:
      "Practice is licensed in every country here, and a degree earned in one country is not automatically accepted in another. Check recognition before you choose where to study, not after.",
    reality:
      "The degree is the short part. Counting specialty training, this is usually a decade before you are independent, and the countries where it is cheapest to study are often the hardest to convert into practice elsewhere.",
  },
  {
    id: "dentistry",
    name: "Dentistry",
    family: "health",
    work: "Clinical work on teeth and jaws, largely with your hands, in a room with one patient at a time, often in your own practice later on.",
    degrees: ["BDS or DDS", "Dentistry"],
    required: ["Biology", "Chemistry"],
    helpful: ["Physics"],
    strengths: ["practical", "spatial", "analytical"],
    prefs: ["people", "hands-on", "structured"],
    years: "5 to 6 years, varying by country",
    after: "Vocational training, then optional specialty routes such as orthodontics.",
    licence: "Licensed, and recognition across countries is limited. Check before choosing a country.",
    reality:
      "Manual precision matters here more than in most of medicine. People who like biology but dislike fine handwork are often happier elsewhere in health.",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    family: "health",
    work: "Medicines: how they work, how they interact, and making sure the right person gets the right one. In community pharmacy, hospital, industry or regulation.",
    degrees: ["Pharmacy (PharmD or BPharm)", "Pharmaceutical Sciences"],
    required: ["Chemistry", "Biology"],
    helpful: ["Mathematics", "Physics"],
    strengths: ["analytical", "numerical", "logical"],
    prefs: ["people", "structured", "research"],
    years: "4 to 6 years, varying by country",
    after: "Registration and pre-registration practice, then optional clinical or industry specialisation.",
    licence: "Registration is required to dispense, and is country-specific.",
    reality:
      "The industry and regulatory side of pharmacy is large and much less visible to students than the shop counter, and it looks nothing like it.",
  },
  {
    id: "nursing",
    name: "Nursing",
    family: "health",
    work: "The continuous care of patients: assessment, treatment, medication, and being the person who is actually there when something changes.",
    degrees: ["Nursing (BSc)", "Midwifery"],
    required: ["Biology"],
    helpful: ["Chemistry", "Psychology"],
    strengths: ["practical", "analytical", "verbal"],
    prefs: ["people", "hands-on", "structured"],
    years: "3 to 4 years",
    after: "Registration, then specialisation such as intensive care, paediatrics or nurse practitioner routes.",
    licence: "Registered profession in every country here, with its own language and practice requirements.",
    reality:
      "One of the few health routes where qualified people are recruited internationally, which cuts both ways: mobility is real, and so is the shift work.",
  },
  {
    id: "physiotherapy",
    name: "Physiotherapy",
    family: "health",
    work: "Restoring movement after injury, surgery or illness, through assessment and hands-on treatment, usually one patient at a time over weeks.",
    degrees: ["Physiotherapy (BSc or DPT)"],
    required: ["Biology"],
    helpful: ["Physics", "Chemistry"],
    strengths: ["practical", "analytical", "spatial"],
    prefs: ["people", "hands-on"],
    years: "4 to 5 years",
    after: "Registration, then specialisation such as sports, neurological or paediatric practice.",
    licence: "Registered in most countries here.",
    reality: "Physically demanding work, and the pay ceiling is lower than in medicine or dentistry.",
  },
  {
    id: "public-health",
    name: "Public health and epidemiology",
    family: "health",
    work: "Health at the level of populations rather than patients: why a disease spreads, which policy stops it, and what the data can and cannot show.",
    degrees: ["Public Health", "Biomedical Sciences", "Statistics"],
    required: ["Biology"],
    helpful: ["Mathematics", "Statistics", "Chemistry", "Geography"],
    strengths: ["analytical", "numerical", "verbal"],
    prefs: ["research", "people", "independent"],
    years: "3 to 4 years",
    after: "A master's is close to standard here, and is where most people actually specialise.",
    licence: null,
    reality:
      "Much of this field is statistics wearing a biology coat. If numbers put you off, this will not be what you hoped.",
  },

  /* ---- engineering ------------------------------------------------------ */
  {
    id: "mechanical-engineering",
    name: "Mechanical engineering",
    family: "engineering",
    work: "Designing and testing things that move or carry load: engines, machines, structures, manufacturing lines. A mix of modelling on screen and checking on site.",
    degrees: ["Mechanical Engineering", "Manufacturing Engineering", "Mechatronics"],
    required: ["Mathematics", "Physics"],
    helpful: ["Further Mathematics", "Computer Science", "Art and Design"],
    strengths: ["numerical", "spatial", "practical"],
    prefs: ["hands-on", "structured", "creative"],
    years: "4 years, or 3 plus a master's in much of Europe",
    after: "Chartered or professional engineer status, which usually needs documented years of practice.",
    licence:
      "Calling yourself an engineer is protected in some countries and not others. Where it is protected, accreditation of your degree matters a great deal.",
    reality:
      "Far more computation and documentation than the word suggests. The romantic image of building things by hand is mostly the technician's job, not the engineer's.",
  },
  {
    id: "electrical-engineering",
    name: "Electrical and electronic engineering",
    family: "engineering",
    work: "Power, circuits, signals and control: from national grids down to the electronics inside a phone.",
    degrees: ["Electrical Engineering", "Electronic Engineering", "Mechatronics"],
    required: ["Mathematics", "Physics"],
    helpful: ["Further Mathematics", "Computer Science"],
    strengths: ["numerical", "abstract", "logical"],
    prefs: ["structured", "independent", "hands-on"],
    years: "4 years, or 3 plus a master's in much of Europe",
    after: "Professional registration, and often a master's for specialised work.",
    licence: "Accreditation of the degree matters where the title is protected.",
    reality:
      "The most mathematically abstract of the classical engineering routes. Signals and control are closer to pure maths than to wiring.",
  },
  {
    id: "civil-engineering",
    name: "Civil and structural engineering",
    family: "engineering",
    work: "Buildings, bridges, water, roads and the ground under them. Office design work punctuated by site visits, and answerable to codes and inspectors.",
    degrees: ["Civil Engineering", "Structural Engineering", "Environmental Engineering"],
    required: ["Mathematics", "Physics"],
    helpful: ["Geography", "Further Mathematics"],
    strengths: ["numerical", "spatial", "practical"],
    prefs: ["outdoors", "structured", "leadership"],
    years: "4 years, or 3 plus a master's in much of Europe",
    after: "Chartered status through documented practice, which is what unlocks senior responsibility.",
    licence:
      "Signing off structures is legally restricted almost everywhere. Licensing is national and rarely transfers without examination.",
    reality:
      "The work is tied to where the construction is, so it is one of the less internationally portable engineering routes despite being one of the most needed.",
  },
  {
    id: "chemical-engineering",
    name: "Chemical and process engineering",
    family: "engineering",
    work: "Turning a reaction that works in a flask into a plant that runs it by the tonne, safely and economically. Energy, pharmaceuticals, food, materials.",
    degrees: ["Chemical Engineering", "Process Engineering"],
    required: ["Mathematics", "Chemistry", "Physics"],
    helpful: ["Further Mathematics"],
    strengths: ["numerical", "analytical", "abstract"],
    prefs: ["structured", "research", "hands-on"],
    years: "4 years, or 3 plus a master's in much of Europe",
    after: "Professional registration; industry-specific specialisation is common.",
    licence: "Accreditation matters for professional status.",
    reality:
      "Traditionally tied to oil, gas and heavy industry, which means both the opportunities and the ethics of the field are shifting under it.",
  },
  {
    id: "aerospace-engineering",
    name: "Aerospace engineering",
    family: "engineering",
    work: "Aircraft and spacecraft: aerodynamics, propulsion, structures and control, most of it modelling and testing long before anything flies.",
    degrees: ["Aerospace Engineering", "Aeronautical Engineering", "Mechanical Engineering"],
    required: ["Mathematics", "Physics"],
    helpful: ["Further Mathematics", "Computer Science"],
    strengths: ["numerical", "abstract", "spatial"],
    prefs: ["structured", "research", "independent"],
    years: "4 years, or 3 plus a master's in much of Europe",
    after: "A master's is common, and much of the field expects it.",
    licence: null,
    reality:
      "A significant share of the industry is defence work, and much of it requires citizenship or security clearance in the country where it sits. That closes doors that a degree cannot open.",
  },
  {
    id: "biomedical-engineering",
    name: "Biomedical engineering",
    family: "engineering",
    work: "Engineering applied to the body: implants, imaging machines, prosthetics, diagnostic devices. Between the hospital and the workshop.",
    degrees: ["Biomedical Engineering", "Mechanical Engineering", "Electrical Engineering"],
    required: ["Mathematics", "Physics"],
    helpful: ["Biology", "Chemistry", "Computer Science"],
    strengths: ["analytical", "numerical", "practical"],
    prefs: ["research", "hands-on", "people"],
    years: "4 years, or 3 plus a master's in much of Europe",
    after: "Usually a master's, and research roles expect a doctorate.",
    licence: "Medical devices are heavily regulated, which shapes the work more than most students expect.",
    reality:
      "A broad degree that can leave you less immediately employable than a classical engineering one. Many employers hire a mechanical or electrical engineer and teach them the biology.",
  },

  /* ---- computing -------------------------------------------------------- */
  {
    id: "software-engineering",
    name: "Software engineering",
    family: "computing",
    work: "Building and maintaining systems other people depend on. Much of it is reading existing code, finding out why something breaks, and agreeing with colleagues what to build.",
    degrees: ["Computer Science", "Software Engineering", "Information Technology"],
    required: ["Mathematics"],
    helpful: ["Computer Science", "Further Mathematics", "Physics"],
    strengths: ["logical", "abstract", "analytical"],
    prefs: ["independent", "creative", "structured"],
    years: "3 to 4 years",
    after: "Nothing formal is required. What is valued is work you can show.",
    licence: null,
    reality:
      "The one field here where what you have built matters as much as where you studied, and one of the few that can be done remotely across borders. It is also the most crowded at entry level.",
  },
  {
    id: "data-science",
    name: "Data science and machine learning",
    family: "computing",
    work: "Turning data into something a decision can rest on: cleaning it, modelling it, and being honest about what it does not show. Far more of the first than students expect.",
    degrees: ["Computer Science", "Data Science", "Statistics", "Mathematics"],
    required: ["Mathematics"],
    helpful: ["Further Mathematics", "Statistics", "Computer Science", "Physics"],
    strengths: ["numerical", "analytical", "abstract"],
    prefs: ["research", "independent", "structured"],
    years: "3 to 4 years",
    after: "A master's is common, and research roles in machine learning usually expect a doctorate.",
    licence: null,
    reality:
      "The mathematics is the barrier, not the programming. Linear algebra, probability and statistics are the actual entry requirement whatever the course is called.",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    family: "computing",
    work: "Finding weaknesses before someone else does, and building systems that survive being attacked. Split between defensive operations and testing.",
    degrees: ["Cybersecurity", "Computer Science", "Network Engineering"],
    required: ["Mathematics"],
    helpful: ["Computer Science", "Further Mathematics"],
    strengths: ["logical", "analytical", "abstract"],
    prefs: ["independent", "structured", "research"],
    years: "3 to 4 years",
    after: "Industry certifications carry real weight here, sometimes more than a further degree.",
    licence: null,
    reality:
      "Much of the serious work requires clearance and is therefore tied to citizenship. Study a general computer science degree first if you want to keep your options open.",
  },

  /* ---- business --------------------------------------------------------- */
  {
    id: "accounting",
    name: "Accounting and audit",
    family: "business",
    work: "Making sure the numbers a company reports are true, and explaining what they mean. Structured, deadline-driven, and the same cycle every year.",
    degrees: ["Accounting", "Accounting and Finance", "Business Administration"],
    required: ["Mathematics"],
    helpful: ["Accounting", "Economics", "Business Studies", "Statistics"],
    strengths: ["numerical", "logical", "analytical"],
    prefs: ["structured", "people", "independent"],
    years: "3 to 4 years",
    after: "A professional qualification such as ACCA, CA or CPA is what actually opens the profession.",
    licence:
      "Signing an audit is legally restricted to qualified accountants. The professional exams, not the degree, are the gate.",
    reality:
      "One of the most internationally portable qualifications on this list, because the professional bodies have mutual recognition arrangements that degrees do not.",
  },
  {
    id: "finance",
    name: "Finance and investment",
    family: "business",
    work: "Deciding where money goes and what it is worth: valuation, risk, markets and capital. Long hours early on, and highly cyclical.",
    degrees: ["Finance", "Economics", "Accounting and Finance", "Mathematics"],
    required: ["Mathematics"],
    helpful: ["Economics", "Further Mathematics", "Statistics", "Accounting"],
    strengths: ["numerical", "analytical", "logical"],
    prefs: ["structured", "leadership", "independent"],
    years: "3 to 4 years",
    after: "CFA is the common professional route; some paths expect a master's.",
    licence: "Advising clients or trading is regulated almost everywhere and requires registration.",
    reality:
      "Entry is unusually dependent on which university you attended and where it sits relative to the financial centre you want to work in. This is one of the few fields where that is honestly true.",
  },
  {
    id: "economics",
    name: "Economics",
    family: "business",
    work: "Explaining why people, firms and governments behave as they do, mostly through models and data. Policy, central banks, consultancies and research.",
    degrees: ["Economics", "Economics and Mathematics", "Philosophy, Politics and Economics"],
    required: ["Mathematics"],
    helpful: ["Economics", "Further Mathematics", "Statistics", "History"],
    strengths: ["analytical", "numerical", "abstract"],
    prefs: ["research", "independent", "structured"],
    years: "3 to 4 years",
    after: "A master's is close to standard for professional economist roles, and research needs a doctorate.",
    licence: null,
    reality:
      "University economics is far more mathematical than school economics. Students who chose it for the debates are often surprised by the algebra.",
  },
  {
    id: "management",
    name: "Management and entrepreneurship",
    family: "business",
    work: "Running an organisation or part of one: people, money, priorities and the decisions nobody else will make.",
    degrees: ["Business Administration", "Management", "International Business"],
    required: [],
    helpful: ["Business Studies", "Economics", "Mathematics", "Psychology"],
    strengths: ["verbal", "analytical", "practical"],
    prefs: ["leadership", "people", "creative"],
    years: "3 to 4 years",
    after: "An MBA is usual, but it is worth most after several years of work rather than straight after a first degree.",
    licence: null,
    reality:
      "The least gated route here, which cuts both ways: a general business degree distinguishes you from nobody, so what you do alongside it carries the weight.",
  },
  {
    id: "marketing",
    name: "Marketing and brand",
    family: "business",
    work: "Understanding why people choose one thing over another, and building the thing that reaches them. Half creative, half measurement.",
    degrees: ["Marketing", "Business Administration", "Communications"],
    required: [],
    helpful: ["Business Studies", "Psychology", "Statistics", "Art and Design"],
    strengths: ["verbal", "analytical", "practical"],
    prefs: ["creative", "people", "leadership"],
    years: "3 to 4 years",
    after: "Nothing formal. A portfolio of campaigns you actually ran is the currency.",
    licence: null,
    reality:
      "Modern marketing is much more analytical than the word suggests, and the roles that pay are usually the ones that measure rather than the ones that design.",
  },

  /* ---- law -------------------------------------------------------------- */
  {
    id: "law",
    name: "Law",
    family: "law",
    work: "Reading a great deal, writing precisely, and arguing a position. Corporate, criminal, human rights, or in-house, and they look nothing like one another.",
    degrees: ["LLB or Law", "Law with a second subject"],
    required: [],
    helpful: ["History", "Literature", "Economics", "Sociology"],
    strengths: ["verbal", "logical", "analytical"],
    prefs: ["people", "structured", "independent"],
    years: "3 to 5 years, varying by country",
    after: "A bar course, training contract or equivalent is required to practise, and it is competitive.",
    licence:
      "Law is national. A degree in one country's law rarely qualifies you to practise in another without conversion examinations. This is the single most important thing to check before choosing where to study law.",
    reality:
      "The volume of reading is the part people underestimate, and the qualification stage after the degree is often harder to get than the degree was.",
  },
  {
    id: "international-relations",
    name: "International relations and policy",
    family: "law",
    work: "How states, organisations and institutions deal with one another. Diplomacy, development, research institutes, international organisations.",
    degrees: ["International Relations", "Political Science", "Public Policy"],
    required: [],
    helpful: ["History", "Geography", "Economics", "Languages", "Sociology"],
    strengths: ["verbal", "analytical", "abstract"],
    prefs: ["research", "people", "leadership"],
    years: "3 to 4 years",
    after: "A master's is near standard in this field, and language competence matters as much as the degree.",
    licence:
      "Diplomatic service in most countries requires citizenship and a competitive national examination.",
    reality:
      "A field where the entry routes are narrow and largely national, so plan the language and the country early rather than after graduating.",
  },

  /* ---- design ----------------------------------------------------------- */
  {
    id: "architecture",
    name: "Architecture",
    family: "design",
    work: "Designing buildings and the spaces between them, then carrying the design through regulation, budget and construction, which is most of the job.",
    degrees: ["Architecture (BArch)", "Architectural Studies"],
    required: [],
    helpful: ["Art and Design", "Mathematics", "Physics", "History"],
    strengths: ["spatial", "practical", "analytical"],
    prefs: ["creative", "structured", "hands-on"],
    years: "5 years, commonly, with a licensing period after",
    after: "Registration requires documented practice and professional examinations in most countries.",
    licence:
      "The title architect is legally protected almost everywhere, and registration is national. A portfolio is usually required for admission to the degree itself.",
    reality:
      "One of the longest routes to being licensed on this list, and the hours during the degree are notorious. Ask to see a studio at midnight before committing.",
  },
  {
    id: "product-design",
    name: "Industrial and product design",
    family: "design",
    work: "Designing objects that get manufactured: how they work, how they feel in the hand, and how they can be made at a price.",
    degrees: ["Industrial Design", "Product Design", "Design Engineering"],
    required: [],
    helpful: ["Art and Design", "Physics", "Mathematics"],
    strengths: ["spatial", "practical", "abstract"],
    prefs: ["creative", "hands-on", "independent"],
    years: "3 to 4 years",
    after: "Nothing formal. The portfolio is the qualification.",
    licence: null,
    reality:
      "Admission usually depends on a portfolio, so start building one at least a year before you apply. A strong portfolio outweighs grades at many schools.",
  },
  {
    id: "graphic-design",
    name: "Graphic and digital design",
    family: "design",
    work: "Making information and identity visible: type, layout, interface and brand, mostly to a brief and mostly to a deadline.",
    degrees: ["Graphic Design", "Visual Communication", "Interaction Design"],
    required: [],
    helpful: ["Art and Design", "Computer Science"],
    strengths: ["spatial", "verbal", "practical"],
    prefs: ["creative", "independent", "people"],
    years: "3 to 4 years",
    after: "Nothing formal. The portfolio is the qualification.",
    licence: null,
    reality:
      "Portfolio admission again, and a field where freelancing is common early, which means learning to price your own work is part of the job.",
  },

  /* ---- social ----------------------------------------------------------- */
  {
    id: "psychology",
    name: "Psychology",
    family: "social",
    work: "How people think and behave, studied through evidence. Clinical practice, research, organisations, or education, and they diverge sharply after the first degree.",
    degrees: ["Psychology (BSc)", "Cognitive Science"],
    required: [],
    helpful: ["Biology", "Mathematics", "Statistics", "Psychology", "Sociology"],
    strengths: ["analytical", "verbal", "numerical"],
    prefs: ["people", "research", "independent"],
    years: "3 to 4 years",
    after: "Clinical practice requires a doctorate or an equivalent supervised route, and entry to it is highly competitive.",
    licence:
      "Calling yourself a psychologist is protected in most countries here, and the first degree alone does not get you there.",
    reality:
      "The degree is a science degree with a lot of statistics in it. The path from it to being a practising clinical psychologist is long and much narrower than the number of students suggests.",
  },
  {
    id: "education",
    name: "Teaching and education",
    family: "social",
    work: "Teaching, and everything around it: planning, assessment, and the pastoral work that is most of the day in practice.",
    degrees: ["Education", "Subject degree plus teaching qualification"],
    required: [],
    helpful: ["Psychology", "Literature", "Mathematics", "Languages"],
    strengths: ["verbal", "practical", "analytical"],
    prefs: ["people", "structured", "leadership"],
    years: "3 to 4 years, plus a teaching qualification where separate",
    after: "A teaching qualification and registration, which in many countries is a separate year.",
    licence:
      "Teaching in a state school is a registered profession nearly everywhere, and registration is national.",
    reality:
      "One of the clearest routes to a visa in several countries with teacher shortages, and one of the least advertised to international students.",
  },
  {
    id: "sociology",
    name: "Sociology and anthropology",
    family: "social",
    work: "How societies and groups work, studied through fieldwork and data. Research, policy, development, and the non-profit sector.",
    degrees: ["Sociology", "Anthropology", "Social Policy"],
    required: [],
    helpful: ["Sociology", "History", "Geography", "Statistics"],
    strengths: ["verbal", "analytical", "abstract"],
    prefs: ["research", "people", "independent"],
    years: "3 to 4 years",
    after: "A master's is usual for research and policy roles.",
    licence: null,
    reality:
      "A degree that teaches you to think rather than to do one job, which is a real strength and a real difficulty when explaining yourself to a first employer.",
  },

  /* ---- science ---------------------------------------------------------- */
  {
    id: "physics",
    name: "Physics",
    family: "science",
    work: "Describing how the physical world behaves, mathematically. Research, but also finance, computing and engineering, which recruit physicists heavily.",
    degrees: ["Physics", "Applied Physics", "Astrophysics"],
    required: ["Mathematics", "Physics"],
    helpful: ["Further Mathematics", "Computer Science"],
    strengths: ["abstract", "numerical", "logical"],
    prefs: ["research", "independent", "structured"],
    years: "3 to 4 years, commonly an integrated master's",
    after: "Research requires a doctorate. Most physics graduates do not become physicists, and that is normal rather than a failure.",
    licence: null,
    reality:
      "A degree that is respected far outside its own field precisely because it is hard. If you want the physics itself, plan on a doctorate.",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    family: "science",
    work: "What substances are and what they do together, largely in a laboratory. Pharmaceuticals, materials, energy, food and forensics.",
    degrees: ["Chemistry", "Biochemistry", "Chemical Engineering"],
    required: ["Chemistry", "Mathematics"],
    helpful: ["Physics", "Biology"],
    strengths: ["analytical", "practical", "numerical"],
    prefs: ["research", "hands-on", "structured"],
    years: "3 to 4 years, commonly an integrated master's",
    after: "Industrial research generally expects a doctorate.",
    licence: null,
    reality:
      "Laboratory work is a large share of the week, and people who liked chemistry on paper do not always like it at the bench.",
  },
  {
    id: "biotechnology",
    name: "Biology and biotechnology",
    family: "science",
    work: "Living systems and what can be engineered from them: medicine, agriculture, environment and industry.",
    degrees: ["Biotechnology", "Biological Sciences", "Biochemistry", "Genetics"],
    required: ["Biology", "Chemistry"],
    helpful: ["Mathematics", "Physics", "Statistics"],
    strengths: ["analytical", "practical", "abstract"],
    prefs: ["research", "hands-on", "independent"],
    years: "3 to 4 years",
    after: "A master's or doctorate for research; regulatory and commercial roles need neither.",
    licence: null,
    reality:
      "Heavily regulated and slow-moving in practice, and the interesting jobs cluster around a small number of research hubs.",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    family: "science",
    work: "Proof, structure and abstraction, and then applying them anywhere: cryptography, finance, modelling, research, teaching.",
    degrees: ["Mathematics", "Mathematics and Statistics", "Applied Mathematics"],
    required: ["Mathematics"],
    helpful: ["Further Mathematics", "Physics", "Computer Science", "Statistics"],
    strengths: ["abstract", "logical", "numerical"],
    prefs: ["independent", "research", "structured"],
    years: "3 to 4 years",
    after: "A doctorate for research; everything else takes mathematicians straight from the first degree.",
    licence: null,
    reality:
      "University mathematics is about proof rather than calculation, which is a different activity from school mathematics and catches people out in the first term.",
  },
  {
    id: "environmental-science",
    name: "Environmental science and climate",
    family: "science",
    work: "Measuring and modelling natural systems and human effects on them, between fieldwork, laboratory and data.",
    degrees: ["Environmental Science", "Earth Sciences", "Climate Science", "Geography (BSc)"],
    required: [],
    helpful: ["Biology", "Chemistry", "Geography", "Mathematics", "Statistics"],
    strengths: ["analytical", "practical", "numerical"],
    prefs: ["outdoors", "research", "independent"],
    years: "3 to 4 years",
    after: "A master's is common for consultancy and policy roles.",
    licence: null,
    reality:
      "A field where the funding and therefore the jobs depend heavily on government policy, which changes with elections.",
  },

  /* ---- creative --------------------------------------------------------- */
  {
    id: "journalism",
    name: "Journalism and media",
    family: "creative",
    work: "Finding out what happened and telling people, accurately and on a deadline, in whatever medium the story needs.",
    degrees: ["Journalism", "Media and Communications", "Politics or any strong subject degree"],
    required: [],
    helpful: ["Literature", "History", "Languages", "Sociology"],
    strengths: ["verbal", "analytical", "practical"],
    prefs: ["people", "creative", "outdoors"],
    years: "3 to 4 years",
    after: "Nothing formal. Published work is the qualification.",
    licence: null,
    reality:
      "Many working journalists did not study journalism; they studied something worth writing about. Consider the subject degree route seriously.",
  },
  {
    id: "film",
    name: "Film and screen production",
    family: "creative",
    work: "Making things people watch, in crews, to budgets. Long irregular hours and long stretches between projects, especially early.",
    degrees: ["Film Production", "Media Production", "Animation"],
    required: [],
    helpful: ["Art and Design", "Literature"],
    strengths: ["spatial", "verbal", "practical"],
    prefs: ["creative", "hands-on", "people"],
    years: "3 to 4 years",
    after: "Nothing formal. Credits and a showreel are the qualification.",
    licence: null,
    reality:
      "Income is irregular for years, which is a financial fact to plan around rather than a reason not to do it. Film school is worth most for the crew you leave with.",
  },
  {
    id: "writing",
    name: "Writing and publishing",
    family: "creative",
    work: "Producing and shaping text for readers: authorship, editing, publishing, or writing inside other industries.",
    degrees: ["English Literature", "Creative Writing", "Publishing"],
    required: [],
    helpful: ["Literature", "History", "Languages"],
    strengths: ["verbal", "abstract", "analytical"],
    prefs: ["independent", "creative", "research"],
    years: "3 to 4 years",
    after: "Nothing formal. Publication is the qualification.",
    licence: null,
    reality:
      "Very few people support themselves on authorship alone, and most who write for a living do it inside another industry. That is not a lesser version of the work.",
  },
];

export function careerById(id: string): Career | undefined {
  return CAREERS.find((c) => c.id === id);
}

export function careersInFamily(family: Family): Career[] {
  return CAREERS.filter((c) => c.family === family);
}

export const totalCareers = CAREERS.length;
