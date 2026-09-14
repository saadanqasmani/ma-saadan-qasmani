/**
 * The destinations, twelve countries wide.
 *
 * WHAT IS IN HERE AND WHAT IS NOT. Names and cities: these are long-standing
 * institutions and stating where Heidelberg is carries no risk. Entry
 * requirements, fees and deadlines: not here, because those change yearly,
 * differ by programme, and are the numbers a family would actually act on.
 * They arrive per university, each with its own source and date, and until
 * then every card says so rather than showing a plausible blank.
 *
 * The selection is drawn from the QS World University Rankings 2026, which
 * is a defensible basis and not the only one. No per-university rank is
 * claimed here, because a rank asserted without the row in front of you is
 * exactly the kind of small invention that costs trust.
 *
 * Belgium has nine. There are not twelve universities in Belgium, and
 * padding the list with business schools to reach a round number would be
 * the first lie on the site.
 */

/** Anything factual carries where it came from and when. No exceptions. */
export type Sourced<T> = {
  value: T;
  source: string;
  url: string;
  asOf: string;
  /** True when read off the institution's own page, not an aggregator. */
  verified: boolean;
  note?: string;
};

export type Deadline = {
  label: string;
  opens?: string;
  closes: string;
};

export type University = {
  id: string;
  name: string;
  city: string;
  /** Undergraduate, per year, for an international student. */
  tuition: Sourced<{ low: number; high?: number; currency: string }> | null;
  applicationFee: Sourced<{ amount: number; currency: string }> | null;
  deadlines: Sourced<Deadline[]> | null;
  requirements: Sourced<string[]> | null;
  /**
   * The published minimum a student is measured against, as a percentage,
   * where the institution states one. This is what lets a university sort
   * itself into dream, likely or safe against a real result rather than a
   * guess. Null means we cannot sort it yet and will not pretend to.
   */
  minimumPercent: Sourced<number> | null;
  /** A published SAT floor, where the university states one. */
  satMin: Sourced<number> | null;
};

export const SELECTION_SOURCE = {
  label: "QS World University Rankings 2026",
  url: "https://www.topuniversities.com/world-university-rankings/2026",
  asOf: "2026-09-14",
  note: "Used to choose which institutions to list. No individual rank is asserted.",
};

function u(name: string, city: string, detail: Partial<University> = {}): University {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    city,
    tuition: null,
    applicationFee: null,
    deadlines: null,
    requirements: null,
    minimumPercent: null,
    satMin: null,
    ...detail,
  };
}

const KOC = "https://international.ku.edu.tr/undergraduate-programs/tuition-and-scholarships/";
const KOC_APPLY = "https://international.ku.edu.tr/undergraduate-programs/how-to-apply/";
const SAB = "https://iro.sabanciuniv.edu/en/tuition-fee";
const SAB_APPLY = "https://iro.sabanciuniv.edu/en/application-requirements";
const BIL = "https://w3.bilkent.edu.tr/bilkent/international-and-other-students-tuition-fees/";
const BIL_APPLY = "https://w3.bilkent.edu.tr/international/how-to-apply/";
const READ = "2026-09-14";

export const universities: Record<string, University[]> = {
  US: [
    u("Massachusetts Institute of Technology", "Cambridge, MA"),
    u("Stanford University", "Stanford, CA"),
    u("Harvard University", "Cambridge, MA"),
    u("California Institute of Technology", "Pasadena, CA"),
    u("University of California, Berkeley", "Berkeley, CA"),
    u("Princeton University", "Princeton, NJ"),
    u("Yale University", "New Haven, CT"),
    u("University of Chicago", "Chicago, IL"),
    u("Columbia University", "New York, NY"),
    u("Cornell University", "Ithaca, NY"),
    u("University of Pennsylvania", "Philadelphia, PA"),
    u("Johns Hopkins University", "Baltimore, MD"),
  ],
  AU: [
    u("University of Melbourne", "Melbourne"),
    u("University of Sydney", "Sydney"),
    u("UNSW Sydney", "Sydney"),
    u("Australian National University", "Canberra"),
    u("Monash University", "Melbourne"),
    u("University of Queensland", "Brisbane"),
    u("University of Western Australia", "Perth"),
    u("University of Adelaide", "Adelaide"),
    u("University of Technology Sydney", "Sydney"),
    u("Macquarie University", "Sydney"),
    u("RMIT University", "Melbourne"),
    u("Queensland University of Technology", "Brisbane"),
  ],
  CA: [
    u("University of Toronto", "Toronto"),
    u("McGill University", "Montreal"),
    u("University of British Columbia", "Vancouver"),
    u("University of Alberta", "Edmonton"),
    u("University of Waterloo", "Waterloo"),
    u("Université de Montréal", "Montreal"),
    u("McMaster University", "Hamilton"),
    u("Western University", "London, Ontario"),
    u("University of Ottawa", "Ottawa"),
    u("University of Calgary", "Calgary"),
    u("Queen's University", "Kingston"),
    u("Dalhousie University", "Halifax"),
  ],
  DE: [
    u("Technical University of Munich", "Munich"),
    u("Ludwig Maximilian University of Munich", "Munich"),
    u("Heidelberg University", "Heidelberg"),
    u("Karlsruhe Institute of Technology", "Karlsruhe"),
    u("Humboldt University of Berlin", "Berlin"),
    u("Free University of Berlin", "Berlin"),
    u("RWTH Aachen University", "Aachen"),
    u("Technical University of Berlin", "Berlin"),
    u("University of Freiburg", "Freiburg"),
    u("University of Tübingen", "Tübingen"),
    u("University of Bonn", "Bonn"),
    u("University of Hamburg", "Hamburg"),
  ],
  FR: [
    u("Paris Sciences et Lettres", "Paris"),
    u("Institut Polytechnique de Paris", "Palaiseau"),
    u("Sorbonne University", "Paris"),
    u("Université Paris-Saclay", "Gif-sur-Yvette"),
    u("École Normale Supérieure de Lyon", "Lyon"),
    u("Sciences Po", "Paris"),
    u("Université Paris Cité", "Paris"),
    u("Université Grenoble Alpes", "Grenoble"),
    u("Aix-Marseille Université", "Marseille"),
    u("Université de Strasbourg", "Strasbourg"),
    u("Université de Montpellier", "Montpellier"),
    u("INSA Lyon", "Lyon"),
  ],
  IT: [
    u("Politecnico di Milano", "Milan"),
    u("University of Bologna", "Bologna"),
    u("Sapienza University of Rome", "Rome"),
    u("University of Padua", "Padua"),
    u("University of Milan", "Milan"),
    u("Politecnico di Torino", "Turin"),
    u("University of Naples Federico II", "Naples"),
    u("University of Pisa", "Pisa"),
    u("University of Turin", "Turin"),
    u("University of Florence", "Florence"),
    u("Vita-Salute San Raffaele University", "Milan"),
    u("University of Trento", "Trento"),
  ],
  ES: [
    u("Universitat de Barcelona", "Barcelona"),
    u("Universidad Autónoma de Madrid", "Madrid"),
    u("Universitat Autònoma de Barcelona", "Barcelona"),
    u("Universidad Complutense de Madrid", "Madrid"),
    u("Universitat Politècnica de Catalunya", "Barcelona"),
    u("Universidad de Navarra", "Pamplona"),
    u("Universitat Pompeu Fabra", "Barcelona"),
    u("Universitat Politècnica de València", "Valencia"),
    u("Universidad Carlos III de Madrid", "Madrid"),
    u("Universidad de Granada", "Granada"),
    u("Universitat de València", "Valencia"),
    u("Universidad Politécnica de Madrid", "Madrid"),
  ],
  BE: [
    u("KU Leuven", "Leuven"),
    u("Ghent University", "Ghent"),
    u("UCLouvain", "Louvain-la-Neuve"),
    u("Université Libre de Bruxelles", "Brussels"),
    u("University of Antwerp", "Antwerp"),
    u("Vrije Universiteit Brussel", "Brussels"),
    u("University of Liège", "Liège"),
    u("Hasselt University", "Hasselt"),
    u("University of Namur", "Namur"),
  ],
  TR: [
    u("Koç University", "Istanbul", {
      tuition: {
        value: { low: 38000, currency: "USD" },
        source: "Koç University, Tuition and Scholarships",
        url: KOC,
        asOf: READ,
        verified: true,
        note: "Per year, undergraduate. Koç awards substantial scholarships to international applicants; the sticker price is rarely what a funded student pays.",
      },
      deadlines: {
        value: [
          { label: "Early", opens: "2026-01-01", closes: "2026-03-01" },
          { label: "Regular", opens: "2026-03-02", closes: "2026-05-31" },
          { label: "Late", opens: "2026-06-01", closes: "2026-07-15" },
        ],
        source: "Koç University, How to Apply",
        url: KOC_APPLY,
        asOf: READ,
        verified: true,
        note: "For Fall 2026 entry. Applying early is not only about the deadline: scholarship money is finite.",
      },
      requirements: {
        value: [
          "High school diploma, or proof you are in your final year",
          "An accepted exam result. SAT is the most common from international applicants",
          "SAT scores sent directly by College Board, institution code 1931",
          "Proof of English proficiency",
        ],
        source: "Koç University, International Students",
        url: KOC_APPLY,
        asOf: READ,
        verified: true,
      },
    }),
    u("Sabancı University", "Istanbul", {
      tuition: {
        value: { low: 36500, currency: "USD" },
        source: "Sabancı University International Relations Office",
        url: SAB,
        asOf: READ,
        verified: true,
        note: "Per year, undergraduate, international rate.",
      },
      applicationFee: {
        value: { amount: 30, currency: "USD" },
        source: "Sabancı University, Application Requirements",
        url: SAB_APPLY,
        asOf: READ,
        verified: true,
        note: "The application is not valid until this is paid.",
      },
      deadlines: {
        value: [{ label: "Undergraduate", opens: "2025-12-15", closes: "2026-08-28" }],
        source: "Sabancı University, Application Requirements",
        url: SAB_APPLY,
        asOf: READ,
        verified: true,
      },
      requirements: {
        value: [
          "High school diploma or final-year enrolment",
          "SAT accepted but not compulsory; minimum 1100 of 1600 where submitted",
          "Other national and international exams accepted in place of SAT",
          "Proof of English proficiency",
          "USD 30 application fee",
        ],
        source: "Sabancı University, Application Requirements",
        url: SAB_APPLY,
        asOf: READ,
        verified: true,
      },
      satMin: {
        value: 1100,
        source: "Sabancı University, Application Requirements",
        url: SAB_APPLY,
        asOf: READ,
        verified: true,
        note: "Where a SAT is submitted. It is not compulsory; other exams are accepted.",
      },
    }),
    u("Middle East Technical University", "Ankara"),
    u("Boğaziçi University", "Istanbul"),
    u("Istanbul Technical University", "Istanbul"),
    u("Bilkent University", "Ankara", {
      tuition: {
        value: { low: 18400, currency: "USD" },
        source: "Bilkent University, Tuition Fees for International Students",
        url: BIL,
        asOf: READ,
        verified: true,
        note: "For students admitted in 2026, academic year 2026-27. Bilkent charges by year of admission, so the figure holds for your cohort.",
      },
      applicationFee: {
        value: { amount: 30, currency: "USD" },
        source: "Bilkent University, How to Apply",
        url: BIL_APPLY,
        asOf: READ,
        verified: true,
      },
      deadlines: {
        value: [{ label: "Fall 2026-27", opens: "2026-02-02", closes: "2026-07-12" }],
        source: "Bilkent University, How to Apply",
        url: BIL_APPLY,
        asOf: READ,
        verified: true,
      },
      requirements: {
        value: [
          "High school diploma or final-year enrolment",
          "SAT, digital or paper: minimum 1000 of 1600 across Maths and Critical Reading",
          "Proof of English proficiency",
          "USD 30 application fee",
        ],
        source: "Bilkent University, How to Apply",
        url: BIL_APPLY,
        asOf: READ,
        verified: true,
      },
      satMin: {
        value: 1000,
        source: "Bilkent University, How to Apply",
        url: BIL_APPLY,
        asOf: READ,
        verified: true,
        note: "Across Maths and Critical Reading.",
      },
    }),
    u("Hacettepe University", "Ankara"),
    u("Istanbul University", "Istanbul"),
    u("Ankara University", "Ankara"),
    u("Ege University", "Izmir"),
    u("Yıldız Technical University", "Istanbul"),
    u("Gazi University", "Ankara"),
  ],
  CN: [
    u("Peking University", "Beijing"),
    u("Tsinghua University", "Beijing"),
    u("Fudan University", "Shanghai"),
    u("Shanghai Jiao Tong University", "Shanghai"),
    u("Zhejiang University", "Hangzhou"),
    u("University of Science and Technology of China", "Hefei"),
    u("Nanjing University", "Nanjing"),
    u("Wuhan University", "Wuhan"),
    u("Harbin Institute of Technology", "Harbin"),
    u("Sun Yat-sen University", "Guangzhou"),
    u("Tongji University", "Shanghai"),
    u("Beijing Institute of Technology", "Beijing"),
  ],
  MY: [
    u("Universiti Malaya", "Kuala Lumpur"),
    u("Universiti Kebangsaan Malaysia", "Bangi"),
    u("Universiti Putra Malaysia", "Serdang"),
    u("Universiti Sains Malaysia", "Penang"),
    u("Universiti Teknologi Malaysia", "Johor Bahru"),
    u("Universiti Teknologi PETRONAS", "Seri Iskandar"),
    u("Taylor's University", "Subang Jaya"),
    u("Sunway University", "Subang Jaya"),
    u("UCSI University", "Kuala Lumpur"),
    u("Universiti Utara Malaysia", "Sintok"),
    u("International Islamic University Malaysia", "Gombak"),
    u("Monash University Malaysia", "Subang Jaya"),
  ],
  NL: [
    u("Delft University of Technology", "Delft"),
    u("University of Amsterdam", "Amsterdam"),
    u("Utrecht University", "Utrecht"),
    u("Eindhoven University of Technology", "Eindhoven"),
    u("Leiden University", "Leiden"),
    u("Wageningen University & Research", "Wageningen"),
    u("University of Groningen", "Groningen"),
    u("Erasmus University Rotterdam", "Rotterdam"),
    u("Vrije Universiteit Amsterdam", "Amsterdam"),
    u("Maastricht University", "Maastricht"),
    u("University of Twente", "Enschede"),
    u("Radboud University", "Nijmegen"),
  ],
};

/** Why Belgium is short, said in the data rather than only in a comment. */
export const countryNotes: Record<string, string> = {
  BE: "Belgium has nine universities in total. The list is not short by accident and is not padded to reach twelve.",
};

export const totalUniversities = Object.values(universities).reduce((n, list) => n + list.length, 0);


/** How much of the detail is actually filled in, counted rather than claimed. */
export function coverage() {
  const all = Object.values(universities).flat();
  const filled = all.filter((x) => x.tuition || x.deadlines || x.requirements).length;
  return { filled, total: all.length };
}
