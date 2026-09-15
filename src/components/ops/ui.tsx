"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Persona } from "@/lib/ops/model";

/* ---- avatars -------------------------------------------------------- */

export function Avatar({ who, size }: { who: Persona; size?: "lg" }) {
  return (
    <span className={`avatar avatar--${who}${size ? ` avatar--${size}` : ""}`} aria-hidden>
      {who === "osman" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/osman-face.png" alt="" />
      ) : (
        "S"
      )}
    </span>
  );
}

export function nameOf(who: Persona): string {
  return who === "osman" ? "Osman" : "Saadan";
}

/* ---- confirm-in-place ------------------------------------------------ */

/**
 * A destructive button that asks once, right where it is, rather than in a
 * browser dialog. The first press turns it into a question; the second
 * press is the answer. It resets itself if left alone.
 */
export function Confirm({
  label,
  question = "Sure?",
  onYes,
  className = "btn btn--danger btn--sm",
}: {
  label: ReactNode;
  question?: string;
  onYes: () => void;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!asking) return;
    const t = setTimeout(() => setAsking(false), 3500);
    return () => clearTimeout(t);
  }, [asking]);
  if (asking) {
    return (
      <span className="row" style={{ gap: 6 }}>
        <span className="small muted">{question}</span>
        <button type="button" className="btn btn--sm btn--danger" onClick={onYes}>
          Yes
        </button>
        <button type="button" className="btn btn--sm btn--quiet" onClick={() => setAsking(false)}>
          No
        </button>
      </span>
    );
  }
  return (
    <button type="button" className={className} onClick={() => setAsking(true)}>
      {label}
    </button>
  );
}

/* ---- textarea that grows ----------------------------------------- */

export function AutoArea({
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  ariaLabel,
  className = "field field--area",
  rows = 1,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const n = ref.current;
    if (!n) return;
    n.style.height = "auto";
    n.style.height = `${n.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
    />
  );
}

/* ---- a field that saves when you leave it ------------------------- */

/**
 * The editing model for everything on a card: type into the thing itself,
 * and it is saved the moment you leave it or press Enter. Nothing to open,
 * nothing to submit, no separate edit mode to find.
 */
export function Inline({
  value,
  onSave,
  placeholder,
  title = false,
  multiline = false,
  ariaLabel,
}: {
  value: string;
  onSave: (v: string) => void;
  placeholder?: string;
  title?: boolean;
  multiline?: boolean;
  ariaLabel: string;
}) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const shown = editing ? draft : value;

  function commit() {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  }

  const cls = `field field--inline${title ? " field--title" : ""}${multiline ? " field--desc" : ""}`;
  // Titles wrap like text rather than scrolling like a form field, so they
  // are textareas too; Enter still means "done".
  if (multiline || title) {
    return (
      <AutoArea
        value={shown}
        placeholder={placeholder}
        className={cls}
        ariaLabel={ariaLabel}
        onChange={(v) => {
          setEditing(true);
          setDraft(v.replace(/\n/g, multiline ? "\n" : ""));
        }}
        onBlur={commit}
        onKeyDown={
          multiline
            ? undefined
            : (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).blur();
                }
                if (e.key === "Escape") {
                  setDraft(value);
                  setEditing(false);
                  (e.target as HTMLTextAreaElement).blur();
                }
              }
        }
      />
    );
  }
  return (
    <input
      value={shown}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cls}
      onFocus={() => {
        setDraft(value);
        setEditing(true);
      }}
      onChange={(e) => {
        setEditing(true);
        setDraft(e.target.value);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}

/* ---- segmented control ---------------------------------------------- */

export function Seg<T extends string>({
  value,
  options,
  onChange,
  tone,
  ariaLabel,
}: {
  value: T;
  options: { id: T; label: string; tone?: "blue" | "yellow" | "coral" }[];
  onChange: (v: T) => void;
  tone?: "blue" | "yellow" | "coral";
  ariaLabel: string;
}) {
  return (
    <div className="seg" role="radiogroup" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          className="seg__opt"
          data-on={o.id === value}
          data-tone={o.tone ?? tone}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---- sheet (modal) ------------------------------------------------------- */

export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const n = ref.current;
    if (!n) return;
    if (open && !n.open) n.showModal();
    if (!open && n.open) n.close();
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="sheet__body">{children}</div>
    </dialog>
  );
}

/* ---- toasts and confetti ---------------------------------------------- */

type Toast = { id: number; text: string; tone?: "gold" | "blue"; action?: { label: string; run: () => void } };

type Celebrate = {
  toast: (text: string, opts?: { tone?: "gold" | "blue"; action?: { label: string; run: () => void } }) => void;
  burst: (x?: number, y?: number) => void;
};

const CelebrateCtx = createContext<Celebrate>({ toast: () => {}, burst: () => {} });
export const useCelebrate = () => useContext(CelebrateCtx);

export function CelebrateProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const canvas = useRef<HTMLCanvasElement>(null);

  const toast = useCallback<Celebrate["toast"]>((text, opts) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((t) => [...t.slice(-3), { id, text, ...opts }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts?.action ? 7000 : 3600);
  }, []);

  const burst = useCallback((x?: number, y?: number) => {
    const c = canvas.current;
    if (!c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ox = x ?? c.width / 2;
    const oy = y ?? c.height * 0.4;
    const colors = ["#ffd400", "#2563ff", "#ffffff", "#f2b800", "#dbe6ff"];
    const bits = Array.from({ length: 110 }, () => ({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 12 - 4,
      r: Math.random() * 6 + 3,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * Math.PI,
      s: Math.random() * 0.3 - 0.15,
    }));
    let frame = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, c!.width, c!.height);
      bits.forEach((b) => {
        b.vy += 0.35;
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.99;
        b.a += b.s;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.a);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.r / 2, -b.r / 2, b.r, b.r * 0.6);
        ctx.restore();
      });
      frame += 1;
      if (frame < 110) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, c!.width, c!.height);
    }
    requestAnimationFrame(draw);
  }, []);

  const value = useMemo(() => ({ toast, burst }), [toast, burst]);

  return (
    <CelebrateCtx.Provider value={value}>
      {children}
      <canvas ref={canvas} className="confetti" aria-hidden />
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast" data-tone={t.tone}>
            <span>{t.text}</span>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.run();
                  setToasts((all) => all.filter((x) => x.id !== t.id));
                }}
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </CelebrateCtx.Provider>
  );
}

/* ---- upload ---------------------------------------------------------------- */

export type Uploaded = { path: string; name: string; size: number; type: string };

/**
 * A file in, a private path out. A pasted link works too, for the day the
 * storage is not connected or the thing already lives in Drive.
 */
export function Upload({ onDone, label = "Drop a file here, or tap to choose" }: { onDone: (u: Uploaded) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [link, setLink] = useState("");

  async function send(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/ops/upload", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as Partial<Uploaded> & { error?: string };
      if (!res.ok || !json.path) throw new Error(json.error || "Upload failed.");
      onDone({ path: json.path, name: json.name ?? file.name, size: json.size ?? file.size, type: json.type ?? file.type });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function addLink() {
    const url = link.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Paste a full link, starting with https://");
      return;
    }
    let name = url;
    try {
      name = new URL(url).hostname.replace(/^www\./, "") + " link";
    } catch {
      // Name stays as the URL.
    }
    onDone({ path: url, name, size: 0, type: "link" });
    setLink("");
    setError(null);
  }

  return (
    <div className="stack stack--tight">
      <label
        className="dropzone"
        data-over={over}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void send(f);
        }}
      >
        <input
          ref={input}
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void send(f);
            e.target.value = "";
          }}
        />
        {busy ? (
          <span className="row" style={{ justifyContent: "center" }}>
            <span className="spin" /> Uploading
          </span>
        ) : (
          <span className="small">{label}</span>
        )}
      </label>
      <div className="row">
        <input
          className="field grow"
          placeholder="or paste a link (Drive, Docs, anything)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLink();
            }
          }}
        />
        <button type="button" className="btn btn--sm" onClick={addLink} disabled={!link.trim()}>
          Add link
        </button>
      </div>
      {error && <p className="hint hint--bad">{error}</p>}
    </div>
  );
}

export function fileHref(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `/api/ops/file?path=${encodeURIComponent(path)}`;
}

export function fileKind(name: string, type: string): string {
  if (type === "link") return "link";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext.length <= 4 && ext) return ext;
  return type.split("/")[1]?.slice(0, 4) || "file";
}

export function FileRow({ name, path, type, note, right }: { name: string; path: string; type: string; note?: string; right?: ReactNode }) {
  return (
    <div className="file">
      <span className="file__i">{fileKind(name, type)}</span>
      <div className="grow" style={{ minWidth: 0 }}>
        <a href={fileHref(path)} target="_blank" rel="noopener noreferrer" className="file__n" style={{ display: "block" }}>
          {name}
        </a>
        {note && <p className="small muted">{note}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---- handing work to a chat ------------------------------------------ */

/**
 * Copies text, and says it did.
 *
 * The desk is behind a cookie, so nothing outside it can read the board.
 * This is the way across: the state written out as words, on the clipboard,
 * ready to paste into a conversation.
 */
export function CopyForClaude({
  text,
  label = "Copy for Claude",
  className = "btn btn--sm btn--ghost",
}: {
  text: () => string;
  label?: string;
  className?: string;
}) {
  const { toast } = useCelebrate();
  const [done, setDone] = useState(false);

  async function copy() {
    const body = text();
    try {
      await navigator.clipboard.writeText(body);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
      toast("Copied. Paste it into a Claude chat.", { tone: "blue" });
    } catch {
      // Clipboard permission can be refused, and a button that silently
      // does nothing is worse than one that hands over the text.
      toast("Could not reach the clipboard. Use Download instead.");
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {done ? "Copied" : label}
    </button>
  );
}

/** The same text as a file, for attaching to a Claude project. */
export function DownloadBrief({ text, filename }: { text: () => string; filename: string }) {
  function save() {
    const blob = new Blob([text()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button type="button" className="btn btn--sm btn--ghost" onClick={save}>
      Download
    </button>
  );
}

/* ---- little pieces --------------------------------------------------- */

export function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path d="M2.5 5l4.5 4.5L11.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function whenLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function Empty({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="g empty">
      <p className="h2">{title}</p>
      {body && <p className="small">{body}</p>}
      {children}
    </div>
  );
}
