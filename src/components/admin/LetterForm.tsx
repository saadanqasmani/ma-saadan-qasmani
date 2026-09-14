"use client";

import { useActionState, useState, useTransition } from "react";
import { previewLetter, sendLetter, type LetterResult } from "@/app/admin/actions";
import { buttonClass, ghostButtonClass } from "@/components/admin/ui";

const initial: LetterResult = { ok: false };

const inputClass =
  "w-full border border-line bg-canvas-light px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="t-label mb-1.5 block font-medium text-ink-faint">
      {children}
    </label>
  );
}

export function LetterForm({
  posts,
  recipients,
  canSend,
}: {
  posts: { slug: string; title: string; date: string }[];
  recipients: number;
  canSend: boolean;
}) {
  const [state, action, pending] = useActionState(sendLetter, initial);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [slug, setSlug] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [previewing, startPreview] = useTransition();
  const [armed, setArmed] = useState(false);

  function pickPost(next: string) {
    setSlug(next);
    const post = posts.find((p) => p.slug === next);
    if (post && !subject.trim()) setSubject(post.title);
  }

  function preview() {
    startPreview(async () => {
      const fd = new FormData();
      fd.set("subject", subject);
      fd.set("body", body);
      fd.set("post_slug", slug);
      const res = await previewLetter(fd);
      setHtml(res.html ?? `<p style="font-family:sans-serif;padding:24px">${res.message ?? "Could not build the preview."}</p>`);
    });
  }

  const ready = subject.trim().length > 0 && (body.trim().length > 0 || slug);

  return (
    <form action={action} className="mt-10 space-y-7" onSubmit={() => setArmed(false)}>
      <div>
        <Label htmlFor="post_slug">About a journal note (optional)</Label>
        <select id="post_slug" name="post_slug" value={slug} onChange={(e) => pickPost(e.target.value)} className={inputClass}>
          <option value="">No, a letter on its own</option>
          {posts.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} ({p.date})
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-ink-faint">
          Picking a note adds its title, its first two paragraphs, a link to the rest, and the journal code, under whatever you write.
        </p>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <input id="subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} required />
      </div>

      <div>
        <Label htmlFor="body">{slug ? "A few lines above the note (optional)" : "The letter"}</Label>
        <textarea
          id="body"
          name="body"
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={`${inputClass} font-serif text-base leading-relaxed`}
          placeholder={"Plain text. A blank line starts a new paragraph."}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={preview} disabled={!ready || previewing} className={ghostButtonClass}>
          {previewing ? "Building" : "Preview"}
        </button>
        <button type="submit" name="mode" value="test" disabled={!ready || pending || !canSend} className={ghostButtonClass}>
          Send me a copy
        </button>
        {!armed ? (
          <button type="button" onClick={() => setArmed(true)} disabled={!ready || pending || !canSend || recipients === 0} className={buttonClass}>
            Send to {recipients} {recipients === 1 ? "person" : "people"}
          </button>
        ) : (
          <span className="flex items-center gap-3">
            <span className="text-sm text-ink-soft">This goes to everyone. Sure?</span>
            <button type="submit" name="mode" value="all" disabled={pending} className={buttonClass}>
              {pending ? "Sending" : "Yes, send it"}
            </button>
            <button type="button" onClick={() => setArmed(false)} className="t-label text-ink-faint hover:text-ink">
              No
            </button>
          </span>
        )}
      </div>

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-verdant" : "text-ember"}`} role="status">
          {state.message}
        </p>
      )}

      {html !== null && (
        <div>
          <p className="eyebrow">As they will see it</p>
          <iframe title="Preview" srcDoc={html} sandbox="" className="mt-4 h-[720px] w-full border border-line bg-canvas-light" />
        </div>
      )}
    </form>
  );
}
