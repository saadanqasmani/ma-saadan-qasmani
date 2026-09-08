/**
 * IRIS, as described in Saadan's own explainer film.
 *
 * Every line here is taken from that film rather than written for the site.
 * The mock dashboard figures it shows (a fictional "University A" with 148
 * partnerships and so on) are deliberately excluded: they are illustrative
 * interface data, not claims about real institutions, and repeating them as
 * prose would turn a demo into an assertion.
 */

export const iris = {
  name: "IRIS",
  /** As it is credited on the product site. */
  by: "EduYork",
  expansion: "International Relations Intelligent System",
  lede:
    "Internationalization, transformed from an administrative process into a strategic, measurable, data-driven function.",

  problem: {
    heading: "Universities have globalized.",
    counter: "Their management systems haven't.",
    /** Sector figures as the film states them. */
    figures: [
      { value: "3–6", unit: "months", note: "to sign a single MOU" },
      { value: "5–10", unit: "staff", note: "touch every agreement" },
      { value: "1 in 4", unit: "", note: "partnership conversations abandoned" },
    ],
    frictions: [
      "fragmented strategy",
      "reactive decisions",
      "unstructured mobility",
      "administrative overload",
      "no measurable intelligence",
    ],
    close: "Managed by intuition. Not by intelligence.",
    turn: "What if you could measure it?",
  },

  instruments: {
    heading: "It starts with two econometric instruments.",
    attribution: "IMG · IPI — Gültekin & Qasmani",
    img: {
      key: "IMG",
      role: "The size of the gap.",
      formula: "IMG = ( IA + WF + DID ) / 3",
      parts: [
        {
          key: "IA",
          name: "Information asymmetry",
          items: [
            "days to present partner candidates",
            "search platforms in active use",
            "documented discovery process",
          ],
        },
        {
          key: "WF",
          name: "Workflow fragmentation",
          items: [
            "approval departments per MOU",
            "days from request to signature",
            "abandonment rate",
          ],
        },
        {
          key: "DID",
          name: "Digital infrastructure deficit",
          items: [
            "purpose-built software",
            "centralised records",
            "tracking, integration, dashboards",
          ],
        },
      ],
    },
    ipi: {
      key: "IPI",
      role: "The capacity to close it.",
      formula: "IPI = [ ( LC + RF ) / 2 ] × ( 1 − IMG )",
      parts: [
        {
          key: "LC",
          name: "Leadership commitment",
          items: [
            "signed internationalization strategy",
            "dedicated IR office (1+ FTE)",
            "dedicated budget line",
          ],
        },
        {
          key: "RF",
          name: "Faculty readiness",
          items: [
            "digital comfort",
            "AI familiarity",
            "trust in AI recommendations",
            "likelihood of regular use",
          ],
        },
      ],
    },
    close: "Measured — not guessed.",
  },

  /** Read IMG and IPI together. */
  profiles: {
    heading: "Four institutional profiles",
    note: "Read IMG × IPI together.",
    items: [
      { condition: "High gap · High capacity", action: "Deploy now" },
      { condition: "Low gap · High capacity", action: "Advance & benchmark" },
      { condition: "High gap · Low capacity", action: "Governance first" },
      { condition: "Low gap · Low capacity", action: "Build readiness" },
    ],
  },

  chain: ["Research", "Measurement", "Intelligence", "Action"],

  modules: [
    { n: "01", name: "Dashboard", line: "Every internationalization signal." },
    { n: "02", name: "Health Index", line: "Institutional internationalization health, computed from IMG and IPI." },
    { n: "03", name: "Partner Discovery", line: "Candidates found and ranked, not hunted." },
    { n: "04", name: "Partnerships", line: "The portfolio, and how much of it is actually working." },
    { n: "05", name: "Analytics", line: "From historical trends to strategic forecasts." },
    { n: "06", name: "Mobility", line: "Every student journey, planned with data." },
    { n: "07", name: "MOU Management", line: "No agreement expires unnoticed." },
    { n: "08", name: "Recruitment", line: "From inquiry to enrollment, measured end to end." },
    { n: "09", name: "Documents", line: "Ask the archive." },
  ],

  engine: {
    heading: "Not a database. An intelligence system.",
    inputs: ["Institutional", "Mobility", "Partnership", "Recruitment"],
    core: ["IMG framework", "IPI framework", "Research library", "AI reasoning"],
    outputs: ["Analytics", "Recommendations", "Decision support", "Executive reporting"],
    close: "Every output traces back to a measured input — and to the science behind it.",
    library:
      "Grounded in the IRIS research library: peer-reviewed papers and official guidelines stored in IRIS's own data library, so every answer is scientifically backed.",
  },

  closing: "IRIS transforms internationalization from fragmented administration into measurable institutional intelligence.",
  credit: "Built on the IMG · IPI econometric frameworks — Gültekin & Qasmani",
} as const;
