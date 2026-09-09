/**
 * International student recruitment.
 *
 * The framework is Saadan's own practice. The case for running it this way is
 * quoted from Gültekin & Qasmani, where recruitment ethics is measured rather
 * than asserted, with the paper's own caveat kept.
 */

export const recruitment = {
  name: "Recruitment",
  expansion: "International student recruitment",
  lede:
    "A partner network run as a tiered relationship rather than a commission list, because the alternative is measurable and it is measured.",

  problem: {
    quote:
      "Hope trafficking refers to the systematic promotion of international education to prospective students, particularly those from contexts of limited socioeconomic opportunity, through narratives of opportunity that the institution knows, or should know, will not be delivered.",
    source: "Gültekin & Qasmani, Structural Marginalization of International Students in Turkish Universities",
    figures: [
      { value: "18.4%", note: "Agreed that agencies gave them realistic expectations" },
      { value: "51.1%", note: "Agreed they had been misled before enrolment" },
      { value: "0.66", label: "r", note: "Breached recruitment promises against psychological harm — the strongest association in the dataset" },
    ],
    body:
      "Fewer than one student in five found their agency's account of the offer realistic. That is what a network managed as a commission list produces, and it is why the partners in this one are managed as relationships with a standard to meet.",
    caveat:
      "Cross-sectional and self-reported, so these are patterns of co-occurrence rather than proven causes.",
  },

  /** The pipeline, named without figures: it is a process, not a claim. */
  pipeline: ["Enquiry", "Application", "Offer", "Enrolment", "Arrival"],

  framework: {
    heading: "Three tiers, one ladder",
    body:
      "Every partner sits in a tier, and the tier decides the commission, the contact and the review cycle. Movement between them is earned on evidence rather than on volume alone.",
  },

  tiers: [
    {
      n: "Tier 1",
      name: "High-value partners",
      status: "Proven, consistent pipeline",
      relationship: "Direct, personal communication",
      incentives: "Highest commission, exclusive offers",
      meetings: "Quarterly strategy reviews",
    },
    {
      n: "Tier 2",
      name: "Developing partners",
      status: "Growing, moderate output",
      relationship: "Regular check-ins, training",
      incentives: "Standard commission, bonus targets",
      meetings: "Bi-annual review",
    },
    {
      n: "Tier 3",
      name: "New & prospecting",
      status: "Newly onboarded or low activity",
      relationship: "Initial outreach, orientation",
      incentives: "Entry commission, trial period",
      meetings: "Initial onboarding session",
    },
  ],

  progression: ["Consistent conversion", "Responsive communication", "Quality referrals"],

  markets: ["Türkiye", "Pakistan", "Nepal", "Iraq"],

  cta: {
    heading: "Bring this to your institution.",
    body:
      "Consultation on recruitment strategy, partner network design, agent tiering and onboarding, or an audit of what your current network is actually delivering.",
  },
} as const;
