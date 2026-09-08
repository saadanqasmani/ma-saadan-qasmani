"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
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
 * Drawn as line art in the site's own ink so it reads as an illustration
 * rather than a cartoon pasted on top. It plays once per visitor and can be
 * skipped at any moment; anyone who prefers reduced motion never sees it at
 * all.
 */

const DURATION = 8200;
const SEEN_KEY = "thb-intro-seen";

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

/** The reckoning tree, in the same drawing language as the homepage. */
function treePaths() {
  const rand = mulberry32(99117);
  const out: { d: string; w: number }[] = [];
  const grow = (x: number, y: number, ang: number, len: number, w: number, depth: number) => {
    const r = (ang * Math.PI) / 180;
    const x2 = x + Math.cos(r) * len;
    const y2 = y + Math.sin(r) * len;
    const bend = (rand() - 0.5) * len * 0.3;
    const mx = (x + x2) / 2 + Math.cos(r + Math.PI / 2) * bend;
    const my = (y + y2) / 2 + Math.sin(r + Math.PI / 2) * bend;
    out.push({ d: `M ${x} ${y} Q ${mx.toFixed(0)} ${my.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`, w });
    if (depth >= 4) return;
    const n = depth < 1 ? 2 : rand() > 0.7 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1) - 0.5;
      grow(x2, y2, ang + t * 44 + (rand() - 0.5) * 12, len * 0.72, w * 0.66, depth + 1);
    }
  };
  grow(TREE_X, WORLD.ground, -90, 300, 15, 0);
  return out;
}

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

const TREE = treePaths();
const PEOPLE = crowdFigures();

function Crowd({ dim }: { dim: boolean }) {
  return (
    <g opacity={dim ? 0.5 : 0.9}>
      {PEOPLE.map((p, i) => {
        const top = WORLD.ground - p.h;
        // Smaller figures read as further away, so they are drawn lighter.
        const depth = (p.h - 128) / 62;
        return (
          <g
            key={i}
            stroke="var(--ink)"
            strokeWidth={2.4 + depth * 1.6}
            fill="none"
            strokeLinecap="round"
            opacity={0.45 + depth * 0.5}
          >
            <circle cx={p.x + p.lean} cy={top} r={p.w * 0.44} />
            <path d={`M ${p.x + p.lean} ${top + p.w * 0.5} L ${p.x} ${WORLD.ground - p.h * 0.42}`} />
            <path
              d={`M ${p.x} ${WORLD.ground - p.h * 0.42} L ${p.x - p.w * 0.4} ${WORLD.ground} M ${p.x} ${WORLD.ground - p.h * 0.42} L ${p.x + p.w * 0.4} ${WORLD.ground}`}
            />
            <path
              d={`M ${p.x + p.lean * 0.6} ${top + p.w * 0.8} L ${p.x - p.w * (p.back ? 0.9 : 0.6)} ${WORLD.ground - p.h * (p.back ? 0.62 : 0.5)} M ${p.x + p.lean * 0.6} ${top + p.w * 0.8} L ${p.x + p.w * (p.back ? 0.5 : 0.75)} ${WORLD.ground - p.h * 0.52}`}
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
  return (
    <g stroke="var(--ink)" fill="none">
      <path
        d={`M ${BUILDING.x} ${WORLD.ground} L ${BUILDING.x} ${BUILDING.top} L ${BUILDING.x + BUILDING.w} ${BUILDING.top} L ${BUILDING.x + BUILDING.w} ${WORLD.ground}`}
        strokeWidth={4}
      />
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const w = 62;
        const h = 52;
        const x = BUILDING.x + 54 + c * (BUILDING.w - 108) / (cols - 1) - w / 2;
        const y = BUILDING.top + 70 + r * 100;
        if (y + h > WORLD.ground - 30) return null;
        return <rect key={i} x={x} y={y} width={w} height={h} strokeWidth={2} opacity={0.55} />;
      })}
    </g>
  );
}

/** The figure itself. */
function Monkey({ frame }: { frame: Frame }) {
  const f = frame.figure;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={f.tail} stroke="var(--ink)" strokeWidth={3.4} opacity={0.9} />

      {f.limbs
        .filter((l) => l.far)
        .map((l, i) => (
          <path key={`far-${i}`} d={l.d} stroke="var(--ink)" strokeWidth={l.w} opacity={0.42} />
        ))}

      <path d={f.neck} stroke="var(--ink)" strokeWidth={9} />
      <path d={f.torso} stroke="var(--ink)" strokeWidth={13} opacity={0.95} />
      {f.dressed > 0 && (
        <g opacity={f.dressed}>
          <path d={f.suit.jacket} stroke="var(--ink)" strokeWidth={21} />
          <path d={f.suit.lapel} stroke="var(--canvas)" strokeWidth={3} />
          <path d={f.suit.trouserF} stroke="var(--ink)" strokeWidth={9} opacity={0.5} />
          <path d={f.suit.trouserN} stroke="var(--ink)" strokeWidth={10} />
          {f.suit.shoes.map((d, i) => (
            <path key={i} d={d} stroke="var(--ember)" strokeWidth={9} />
          ))}
        </g>
      )}

      {f.limbs
        .filter((l) => !l.far)
        .map((l, i) => (
          <path key={`near-${i}`} d={l.d} stroke="var(--ink)" strokeWidth={l.w} />
        ))}

      <path d={f.head.d} fill="var(--ink)" stroke="var(--ink)" strokeWidth={2} />
      <path d={f.head.muzzle} stroke="var(--canvas)" strokeWidth={1.6} opacity={0.5} />
      <circle cx={f.head.eye.x} cy={f.head.eye.y} r={2.4} fill="var(--canvas)" />
      <circle cx={f.head.ear.x} cy={f.head.ear.y} r={5} stroke="var(--ink)" strokeWidth={2.4} />
      <path d={f.head.brow} stroke="var(--ink)" strokeWidth={3} />
    </g>
  );
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

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-canvas"
          aria-hidden
        >
          <motion.svg
            viewBox={`${cam.x} ${cam.y} ${vw} ${vh}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
            style={{ opacity: fade }}
          >
            <line
              x1={0}
              y1={WORLD.ground}
              x2={WORLD.w}
              y2={WORLD.ground}
              stroke="var(--ink)"
              strokeWidth={2}
              opacity={0.35}
            />

            <g stroke="var(--ink)" fill="none" strokeLinecap="round" opacity={0.85}>
              {TREE.map((s, i) => (
                <path key={i} d={s.d} strokeWidth={s.w} />
              ))}
              {/* The limb he hangs from: explicit, so the grip always lands on
                  wood rather than wherever the seed happened to put a branch. */}
              <path
                d={`M ${HANG_BRANCH.x1} ${HANG_BRANCH.y + 16} Q ${(HANG_BRANCH.x1 + HANG_BRANCH.x2) / 2} ${HANG_BRANCH.y - 10} ${HANG_BRANCH.x2} ${HANG_BRANCH.y}`}
                strokeWidth={9}
              />
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
            className="absolute bottom-8 right-8 border border-ink/30 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
