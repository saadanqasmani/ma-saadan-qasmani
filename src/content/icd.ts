/**
 * Intercultural Competence Development training.
 *
 * The programme description is Saadan's own. The evidence beneath it is
 * quoted from Gültekin & Qasmani, "Structural Marginalization of
 * International Students in Turkish Universities", verbatim and with its
 * figures intact — including the caveat the paper itself makes about what a
 * cross-sectional design can and cannot show.
 */

export const icd = {
  name: "ICD",
  expansion: "Intercultural Competence Development",
  lede:
    "Training that treats intercultural competence as something an institution has, not something individuals are asked to feel.",

  /** Why the programme is shaped the way it is, in the research's terms. */
  premise: {
    heading: "A deficit, not a mood",
    quote:
      "Institutional intercultural competence is better understood as a prerequisite for inclusion than as a supplementary cultural investment.",
    source: "Gültekin & Qasmani, Structural Marginalization of International Students in Turkish Universities",
    body:
      "The study measures seven dimensions across 580 international students of 70 nationalities. The strongest association in the whole dataset is between an institution's intercultural competence deficit and the marginalization its students report. That finding is why this training exists, and why it is not delivered to students alone.",
    figures: [
      { value: "0.80", label: "r", note: "Intercultural competence deficit against marginalization — the strongest association in the dataset" },
      { value: "2.62", label: "mean", note: "Institutional intercultural competence, on a five-point scale" },
      { value: "28.4%", label: "", note: "Affirm that university leadership promotes meaningful inclusion" },
    ],
    caveat:
      "The study is cross-sectional and self-reported, so these are patterns of co-occurrence rather than proven causes. The paper says so itself.",
  },

  /** Competence is an organisational property, so the training has three audiences. */
  organisational: {
    quote:
      "This study treats intercultural competence as an organizational property: the aggregate capacity of an institution's leadership, faculty, and administrative staff to perceive and respond to cultural differences in the design and delivery of services.",
    body:
      "Leadership, faculty and staff each hold a different part of that capacity, and a workshop aimed at one of them cannot supply the others. The programme runs as three tracks, designed separately and delivered to each group in its own terms.",
  },

  audiences: [
    {
      key: "Students",
      tone: "green",
      body: "Interactive sessions on communication, adaptation, and community building.",
      outcomes: ["Cultural navigation", "Identity negotiation", "Community building"],
    },
    {
      key: "Faculty",
      tone: "blue",
      body: "Frameworks and workshops for classroom inclusivity and cross-cultural understanding.",
      outcomes: ["Inclusive pedagogy", "Cross-cultural engagement", "Student retention"],
    },
    {
      key: "Administration",
      tone: "amber",
      body: "Service delivery, cultural sensitivity, and problem-solving trainings.",
      outcomes: ["Service delivery", "Cultural sensitivity", "Problem-solving"],
    },
  ],

  /** How a programme is actually run, start to finish. */
  cycle: [
    {
      n: "01",
      name: "Diagnosis",
      body: "What the institution already has, and where the gap sits. Leadership commitment, staff communication and programme design are assessed separately, because the research finds them failing at different rates.",
    },
    {
      n: "02",
      name: "Design",
      body: "Curriculum built for the three tracks and for the institution's own context, rather than a syllabus carried in from elsewhere.",
    },
    {
      n: "03",
      name: "Delivery",
      body: "Sessions run on site or blended, in the language of instruction, with materials the institution keeps.",
    },
    {
      n: "04",
      name: "Reporting",
      body: "What changed, what did not, and what the institution should carry forward without external support.",
    },
  ],

  /** Where it has run. A subset of the countries Saadan has worked in. */
  delivered: ["Türkiye", "Pakistan", "Iraq", "Nepal", "Germany"],

  /** Why the lowest-scoring items shape the curriculum. */
  priority: {
    quote:
      "Intercultural competence must be embedded at every layer of the institution — from rectorate decision-making and resource allocation to international office staffing, faculty training, and student affairs programming.",
    body:
      "Two interventions follow most directly from the item-level results: redesigning career counselling around international graduates' distinct labour-market position, and providing support in the language of instruction. They address the two lowest-scoring items in the whole instrument.",
  },

  /**
   * Why the student structures belong here.
   *
   * The paper's tokenism construct is the argument: a festival uses students
   * as symbols, a structure they run themselves transfers authority to them.
   * The training builds the second kind.
   */
  structures: {
    heading: "Structures, not showcases",
    quote:
      "Universities mobilize international students as symbolic resources through cultural festivals, promotional photography, and marketing materials, establishing diversity credentials without altering their power dynamics or opportunity structures.",
    body:
      "In the survey, roughly 67% of students agreed they were used this way, while 35.5% agreed they benefited from it — a gap of about 31 percentage points, which is the quantity the tokenism construct is built to capture. Training alone does not close it. What closes it is standing structures that students hold office in, publish in, and answer for. Two of these were founded at Istanbul Aydın University and are part of what the programme helps an institution build.",
    items: [
      {
        name: "Model United Nations",
        media: "mun",
        line: "Founded the campus programme and launched four conferences.",
        why: "A delegate holds a position, negotiates it, and is held to it. The competence is exercised rather than described.",
      },
      {
        name: "STARLIGHT",
        media: "starlight",
        line: "Türkiye's first international student magazine.",
        why: "An editorial platform students run gives them the authorship that a promotional photograph takes.",
      },
    ],
  },

  /** What an institution or researcher can actually ask for. */
  invitations: [
    { title: "Research collaboration", body: "On intercultural competence, marginalization, or the internationalization of higher education." },
    { title: "Counselling", body: "For international students, and for the staff who support them." },
    { title: "Advisory", body: "On internationalization strategy, partnership activation, and student experience." },
    { title: "Short-term programmes", body: "Summer and winter schools, peace and diplomacy intensives, faculty and staff exchanges — concept through to reporting." },
    { title: "ICD course design", body: "Building an intercultural competence course that your institution owns and runs itself." },
  ],

  closing:
    "Institutional intercultural competence is the condition inclusion depends on. It can be measured, and it can be built.",
} as const;
