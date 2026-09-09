"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BRANCH_Y,
  BUILDING,
  CROWD,
  HANG_BRANCH,
  TREE_X,
  VIEW,
  WORLD,
  frameAt,
  type Frame,
} from "@/lib/novel/monkeySequence";

/**
 * The title sequence for The Highest Branch.
 *
 * A macaque hangs from the reckoning tree, drops, crosses the ground, meets a
 * crowd, comes out the other side in a suit, climbs a building and leaves the
 * frame, revealing the page underneath.
 *
 * Painted rather than drawn: the figure is built from filled, tapering
 * volumes so it reads as a body, and the whole sequence runs on the light the
 * novel keeps returning to, which goes orange, and then blue, and then gone.
 * That is the book's own refrain, and it happens to be this site's two
 * accents, so the sequence lights itself in the colours the rest of the pages
 * already use.
 *
 * It plays once per visitor and can be skipped at any moment; anyone who
 * prefers reduced motion never sees it at all.
 */

const DURATION = 8200;
const SEEN_KEY = "thb-intro-seen";

/**
 * The palette.
 *
 * Fur is warm and lit from the left, because the forest light in the novel
 * comes down through a gap. The city is cool and lit from nowhere in
 * particular, which is the point of it.
 */
const C = {
  fur: "#96603a",
  furLit: "#c98a4c",
  furDark: "#41240f",
  skin: "#d9a173",
  skinDark: "#a76f47",
  eye: "#2a1408",
  suit: "#1d2740",
  suitLit: "#33415f",
  shirt: "#f6f1e7",
  shoe: "#c2430f",
  bark: "#4a3324",
  barkLit: "#6b4a33",
  leafDeep: "#1f5138",
  leaf: "#337a4d",
  leafLit: "#5f9c5a",
  crowd: "#2c3244",
  crowdFar: "#59617a",
  concrete: "#8d93a3",
  concreteDark: "#5f6577",
  window: "#f3e2c4",
  windowCold: "#c6d4e8",
} as const;

// ── Scenery ────────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The reckoning tree: the same recursive growth as the homepage, but the
 * branches come back as tapering wood rather than strokes, and the tips carry
 * leaf clusters so the canopy is a canopy instead of a diagram.
 */
function treeParts() {
  const rand = mulberry32(99117);
  const wood: { d: string; w: number; lit: boolean }[] = [];
  const leaves: { x: number; y: number; r: number; tone: number }[] = [];

  const grow = (x: number, y: number, ang: number, len: number, w: number, depth: number) => {
    const r = (ang * Math.PI) / 180;
    const x2 = x + Math.cos(r) * len;
    const y2 = y + Math.sin(r) * len;
    const bend = (rand() - 0.5) * len * 0.3;
    const mx = (x + x2) / 2 + Math.cos(r + Math.PI / 2) * bend;
    const my = (y + y2) / 2 + Math.sin(r + Math.PI / 2) * bend;
    wood.push({
      d: `M ${f(x)} ${f(y)} Q ${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}`,
      w,
      // Branches heading up and left catch the gap light.
      lit: Math.cos(r) < 0.25 && Math.sin(r) < -0.1,
    });
    if (depth >= 3) {
      const n = depth >= 4 ? 5 : 2;
      for (let i = 0; i < n; i += 1) {
        leaves.push({
          x: x2 + (rand() - 0.5) * 96,
          y: y2 + (rand() - 0.5) * 76,
          r: 26 + rand() * 26,
          tone: rand(),
        });
      }
      if (depth >= 4) return;
    }
    const n = depth < 1 ? 2 : rand() > 0.7 ? 3 : 2;
    for (let i = 0; i < n; i += 1) {
      const t = i / (n - 1) - 0.5;
      grow(x2, y2, ang + t * 44 + (rand() - 0.5) * 12, len * 0.72, w * 0.62, depth + 1);
    }
  };

  grow(TREE_X, WORLD.ground, -90, 300, 34, 0);
  // Far leaves first: the deep tone sits behind, the lit tone in front.
  leaves.sort((a, b) => a.tone - b.tone);
  return { wood, leaves };
}

const f = (n: number) => n.toFixed(0);

/** A crowd, seen as line silhouettes: no faces, no invented people. */
function crowdFigures() {
  const rand = mulberry32(5521);
  const people: { x: number; h: number; w: number; lean: number; back: boolean }[] = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    // Clustered, not ruled: the gaps between them vary by more than their width.
    const bias = Math.sin(i * 2.4) * 0.06;
    people.push({
      x: CROWD.from + (i / (n - 1) + bias) * (CROWD.to - CROWD.from),
      h: 128 + rand() * 62,
      w: 22 + rand() * 12,
      lean: (rand() - 0.5) * 14,
      back: rand() > 0.55,
    });
  }
  // Far figures first, so the near ones overlap them.
  return people.sort((a, b) => a.h - b.h);
}

/** The closed canopy behind the clearing. */
function horizon() {
  const rand = mulberry32(3312);
  return Array.from({ length: 26 }, (_, i) => ({
    x: -180 + i * 145 + (rand() - 0.5) * 90,
    h: 150 + rand() * 190,
    r: 105 + rand() * 80,
  }));
}

/** Fallen fruit and leaf litter in the clearing. */
function litter() {
  const rand = mulberry32(8081);
  return Array.from({ length: 34 }, () => ({
    x: TREE_X - 220 + rand() * 1500,
    y: 6 + rand() * 26,
    r: 5 + rand() * 9,
    warm: rand() > 0.62,
  }));
}

const TREE = treeParts();
const HORIZON = horizon();
const LITTER = litter();
const PEOPLE = crowdFigures();

function Crowd({ dim }: { dim: boolean }) {
  return (
    <g opacity={dim ? 0.75 : 1}>
      {PEOPLE.map((p, i) => {
        const top = WORLD.ground - p.h;
        const depth = (p.h - 128) / 62;
        const head = p.w * 0.42;
        const shoulder = top + head * 2.1;
        const hip = WORLD.ground - p.h * 0.44;
        const half = p.w * 0.5;
        // Filled: a head, a coat that flares to the hip, and two legs. No
        // faces anywhere, because the crowd is a condition and not a cast.
        return (
          <g key={i} fill={depth > 0.5 ? C.crowd : C.crowdFar} opacity={0.62 + depth * 0.38}>
            <ellipse cx={p.x + p.lean} cy={top + head} rx={head} ry={head * 1.12} />
            <path
              d={`M ${p.x + p.lean - half * 0.62} ${shoulder}
                  Q ${p.x - half * 1.05} ${(shoulder + hip) / 2} ${p.x - half * 0.95} ${hip}
                  L ${p.x + half * 0.95} ${hip}
                  Q ${p.x + half * 1.05} ${(shoulder + hip) / 2} ${p.x + p.lean + half * 0.62} ${shoulder}
                  Q ${p.x + p.lean} ${shoulder - head * 0.7} ${p.x + p.lean - half * 0.62} ${shoulder} Z`}
            />
            <path
              d={`M ${p.x - half * 0.9} ${hip} L ${p.x - half * (p.back ? 0.95 : 0.6)} ${WORLD.ground}
                  L ${p.x - half * 0.1} ${WORLD.ground} L ${p.x - half * 0.05} ${hip} Z`}
            />
            <path
              d={`M ${p.x + half * 0.9} ${hip} L ${p.x + half * (p.back ? 0.6 : 0.95)} ${WORLD.ground}
                  L ${p.x + half * 0.08} ${WORLD.ground} L ${p.x + half * 0.05} ${hip} Z`}
            />
          </g>
        );
      })}
    </g>
  );
}

function Building() {
  const rows = 11;
  const cols = 5;
  const lit = mulberry32(7714);
  return (
    <g>
      <rect
        x={BUILDING.x}
        y={BUILDING.top}
        width={BUILDING.w}
        height={WORLD.ground - BUILDING.top}
        fill={C.concrete}
      />
      {/* The far half of the facade turns away from the light. */}
      <rect
        x={BUILDING.x + BUILDING.w * 0.62}
        y={BUILDING.top}
        width={BUILDING.w * 0.38}
        height={WORLD.ground - BUILDING.top}
        fill={C.concreteDark}
        opacity={0.55}
      />
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const w = 62;
        const h = 52;
        const x = BUILDING.x + 54 + (c * (BUILDING.w - 108)) / (cols - 1) - w / 2;
        const y = BUILDING.top + 70 + r * 100;
        if (y + h > WORLD.ground - 30) return null;
        const on = lit() > 0.42;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={on ? C.window : C.windowCold}
            opacity={on ? 0.92 : 0.5}
          />
        );
      })}
    </g>
  );
}

/**
 * The figure.
 *
 * Painted back to front: the far limbs first and dimmed, then the body, then
 * the clothes over it, then the near limbs, then the face. Every shape is
 * filled; nothing here is a stroke pretending to be an arm.
 */
function Monkey({ frame }: { frame: Frame }) {
  const f = frame.figure;
  const h = f.head;
  const d = f.dressed;

  // A silhouette pass behind everything: the same shapes, fattened by a
  // stroke in the darkest fur tone. Without it he disappears into the bark on
  // the tree and into the concrete on the building.
  const contour = [f.tail, f.armFar, f.legFar, f.torso, f.armNear, f.legNear, h.skull];

  return (
    <g strokeLinejoin="round">
      {/* Filled as well as stroked: an unfilled outline shows its own round
          caps through whatever is drawn over it, which put a grey ring on his
          hip where the tail met the body. */}
      <g fill={C.furDark} stroke={C.furDark} strokeWidth={4 * f.scale} opacity={0.75}>
        {contour.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Far side: same fur, pushed back by darkening rather than by fading,
          so it stays solid against a light ground. */}
      <g fill={C.furDark} opacity={0.85}>
        <path d={f.tail} />
        <path d={f.armFar} />
        <path d={f.legFar} />
        <path d={f.handFar} fill={C.skinDark} />
        <path d={f.footFar} fill={C.skinDark} />
      </g>
      {d > 0 && (
        <g opacity={d}>
          <path d={f.suit.trouserFar} fill={C.suit} opacity={0.7} />
          <path d={f.suit.sleeveFar} fill={C.suit} opacity={0.7} />
          <path d={f.suit.shoeFar} fill={C.shoe} opacity={0.75} />
        </g>
      )}

      {/* Body */}
      <path d={f.torso} fill={C.fur} />
      <path d={f.chestLight} fill={C.furLit} opacity={0.55} />

      {/* Clothes, crossfading on while he is inside the crowd. */}
      {d > 0 && (
        <g opacity={d}>
          <path d={f.suit.jacket} fill={C.suit} />
          <path d={f.suit.jacket} fill={C.suitLit} opacity={0.4} transform="translate(-3,0)" />
          <path d={f.suit.lapel} fill="none" stroke={C.shirt} strokeWidth={3.4 * f.scale} />
          <path d={f.suit.collar} fill={C.shirt} />
          <path d={f.suit.trouserNear} fill={C.suit} />
        </g>
      )}

      {/* Near side */}
      <path d={f.armNear} fill={C.fur} />
      <path d={f.legNear} fill={C.fur} />
      {d > 0 && <path d={f.suit.sleeveNear} fill={C.suit} opacity={d} />}
      <path d={f.handNear} fill={C.skin} />
      <path d={f.footNear} fill={C.skin} />
      {d > 0 && <path d={f.suit.shoeNear} fill={C.shoe} opacity={d} />}

      {/* Head last: the face is the only place the drawing gets detailed,
          which is where an eye goes looking anyway. */}
      <path d={h.skull} fill={C.fur} />
      <path d={h.ear} fill={C.fur} />
      <path d={h.earInner} fill={C.skinDark} opacity={0.8} />
      <path d={h.face} fill={C.skin} />
      <path d={h.brow} fill="none" stroke={C.furDark} strokeWidth={3.2 * f.scale} strokeLinecap="round" />
      <circle cx={h.eye.x} cy={h.eye.y} r={h.eyeR} fill={C.eye} />
      <circle cx={h.glint.x} cy={h.glint.y} r={h.eyeR * 0.34} fill={C.shirt} opacity={0.9} />
      <path d={h.nostril} fill={C.skinDark} opacity={0.7} />
      <path
        d={h.mouth}
        fill="none"
        stroke={C.skinDark}
        strokeWidth={1.5 * f.scale}
        strokeLinecap="round"
        opacity={0.75}
      />
    </g>
  );
}

/** Two colours, mixed. Cheap, and the only blend this needs. */
function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(r1, r2)}, ${c(g1, g2)}, ${c(b1, b2)})`;
}

/**
 * The light, over the length of the sequence.
 *
 * "The light went orange and then blue and then gone" is the novel's own
 * refrain; it appears in the first chapter and again in the last line but
 * one. The sequence obeys it: the forest is orange, the city is blue, and the
 * climb goes dark.
 */
function skyAt(t: number) {
  const warm = { top: "#f6b26b", mid: "#e98a3c", low: "#c25a1e", ground: "#7a4a24" };
  const cool = { top: "#2f4f86", mid: "#3b6096", low: "#5c7bab", ground: "#2c3444" };
  const gone = { top: "#0d1424", mid: "#131c31", low: "#1b2540", ground: "#0e1420" };

  const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const from = t < 0.5 ? warm : cool;
  const to = t < 0.5 ? cool : gone;
  return {
    top: mix(from.top, to.top, k),
    mid: mix(from.mid, to.mid, k),
    low: mix(from.low, to.low, k),
    ground: mix(from.ground, to.ground, k),
  };
}

/**
 * Whether this visitor has already watched it.
 *
 * Read through an external store rather than an effect: deciding to play is a
 * question about the browser, not a state change to schedule, and setting
 * state from an effect body to answer it causes a cascading render.
 *
 * The server snapshot is `true`, so the sequence never exists in the markup
 * and can only ever begin after hydration.
 */
function subscribeSeen(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readSeen() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Storage blocked: they simply see it again. Not worth failing over.
    return false;
  }
}

export function MonkeyIntro() {
  const reduced = useReducedMotion();
  const seen = useSyncExternalStore(subscribeSeen, readSeen, () => true);
  const [done, setDone] = useState(false);
  const [frame, setFrame] = useState<Frame>(() => frameAt(0));
  const raf = useRef<number | null>(null);
  const started = useRef<number>(0);

  const playing = !reduced && !seen && !done;

  const finish = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // As above: a blocked store just means it plays again next time.
    }
    setDone(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    started.current = performance.now();
    const tick = (now: number) => {
      const t = (now - started.current) / DURATION;
      if (t >= 1) {
        setFrame(frameAt(1));
        finish();
        return;
      }
      setFrame(frameAt(t));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // Deliberately keyed on `playing` alone: restarting the clock whenever a
    // frame lands would freeze the sequence on its first frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // The page behind must not scroll while the sequence owns the screen.
  useEffect(() => {
    if (!playing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, finish]);

  const { cam, fade } = frame;
  const vw = VIEW.w * cam.z;
  const vh = VIEW.h * cam.z;
  const sky = skyAt(frame.light);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-[#0d1424]"
          aria-hidden
        >
          <motion.svg
            viewBox={`${cam.x} ${cam.y} ${vw} ${vh}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
            style={{ opacity: fade }}
          >
            <defs>
              {/*
                The light script, straight out of the novel: it goes orange,
                and then blue, and then gone. The stops move with the sequence,
                so the forest is lit and the city is not.
              */}
              <linearGradient id="thb-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sky.top} />
                <stop offset="62%" stopColor={sky.mid} />
                <stop offset="100%" stopColor={sky.low} />
              </linearGradient>
              <linearGradient id="thb-ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sky.ground} />
                <stop offset="100%" stopColor="#241a13" />
              </linearGradient>
              {/* The gap: the one place the roof has failed and the light
                  comes down whole. It is the book's whole argument, so it is
                  drawn rather than implied. */}
              <linearGradient id="thb-shaft" x1="0" y1="0" x2="0.25" y2="1">
                <stop offset="0%" stopColor="#ffe4b5" stopOpacity={0.75} />
                <stop offset="100%" stopColor="#ffd9a0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <rect
              x={-200}
              y={WORLD.h * -1}
              width={WORLD.w + 400}
              height={WORLD.h * 2.4}
              fill="url(#thb-sky)"
            />

            {/* The closed canopy, far back and low: the roof the clearing is
                a hole in. It sits behind the shaft, so the light reads as
                coming down through the gap rather than over the trees. */}
            <g>
              {HORIZON.map((t, i) => (
                <ellipse
                  key={i}
                  cx={t.x}
                  cy={WORLD.ground - t.h * 0.34}
                  rx={t.r}
                  ry={t.h * 0.5}
                  fill={i % 3 === 0 ? C.leafDeep : "#26543c"}
                  opacity={0.85}
                />
              ))}
            </g>

            <path
              d={`M ${TREE_X + 10} ${BRANCH_Y - 340} L ${TREE_X + 180} ${BRANCH_Y - 340}
                  L ${TREE_X + 330} ${WORLD.ground} L ${TREE_X - 40} ${WORLD.ground} Z`}
              fill="url(#thb-shaft)"
            />

            <rect
              x={-200}
              y={WORLD.ground}
              width={WORLD.w + 400}
              height={WORLD.h}
              fill="url(#thb-ground)"
            />

            {/* What falls in the gap. The novel is specific that the fruit
                falls where the roof has failed, so it is on the floor here. */}
            <g>
              {LITTER.map((l, i) => (
                <ellipse
                  key={i}
                  cx={l.x}
                  cy={WORLD.ground + l.y}
                  rx={l.r}
                  ry={l.r * 0.6}
                  fill={l.warm ? "#c9762f" : "#5b3d26"}
                  opacity={0.8}
                />
              ))}
            </g>

            {/* Wood first, then the canopy over it. */}
            <g strokeLinecap="round" fill="none">
              {TREE.wood.map((b, i) => (
                <path key={i} d={b.d} stroke={b.lit ? C.barkLit : C.bark} strokeWidth={b.w} />
              ))}
              {/* The limb he hangs from: explicit, so the grip always lands on
                  wood rather than wherever the seed happened to put a branch. */}
              <path
                d={`M ${HANG_BRANCH.x1} ${HANG_BRANCH.y + 16} Q ${(HANG_BRANCH.x1 + HANG_BRANCH.x2) / 2} ${HANG_BRANCH.y - 10} ${HANG_BRANCH.x2} ${HANG_BRANCH.y}`}
                stroke={C.barkLit}
                strokeWidth={11}
              />
            </g>
            <g>
              {TREE.leaves.map((l, i) => (
                <ellipse
                  key={i}
                  cx={l.x}
                  cy={l.y}
                  rx={l.r}
                  ry={l.r * 0.72}
                  fill={l.tone > 0.72 ? C.leafLit : l.tone > 0.36 ? C.leaf : C.leafDeep}
                  opacity={0.9}
                />
              ))}
            </g>

            <Building />

            {/* The crowd is drawn behind him on the way in and in front of him
                on the way through, which is what sells passing among them. */}
            {!frame.inCrowd && <Crowd dim />}
            <Monkey frame={frame} />
            {frame.inCrowd && <Crowd dim={false} />}
          </motion.svg>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-8 right-8 border border-white/40 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition-colors hover:border-white hover:text-white"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
