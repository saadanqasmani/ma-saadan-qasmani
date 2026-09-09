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

  /**
   * How a market is chosen.
   *
   * The three groups are the ones the sector reads in this order: whether a
   * market sends students at all, whether it sends them to you, and whether
   * those applications survive the journey to enrolment. Written from
   * published practice (British Council market intelligence, ICEF Monitor,
   * AIRC), not from any one institution's internal numbers.
   */
  intelligence: {
    heading: "A market is a decision, not a destination.",
    body:
      "Most recruitment failure is a targeting failure that happened months before anyone processed an application. A market is read on three questions before it is entered, and left when it stops answering them, whatever the volume looks like.",
    groups: [
      {
        n: "01",
        name: "Does it send students",
        line: "Demand fundamentals, read before anything else.",
        signals: [
          "Youth population and middle-class growth",
          "Whether domestic provision can absorb its own demand",
          "Affordability against household income, and the exchange rate",
          "Economic and geopolitical pressure to leave",
        ],
      },
      {
        n: "02",
        name: "Does it send them here",
        line: "Fit, which decides whether interest becomes an application.",
        signals: [
          "Programme match against what the market actually wants to study",
          "Tuition and living cost against what a family can carry",
          "Graduate outcomes and post-study work rights",
          "Diaspora, safety, language of instruction",
          "Competitor share and how saturated the agent network already is",
        ],
      },
      {
        n: "03",
        name: "Does it convert",
        line: "Deliverability, and the part most portfolios never measure.",
        signals: [
          "Visa approval rate for that nationality, not the national average",
          "Document integrity, and the verification burden it creates",
          "Offer to enrolment yield, by market and by programme",
          "Cost per enrolment against the tuition it returns",
          "Retention past the first year",
        ],
      },
    ],
    risk:
      "One market above roughly a third of intake is a concentration risk, not a strength: a visa rule, a currency move or a policy change in a single capital can take a year's plan with it. The portfolio is managed for spread as deliberately as it is for volume.",
  },

  cta: {
    heading: "Bring this to your institution.",
    body:
      "Consultation on recruitment strategy, partner network design, agent tiering and onboarding, or an audit of what your current network is actually delivering.",
  },
} as const;
