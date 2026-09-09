/**
 * The film is one shot.
 *
 * Sultan's whole life is drawn as a single vertical climb: the forest floor
 * at the bottom, the reckoning tree above it, and then a tower whose every
 * floor is one thing that happened to him. The camera never cuts. It rises,
 * and each floor arrives in turn, and at the top it pulls back and the tower
 * is revealed for what it is.
 *
 * That structure is the book's, not an invention for the film: the title is a
 * branch, the last chapter is a floor, and the novel spends four hundred
 * pages on the distance between them.
 */

export const FPS = 30;
/** Two and a half minutes. */
export const DURATION = 150 * FPS;

export const W = 1920;
export const BAND = 1000;

/** Floors, bottom of the world upward. Order is the order of the story. */
export const SCENES = [
  "prayer",
  "upright",
  "leaving",
  "stoneTrees",
  "friends",
  "high",
  "crossing",
  "otto",
  "paper",
  "police",
  "airport",
  "shaving",
] as const;

export type SceneId = (typeof SCENES)[number];

/** The forest occupies the lowest three bands; the tower holds the rest. */
export const FOREST_BANDS = 3;
export const TOP_MARGIN = 1000;
export const WORLD_H = TOP_MARGIN + SCENES.length * BAND + 600;

/** The top edge of a band, in world units. */
export function bandTop(i: number) {
  return TOP_MARGIN + (SCENES.length - 1 - i) * BAND;
}

/** Where the tower's facade begins and ends. */
export const TOWER = { x: 470, w: 980 };
/** The ground the forest stands on. */
export const GROUND = bandTop(0) + BAND;
/** The top of the tower, which is also the highest floor. */
export const ROOF = bandTop(SCENES.length - 1) - 120;

/**
 * Hold every pose for two frames.
 *
 * This is the single biggest thing separating a cut-out film from the same
 * artwork moved smoothly by a computer. A stop-motion animator exposes each
 * arrangement of paper twice, so the picture changes fifteen times a second,
 * not thirty, and the eye reads the difference immediately: motion on twos
 * has a staccato to it that no amount of paper texture will fake.
 *
 * Everything derived from time goes through here, the camera included. A
 * camera gliding on ones over puppets moving on twos is worse than either,
 * because the mismatch is what gives it away.
 */
export const STEP = 2;
export const held = (frame: number) => Math.floor(frame / STEP) * STEP;

/**
 * The boil.
 *
 * Paper laid under a camera never goes back down in exactly the same place.
 * Between exposures every piece shifts a fraction of a millimetre and the
 * whole image quietly seethes. Without it the shapes look printed on; with
 * it they look placed by hand, which is what they are.
 */
export function boil(seed: number, frame: number) {
  const t = held(frame);
  const n = (k: number) => {
    const x = Math.sin(seed * 12.9898 + t * 0.7 + k * 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  return { dx: n(1) * 0.9, dy: n(2) * 0.9, rot: n(3) * 0.32 };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * The camera, and the climber it follows.
 *
 * The climb takes the first six sevenths of the film. The last stretch is the
 * top: he arrives, and the camera keeps going without him, back and back
 * until the whole thing is in frame at once.
 */
export function camera(frame: number) {
  const t = clamp01(frame / (DURATION - 1));
  const climbEnd = 0.86;

  const k = clamp01(t / climbEnd);
  // Not linear: he starts slowly in the canopy, moves fastest through the
  // middle of the tower, and slows again as the top comes up.
  const eased = easeInOut(k);

  const startY = GROUND - 380;
  const climbY = startY - eased * (startY - ROOF);

  const out = clamp01((t - climbEnd) / (1 - climbEnd));
  const pull = easeInOut(out);

  /*
   * Held tight on him for the climb, then opened out.
   *
   * The first pass pulled back nine times, which in a frame this wide left
   * the tower as a sliver at the edge: a tall world cannot be shown whole in
   * a landscape frame. So the pull-back is modest, and what it reveals is the
   * top of the tower with sky above it, which is where the title goes.
   */
  const zoom = 1 + pull * 1.9;
  const camY = climbY - pull * 620;

  return { y: camY, zoom, climbY, out: pull, t };
}
