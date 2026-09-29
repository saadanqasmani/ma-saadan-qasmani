"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { aboutTheAuthor, contents, sections, type Line } from "@/content/book/interior";
import { goToPurchase } from "@/components/book/ToPurchase";
import type { Dictionary } from "@/content/i18n/en";

/**
 * The cover, and the book behind it.
 *
 * Clicking the cover opens the interior as it is actually set: 6 by 9, the
 * trim it is printed at, with the running heads and the folios in the
 * margins where the printer puts them. It runs from the title page to the
 * end of the prologue, stops at the first line of chapter one, and then
 * gives the note about the man who wrote it.
 *
 * The text is the book's own, so it stays in English whichever language the
 * site is being read in. Only the chrome around it is translated.
 */

/* The printed page, a little larger than life so that fourteen-point on a
   screen reads as eleven-point on paper does in the hand. */
const PAGE_W = 520;
const PAGE_H = 780;
const PAD_X = 62;
const PAD_TOP = 56;
const LEADING = 20;
const LINES = 33;
const CONTENT_H = LEADING * LINES;

const geometry = {
  "--pg-w": `${PAGE_W}px`,
  "--pg-h": `${PAGE_H}px`,
  "--pg-px": `${PAD_X}px`,
  "--pg-pt": `${PAD_TOP}px`,
  "--pg-ch": `${CONTENT_H}px`,
} as React.CSSProperties;

/** The folio the preview starts on, from the printed book's own front matter. */
const FIRST_FOLIO = 5;

/* --- the manuscript marks ------------------------------------------- */

/**
 * `*italic*` and `**bold**`, which is how the words arrive from the person
 * who wrote them. Split on the marks rather than parsed, because the only
 * thing that can nest here is nothing.
 */
function marked(text: string, key: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${key}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${key}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <span key={`${key}-${i}`}>{part}</span>;
  });
}

/** A paragraph opens flush when there is nothing above it to continue. */
function opensFlush(lines: readonly Line[], i: number): boolean {
  if (i === 0) return true;
  const before = lines[i - 1].tag;
  return before === "gap" || before === "sub" || before === "quote";
}

function Flow({ heading, lines }: { heading?: string; lines: readonly Line[] }) {
  return (
    <>
      {heading && <p className="tb-head">{heading}</p>}
      {lines.map((line, i) => {
        if (line.tag === "gap") return <div key={i} className="tb-gap" aria-hidden />;
        if (line.tag === "sub") return <p key={i} className="tb-sub">{line.text}</p>;
        if (line.tag === "quote") return <p key={i} className="tb-quote">{marked(line.text, String(i))}</p>;
        return (
          <p key={i} className={opensFlush(lines, i) ? "tb-open" : undefined}>
            {marked(line.text, String(i))}
          </p>
        );
      })}
    </>
  );
}

/* --- measuring --------------------------------------------------------- */

/**
 * How tall each section's column comes out once it is set.
 *
 * Measured rather than guessed, because the height depends on a webfont
 * that arrives after the first paint and on how the browser hyphenates.
 * An observer rather than an effect: the height changes when the font
 * lands, and something has to be watching when it does.
 */
function useColumnHeights(): [
  (id: string) => React.RefCallback<HTMLDivElement>,
  Record<string, number>,
] {
  const [heights, setHeights] = useState<Record<string, number>>({});
  // One callback per section, kept: a fresh callback on every render would
  // tear the observer down and build it again on every render, and the
  // rebuild reports a height, which is another render.
  const kept = useRef(new Map<string, React.RefCallback<HTMLDivElement>>());
  const attach = useCallback((id: string): React.RefCallback<HTMLDivElement> => {
    const already = kept.current.get(id);
    if (already) return already;
    const made: React.RefCallback<HTMLDivElement> = (node) => {
      if (!node) return;
      const watch = new ResizeObserver(() => {
        const next = node.scrollHeight;
        setHeights((was) => (was[id] === next ? was : { ...was, [id]: next }));
      });
      watch.observe(node);
      return () => watch.disconnect();
    };
    kept.current.set(id, made);
    return made;
  }, []);
  return [attach, heights];
}

/* --- the paged facsimile ----------------------------------------------- */

/** The sheets one section comes to, as windows onto one continuous column. */
function Sheets({
  heading,
  running,
  lines,
  folio,
  pages,
}: {
  heading: string;
  running: string;
  lines: readonly Line[];
  /** The printed page this section opens on. */
  folio: number;
  pages: number;
}) {
  return (
    <>
      {Array.from({ length: pages }, (_, i) => (
        <div key={i} className="tb-sheet" style={geometry}>
          {i > 0 && (
            <div className="tb-run" aria-hidden>
              <span>The Highest Branch</span>
              <span>{running}</span>
            </div>
          )}
          <div className="tb-win">
            <div className="tb-flow" lang="en" style={{ marginTop: -i * CONTENT_H }} aria-hidden={i > 0}>
              <Flow heading={heading} lines={lines} />
            </div>
          </div>
          <div className="tb-folio" aria-hidden>{folio + i}</div>
        </div>
      ))}
    </>
  );
}

function TitlePlate() {
  return (
    <div className="tb-sheet" style={geometry}>
      <div className="tb-plate" style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-latin-display), Georgia, serif", fontSize: 38, lineHeight: 1.1, letterSpacing: "0.02em" }}>
          THE HIGHEST
          <br />
          BRANCH
        </p>
        <p style={{ marginTop: 22, fontStyle: "italic", fontSize: 17, opacity: 0.75 }}>a novel</p>
        <p style={{ marginTop: "auto", fontSize: 15, letterSpacing: "0.08em" }}>M. A. SAADAN QASMANI</p>
      </div>
    </div>
  );
}

function ContentsPlate({ label }: { label: string }) {
  return (
    <div className="tb-sheet" style={geometry}>
      <div className="tb-plate" style={{ justifyContent: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-latin-display), Georgia, serif",
            fontSize: 22,
            textAlign: "center",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 26,
          }}
        >
          {label}
        </p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 11, lineHeight: "17px" }}>
          {contents.map((row) => (
            <li key={row.title} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              {row.chapter !== undefined && (
                <span style={{ width: 16, flexShrink: 0, textAlign: "right", opacity: 0.55 }}>{row.chapter}</span>
              )}
              <span
                style={{
                  fontStyle: row.chapter === undefined ? "italic" : undefined,
                  marginInlineStart: row.chapter === undefined ? 22 : 0,
                }}
              >
                {row.title}
              </span>
              <span aria-hidden style={{ flex: 1, borderBottom: "1px dotted rgba(35,33,28,0.28)", transform: "translateY(-3px)" }} />
              <span style={{ opacity: 0.7 }}>{row.page}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The bars that stand in for chapter one. Fixed widths, so they do not
 *  shuffle between renders and read as something loading. */
const REDACTION = [94, 100, 97, 88, 100, 92, 99, 74, 100, 96, 90, 100, 83];

function LockedPlate({
  copy,
  onPreOrder,
}: {
  copy: Dictionary["novel"]["preview"];
  onPreOrder: () => void;
}) {
  const first = contents.find((row) => row.chapter === 1);
  return (
    <div className="tb-sheet" style={geometry}>
      <div className="tb-plate" aria-hidden>
        <p style={{ fontFamily: "var(--font-latin-display), Georgia, serif", fontSize: 40, textAlign: "center", marginTop: 40 }}>
          {first?.chapter}
        </p>
        <p style={{ fontFamily: "var(--font-latin-display), Georgia, serif", fontSize: 24, textAlign: "center", marginTop: 14, marginBottom: 46 }}>
          {first?.title}
        </p>
        {REDACTION.map((w, i) => (
          <div key={i} className="tb-redact">
            <i style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: "auto 34px 34px",
          background: "rgba(255,253,249,0.97)",
          border: "1px solid rgba(29,26,22,0.1)",
          boxShadow: "0 -20px 40px -18px rgba(29,26,22,0.35)",
          padding: "26px 28px 28px",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: "var(--font-latin-display), Georgia, serif", fontSize: 21, lineHeight: 1.25 }}>
          {copy.lockedTitle}
        </p>
        <p style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.6, opacity: 0.75 }}>{copy.lockedBody}</p>
        <button
          type="button"
          onClick={onPreOrder}
          className="t-label group relative mt-6 inline-flex overflow-hidden bg-ink px-7 py-3.5 text-canvas-light"
        >
          <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          <span className="relative">{copy.preOrderNow}</span>
        </button>
      </div>
      {/* No folio here. This sheet is the threshold rather than a page of
          the book, and a number on it would be one the contents contradicts. */}
    </div>
  );
}

/* --- the phone, where a facsimile would be unreadable ------------------ */

/**
 * The printed page a section opens on, for the folio at the foot of a leaf.
 * Read off the book's own contents rather than counted, because on a phone
 * a section is one leaf however many printed pages it runs to.
 */
function folioOf(heading: string): number | null {
  return contents.find((row) => row.title === heading)?.page ?? null;
}

/** One leaf: a section, on its own sheet of paper, with its folio. */
function Leaf({
  id,
  children,
  folio,
}: {
  id?: string;
  children: React.ReactNode;
  folio?: number | null;
}) {
  return (
    <section id={id} className="tb-leaf">
      {children}
      {folio != null && (
        <p className="tb-leaf__folio" aria-hidden>
          {folio}
        </p>
      )}
    </section>
  );
}

/** A section's text, poured at a size a thumb can read. */
function Poured({ lines }: { lines: readonly Line[] }) {
  return (
    <>
      {lines.map((line, i) => {
        if (line.tag === "gap") return <div key={i} className="h-5" aria-hidden />;
        if (line.tag === "sub")
          return (
            <p key={i} className="tb-open mb-2 mt-7 text-center text-xs font-semibold uppercase tracking-[0.12em]">
              {line.text}
            </p>
          );
        if (line.tag === "quote")
          return (
            <p key={i} className="tb-open my-5 px-3 italic">
              {marked(line.text, `q${i}`)}
            </p>
          );
        return (
          <p key={i} className={opensFlush(lines, i) ? "tb-open" : undefined}>
            {marked(line.text, `s${i}`)}
          </p>
        );
      })}
    </>
  );
}

/**
 * The book on a phone.
 *
 * A six by nine facsimile shrunk to a phone is six-point type, so the same
 * text is set at a size a thumb can read. What is kept is the thing that
 * makes it a book rather than a web page: every section is its own leaf of
 * paper, with the printed folio at its foot, and you turn to the next one
 * rather than falling through a single column a thousand lines long. The
 * strip along the top says where you are and goes straight to any of them.
 */
function Leaves({
  copy,
  onPreOrder,
}: {
  copy: Dictionary["novel"]["preview"];
  onPreOrder: () => void;
}) {
  const first = contents.find((row) => row.chapter === 1);
  const [here, setHere] = useState<string | null>(null);

  /**
   * Which leaf is being read. An observer rather than a scroll handler:
   * it fires when a leaf crosses into the top third of the reader and
   * nowhere else, so the strip moves once per section instead of on every
   * pixel of thumb.
   */
  const watch = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const seen = new Map<string, number>();
    const eye = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRatio);
        let best: string | null = null;
        let most = 0;
        for (const [id, ratio] of seen) {
          if (ratio > most) {
            most = ratio;
            best = id;
          }
        }
        if (most > 0) setHere(best);
      },
      { threshold: [0, 0.15, 0.4, 0.75, 1] }
    );
    for (const leaf of node.querySelectorAll("section[id]")) eye.observe(leaf);
    return () => eye.disconnect();
  }, []);
  const marks = [
    { id: "tb-contents", label: copy.contents },
    ...sections.map((s) => ({ id: `tb-${s.id}`, label: s.heading })),
    { id: "tb-about", label: aboutTheAuthor.heading },
  ];

  return (
    <>
      <nav className="tb-marks" aria-label={copy.contents}>
        {marks.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-current={here === m.id}
            onClick={() => document.getElementById(m.id)?.scrollIntoView({ block: "start", behavior: "smooth" })}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div ref={watch} className="tb-scroll flex flex-col gap-4 px-3 py-4" lang="en">
        <Leaf>
          <div className="py-10 text-center">
            <p className="font-display text-3xl leading-tight">THE HIGHEST BRANCH</p>
            <p className="mt-2 italic opacity-70">a novel</p>
            <p className="mt-8 text-sm tracking-[0.08em]">M. A. SAADAN QASMANI</p>
          </div>
        </Leaf>

        <Leaf id="tb-contents">
          <p className="text-center text-xs uppercase tracking-[0.18em] opacity-70">{copy.contents}</p>
          <ol className="mt-5 list-none space-y-1 p-0 text-[0.8em] leading-snug">
            {contents.map((row) => (
              <li key={row.title} className="flex items-baseline gap-2">
                {row.chapter !== undefined && <span className="w-5 shrink-0 text-end opacity-55">{row.chapter}</span>}
                <span className={row.chapter === undefined ? "ms-7 italic" : undefined}>{row.title}</span>
                <span aria-hidden className="-translate-y-1 flex-1 border-b border-dotted border-ink/25" />
                <span className="opacity-70">{row.page}</span>
              </li>
            ))}
          </ol>
        </Leaf>

        {sections.map((section) => (
          <Leaf key={section.id} id={`tb-${section.id}`} folio={folioOf(section.heading)}>
            <p className="mb-9 mt-3 text-center font-display text-2xl">{section.heading}</p>
            <Poured lines={section.lines} />
          </Leaf>
        ))}

        <Leaf>
          <p className="text-center font-display text-3xl opacity-40" aria-hidden>
            {first?.chapter}
          </p>
          <p className="mt-2 text-center font-display text-xl opacity-40" aria-hidden>
            {first?.title}
          </p>
          <div className="mt-7 space-y-2.5" aria-hidden>
            {REDACTION.slice(0, 6).map((w, i) => (
              <div key={i} className="h-2 rounded-sm bg-ink/10" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="mt-8 border border-ink/10 bg-canvas-light p-6 text-center">
            <p className="font-display text-xl leading-tight">{copy.lockedTitle}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-75">{copy.lockedBody}</p>
            <button
              type="button"
              onClick={onPreOrder}
              className="t-label group relative mt-5 inline-flex w-full justify-center overflow-hidden bg-ink px-7 py-3.5 text-canvas-light"
            >
              <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">{copy.preOrderNow}</span>
            </button>
          </div>
        </Leaf>

        <Leaf id="tb-about" folio={folioOf(aboutTheAuthor.heading)}>
          <p className="mb-9 mt-3 text-center font-display text-2xl">{aboutTheAuthor.heading}</p>
          <Poured lines={aboutTheAuthor.lines} />
        </Leaf>
      </div>
    </>
  );
}

/* --- which of the two ---------------------------------------------------- */

/** True where a 6 by 9 page would have to be shrunk past reading. */
function useNarrow(): boolean {
  return useSyncExternalStore(
    (fn) => {
      const q = window.matchMedia(`(max-width: ${PAGE_W + 80}px)`);
      q.addEventListener("change", fn);
      return () => q.removeEventListener("change", fn);
    },
    () => window.matchMedia(`(max-width: ${PAGE_W + 80}px)`).matches,
    () => false
  );
}

function Paged({
  copy,
  onPreOrder,
}: {
  copy: Dictionary["novel"]["preview"];
  onPreOrder: () => void;
}) {
  // Every section that is poured rather than set by hand, in reading order.
  const poured = [...sections, aboutTheAuthor];
  const [attach, heights] = useColumnHeights();
  const sheetsFor = (id: string) => {
    const h = heights[id] ?? 0;
    return h > 0 ? Math.max(1, Math.ceil(h / CONTENT_H)) : 1;
  };

  // The folios run on from one section to the next, so the book does not
  // start again at page five three times over.
  let folio = FIRST_FOLIO;
  const opensAt: Record<string, number> = {};
  for (const section of sections) {
    opensAt[section.id] = folio;
    folio += sheetsFor(section.id);
  }

  return (
    <div className="flex flex-col items-center gap-7 px-4 py-9 sm:gap-9 sm:py-12">
      {/* Each column, set once, off the page. Every sheet is a window onto
          one of these, pulled up by a whole page at a time. */}
      <div aria-hidden style={{ height: 0, overflow: "hidden" }}>
        {poured.map((section) => (
          <div key={section.id} style={{ width: PAGE_W - PAD_X * 2 }}>
            <div ref={attach(section.id)} className="tb-flow" lang="en">
              <Flow heading={section.heading} lines={section.lines} />
            </div>
          </div>
        ))}
      </div>

      <TitlePlate />
      <ContentsPlate label={copy.contents} />
      {sections.map((section) => (
        <Sheets
          key={section.id}
          heading={section.heading}
          running={section.running}
          lines={section.lines}
          folio={opensAt[section.id]}
          pages={sheetsFor(section.id)}
        />
      ))}
      <LockedPlate copy={copy} onPreOrder={onPreOrder} />
      <Sheets
        heading={aboutTheAuthor.heading}
        running={aboutTheAuthor.running}
        lines={aboutTheAuthor.lines}
        folio={contents[contents.length - 1].page}
        pages={sheetsFor(aboutTheAuthor.id)}
      />
    </div>
  );
}

/* --- the cover, and the dialog behind it -------------------------------- */

/** An open book, drawn small: the one mark that says what the button does. */
function OpenBook() {
  return (
    <svg viewBox="0 0 20 16" className="h-4 w-4 shrink-0" fill="none" aria-hidden focusable="false">
      <path
        d="M10 3.6S8.2 2 5.2 2H1.6v11h3.6c3 0 4.8 1.4 4.8 1.4m0-10.8S11.8 2 14.8 2h3.6v11h-3.6c-3 0-4.8 1.4-4.8 1.4m0-10.8v10.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LookInside({
  src,
  alt,
  copy,
  closeLabel,
}: {
  src?: string | null;
  alt: string;
  copy: Dictionary["novel"]["preview"];
  closeLabel: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const narrow = useNarrow();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  function preOrder() {
    setOpen(false);
    // After the dialog has gone, or the scroll happens under a modal that
    // is still holding the page still.
    window.setTimeout(goToPurchase, 60);
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="tb-cover group relative block w-full max-w-[14rem] cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:max-w-[17rem] lg:max-w-none"
      >
        <span className="relative block overflow-hidden bg-canvas-deep shadow-[0_2px_4px_rgba(29,26,22,0.08),0_18px_30px_-12px_rgba(29,26,22,0.28),0_46px_70px_-30px_rgba(29,26,22,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5">
          {src ? (
            <Image
              src={src}
              alt={alt}
              width={529}
              height={830}
              priority
              className="h-auto w-full"
              sizes="(max-width: 1024px) 60vw, 320px"
            />
          ) : (
            <span className="block aspect-[529/830] w-full" />
          )}
          {/* Hover only. Where there is no pointer to hover with, the
              button underneath is the one that says so, and a band across
              the foot of the cover would sit on the author's name. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/85 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <OpenBook />
            <span className="t-label text-canvas-light">{copy.open}</span>
          </span>
        </span>
      </button>

      {/* And a control of its own underneath, because a picture that also
          happens to be a button is a thing people are used to being wrong
          about. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="t-label group mt-4 inline-flex w-full max-w-[14rem] items-center justify-center gap-2.5 border border-ink px-5 py-3.5 text-ink transition-colors hover:bg-ink hover:text-canvas-light sm:max-w-[17rem] lg:max-w-none"
      >
        <OpenBook />
        {copy.open}
      </button>

      <p className="mt-3.5 max-w-[17rem] text-sm leading-relaxed text-ink-faint lg:max-w-none">
        {copy.coverHint}
      </p>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        aria-label={copy.open}
        className="tb-dialog m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-canvas p-0 backdrop:bg-ink/70"
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line bg-canvas-light px-4 py-3 sm:px-7">
            <div className="min-w-0">
              <p className="eyebrow hidden text-ember sm:block">{copy.eyebrow}</p>
              <p className="truncate font-display text-lg leading-tight sm:text-xl">{copy.title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={preOrder}
                className="t-label group relative inline-flex overflow-hidden bg-ink px-4 py-2.5 text-canvas-light sm:px-5 sm:py-3"
              >
                <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">{copy.preOrderNow}</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="t-label border border-line px-4 py-3 text-ink-faint transition-colors hover:border-ink hover:text-ink"
              >
                {closeLabel}
              </button>
            </div>
          </div>

          {open && (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-canvas-deep">
              {narrow ? (
                <Leaves copy={copy} onPreOrder={preOrder} />
              ) : (
                <Paged copy={copy} onPreOrder={preOrder} />
              )}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
