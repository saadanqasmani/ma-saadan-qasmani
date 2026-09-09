/**
 * Construction paper.
 *
 * Every colour here is one a sheet of paper actually comes in: slightly
 * dirty, never fully saturated, and warm or cold rather than neutral. The
 * film's arc runs the novel's own refrain, orange to blue to gone, so the
 * palette is grouped by where in that arc a sheet belongs.
 */
export const PAPER = {
  // Forest, lit through a gap
  sky1: "#e8a552",
  sky2: "#d97b33",
  sun: "#f7d9a0",
  canopy1: "#2f6b45",
  canopy2: "#245437",
  canopy3: "#3f8355",
  bark: "#6b4630",
  barkDark: "#4a2f1f",
  root: "#8a5a3a",
  soil: "#5c3d28",

  // Sultan and his people
  fur: "#9a6440",
  furDark: "#6d422a",
  furLight: "#c08b5c",
  skin: "#d9a375",

  // The Upright, and everything they bring
  slate: "#3a4356",
  slateDark: "#242b3a",
  paperWhite: "#f2ece0",
  ledger: "#e5dcc8",

  // Stone trees
  concrete: "#8f93a0",
  concreteDark: "#6a6e7d",
  concreteLight: "#adb1bb",
  glassWarm: "#f0d9a8",
  glassCold: "#b9c9dd",

  // Night, and the end of it
  night1: "#1b2437",
  night2: "#111827",
  night3: "#0a0f1a",
  blue: "#2f4f86",

  // Accents, the site's own
  ember: "#c2430f",
  emberLight: "#e8763a",
} as const;
