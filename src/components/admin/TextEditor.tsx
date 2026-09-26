"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { saveText } from "@/app/admin/actions";
import { sharedLocale } from "@/lib/i18n/config";

type Entry = { path: string; original: string; section: string; kind: "text" | "image" };
type State = "saving" | "done" | "failed";

/**
 * Every word and every picture on the site, in a box you can change.
 *
 * Two rules make this safe to hand over. An empty box means "use what the
 * repository says", so nothing can be destroyed by clearing it — the row is
 * deleted and the file shows through again. And the English original is
 * always visible under the box, so somebody editing Turkish can see what the
 * line is for before rewriting it, and anybody can see what they have
 * changed away from.
 *
 * Pictures are the exception to the language rule: a photograph is the same
 * photograph in every language, so swapping one is filed once and shows
 * everywhere, and the box says so.
 */
export function TextEditor({
  entries,
  sections,
  edits,
  locale,
  locales,
}: {
  entries: Entry[];
  sections: string[];
  /** What is already overridden, by path. */
  edits: Record<string, string>;
  locale: string;
  locales: { code: string; label: string }[];
}) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string>(sections[0] ?? "");
  const [values, setValues] = useState<Record<string, string>>(edits);
  const [saved, setSaved] = useState<Record<string, State>>({});
  const [, start] = useTransition();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return entries.filter(
        (e) => e.original.toLowerCase().includes(q) || e.path.toLowerCase().includes(q)
      );
    }
    return entries.filter((e) => e.section === section);
  }, [entries, query, section]);

  const changed = Object.values(values).filter(Boolean).length;

  function commit(entry: Entry, value: string) {
    // A picture belongs to no language; a sentence belongs to the one open.
    const where = entry.kind === "image" ? sharedLocale : locale;
    if ((edits[entry.path] ?? "") === value.trim()) return;
    setSaved((s) => ({ ...s, [entry.path]: "saving" }));
    start(async () => {
      const res = await saveText(entry.path, where, value);
      setSaved((s) => ({ ...s, [entry.path]: res.ok ? "done" : "failed" }));
      if (res.ok) edits[entry.path] = value.trim();
    });
  }

  function set(path: string, value: string) {
    setValues((v) => ({ ...v, [path]: value }));
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end gap-4 border-b border-line pb-5">
        <div className="min-w-56 flex-1">
          <label htmlFor="q" className="t-label mb-1 block text-ink-faint">
            Search every string
          </label>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A word on the page, or a key"
            className="w-full border-0 border-b border-line bg-transparent px-0 py-2 text-base outline-none focus:border-ember"
          />
        </div>
        <div>
          <span className="t-label mb-1 block text-ink-faint">Language</span>
          <div className="flex flex-wrap gap-1.5">
            {locales.map((l) => (
              <a
                key={l.code}
                href={`/admin/text?locale=${l.code}`}
                className={`t-label border px-3 py-2 transition-colors ${
                  l.code === locale ? "border-ink bg-ink text-canvas-light" : "border-line hover:border-ink"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-faint">
        {changed === 0
          ? "Nothing changed yet. Every box is showing what the site says now."
          : `${changed} string${changed === 1 ? "" : "s"} changed in this language. Clear a box to put the original back.`}
      </p>

      {!query.trim() && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`t-label border px-3 py-2 transition-colors ${
                s === section ? "border-ink bg-ink text-canvas-light" : "border-line hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-7 space-y-6">
        {shown.length === 0 && <p className="text-sm text-ink-faint">Nothing matches that.</p>}
        {shown.map((e) => {
          const value = values[e.path] ?? "";
          const state = saved[e.path];
          const long = e.original.length > 90;
          return (
            <div key={e.path} className="border-b border-line pb-5">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={e.path} className="t-label text-ink-faint">
                  {e.path}
                </label>
                <span className="t-label text-xs">
                  {state === "saving" && <span className="text-ink-faint">saving…</span>}
                  {state === "done" && <span className="text-verdant">saved</span>}
                  {state === "failed" && <span className="text-ember">not saved</span>}
                </span>
              </div>

              {e.kind === "image" ? (
                <ImageField
                  entry={e}
                  value={value}
                  onChange={(v) => set(e.path, v)}
                  onCommit={(v) => commit(e, v)}
                />
              ) : (
                <>
                  {long ? (
                    <textarea
                      id={e.path}
                      rows={3}
                      value={value}
                      placeholder={e.original}
                      onChange={(ev) => set(e.path, ev.target.value)}
                      onBlur={(ev) => commit(e, ev.target.value)}
                      className="mt-2 w-full resize-y border border-line bg-canvas-light px-3 py-2 text-base outline-none focus:border-ember"
                    />
                  ) : (
                    <input
                      id={e.path}
                      value={value}
                      placeholder={e.original}
                      onChange={(ev) => set(e.path, ev.target.value)}
                      onBlur={(ev) => commit(e, ev.target.value)}
                      className="mt-2 w-full border border-line bg-canvas-light px-3 py-2 text-base outline-none focus:border-ember"
                    />
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                    Now: {e.original}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * One picture: what is there now, and a file to put in its place.
 *
 * Choosing a file uploads it and files the new address in the same motion,
 * because the two-step version — upload, then copy an address into a box —
 * is where somebody loses the address. The box is still there underneath for
 * a file that is already uploaded, or for a picture hosted elsewhere.
 */
function ImageField({
  entry,
  value,
  onChange,
  onCommit,
}: {
  entry: Entry;
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const showing = value || entry.original;

  async function upload(chosen: File) {
    setBusy(true);
    setProblem(null);
    try {
      const body = new FormData();
      body.append("file", chosen);
      body.append("bucket", "media");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { value?: string; error?: string };
      if (!res.ok || !data.value) {
        setProblem(data.error ?? "That did not upload.");
        return;
      }
      onChange(data.value);
      onCommit(data.value);
    } catch {
      setProblem("That did not upload.");
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center border border-line bg-canvas-light">
          {showing ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={showing} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="t-label text-xs text-ink-faint">empty</span>
          )}
        </div>

        <div className="min-w-56 flex-1">
          <input
            id={entry.path}
            value={value}
            placeholder={entry.original || "No picture here yet"}
            onChange={(ev) => onChange(ev.target.value)}
            onBlur={(ev) => onCommit(ev.target.value)}
            className="w-full border border-line bg-canvas-light px-3 py-2 text-sm outline-none focus:border-ember"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="t-label cursor-pointer border border-line px-3 py-2 transition-colors hover:border-ink">
              {busy ? "uploading…" : "Choose a file"}
              <input
                ref={file}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(ev) => {
                  const chosen = ev.target.files?.[0];
                  if (chosen) void upload(chosen);
                }}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  onCommit("");
                }}
                className="t-label text-ink-faint underline decoration-dotted hover:text-ink"
              >
                put the original back
              </button>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-faint">
            {entry.original ? `Now: ${entry.original}` : "Nothing here yet."} A picture is the same
            in every language, so this change shows in all six.
          </p>
          {problem && <p className="mt-1 text-xs text-ember">{problem}</p>}
        </div>
      </div>
    </div>
  );
}
