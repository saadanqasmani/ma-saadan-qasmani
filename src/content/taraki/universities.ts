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

export type University = {
  id: string;
  name: string;
  city: string;
  /** Filled per university, later, each with a source. */
  requirements: null;
  tuition: null;
};

export const SELECTION_SOURCE = {
  label: "QS World University Rankings 2026",
  url: "https://www.topuniversities.com/world-university-rankings/2026",
  asOf: "2026-09-14",
  note: "Used to choose which institutions to list. No individual rank is asserted.",
};

function u(name: string, city: string): University {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    city,
    requirements: null,
    tuition: null,
  };
}

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
    u("Koç University", "Istanbul"),
    u("Sabancı University", "Istanbul"),
    u("Middle East Technical University", "Ankara"),
    u("Boğaziçi University", "Istanbul"),
    u("Istanbul Technical University", "Istanbul"),
    u("Bilkent University", "Ankara"),
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
