"use client";

import { useActionState, useState } from "react";
import { saveSiteSettings, saveBookSettings, type ActionResult } from "@/app/admin/actions";
import { buttonClass } from "@/components/admin/ui";
import { FilePicker } from "@/components/admin/FilePicker";

const initial: ActionResult = { ok: false };

const inputClass =
  "w-full border border-line bg-canvas-light px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="t-label mb-1.5 block font-medium text-ink-faint"
    >
      {children}
    </label>
  );
}

type Pair = Record<string, string>;

/** A repeating group of two-field rows (roles, things founded, honours). */
function Repeater({
  legend,
  rows,
  fields,
  onChange,
}: {
  legend: string;
  rows: Pair[];
  fields: { name: string; label: string; key: string }[];
  onChange: (rows: Pair[]) => void;
}) {
  return (
    <fieldset className="border border-line p-5">
      <legend className="t-label px-2 font-medium text-ink-faint">
        {legend}
      </legend>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3">
            {fields.map((f) => (
              <input
                key={f.name}
                type="text"
                name={f.name}
                placeholder={f.label}
                value={row[f.key] ?? ""}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...next[i], [f.key]: e.target.value };
                  onChange(next);
                }}
                className={`${inputClass} min-w-40 flex-1`}
              />
            ))}
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
              aria-label="Remove"
              className="px-2 text-lg text-ink-faint hover:text-ember"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...rows, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
        className="t-label mt-4 text-ink-soft underline-offset-4 hover:text-ink hover:underline"
      >
        + Add row
      </button>
    </fieldset>
  );
}

export function SiteSettingsForm({ settings }: { settings: Record<string, unknown> }) {
  const [state, action, pending] = useActionState(saveSiteSettings, initial);
  const [roles, setRoles] = useState<Pair[]>(
    (settings.roles as Pair[])?.length ? (settings.roles as Pair[]) : [{ title: "", org: "" }]
  );
  const [founded, setFounded] = useState<Pair[]>(
    (settings.founded as Pair[])?.length ? (settings.founded as Pair[]) : [{ name: "", org: "" }]
  );
  const [honors, setHonors] = useState<Pair[]>(
    (settings.honors as Pair[])?.length ? (settings.honors as Pair[]) : [{ title: "", year: "" }]
  );

  const v = (k: string) => String(settings[k] ?? "");

  return (
    <form action={action} className="mt-10 max-w-2xl space-y-7">
      <div>
        <Label htmlFor="name">Name</Label>
        <input id="name" name="name" defaultValue={v("name")} className={inputClass} />
      </div>
      <div>
        <Label htmlFor="positioning">Line under your name</Label>
        <input
          id="positioning"
          name="positioning"
          defaultValue={v("positioning")}
          className={inputClass}
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <input id="location" name="location" defaultValue={v("location")} className={inputClass} />
      </div>
      <div>
        <Label htmlFor="bio">Biography</Label>
        <textarea id="bio" name="bio" rows={9} defaultValue={v("bio")} className={inputClass} />
        <p className="mt-1.5 text-xs text-ink-faint">
          Shown on the homepage and the About page.
        </p>
      </div>
      <div>
        <Label htmlFor="practitioner_note">Practice note</Label>
        <textarea
          id="practitioner_note"
          name="practitioner_note"
          rows={4}
          defaultValue={v("practitioner_note")}
          className={inputClass}
        />
      </div>
      <div>
        <Label htmlFor="portrait_path">Portrait</Label>
        <FilePicker name="portrait_path" bucket="media" defaultValue={v("portrait_path")} />
      </div>

      <Repeater
        legend="Current roles"
        rows={roles}
        onChange={setRoles}
        fields={[
          { name: "role_title", label: "Role", key: "title" },
          { name: "role_org", label: "Organisation", key: "org" },
        ]}
      />
      <Repeater
        legend="Founded"
        rows={founded}
        onChange={setFounded}
        fields={[
          { name: "founded_name", label: "Name", key: "name" },
          { name: "founded_org", label: "Where", key: "org" },
        ]}
      />
      <Repeater
        legend="Recognition"
        rows={honors}
        onChange={setHonors}
        fields={[
          { name: "honor_title", label: "Award", key: "title" },
          { name: "honor_year", label: "Year", key: "year" },
        ]}
      />

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-verdant" : "text-ember"}`}>{state.message}</p>
      )}

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

export function BookSettingsForm({ book }: { book: Record<string, unknown> }) {
  const [state, action, pending] = useActionState(saveBookSettings, initial);
  const v = (k: string) => String(book[k] ?? "");

  return (
    <form action={action} className="mt-10 max-w-2xl space-y-7">
      <div>
        <Label htmlFor="title">Title</Label>
        <input id="title" name="title" defaultValue={v("title")} className={inputClass} />
      </div>
      <div>
        <Label htmlFor="synopsis">Synopsis</Label>
        <textarea
          id="synopsis"
          name="synopsis"
          rows={6}
          defaultValue={v("synopsis")}
          className={inputClass}
        />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <textarea
          id="subject"
          name="subject"
          rows={3}
          defaultValue={v("subject")}
          className={inputClass}
        />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <input id="genre" name="genre" defaultValue={v("genre")} className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="chapter_count">Chapters</Label>
          <input
            id="chapter_count"
            name="chapter_count"
            type="number"
            defaultValue={v("chapter_count")}
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="word_count">Words</Label>
          <input
            id="word_count"
            name="word_count"
            type="number"
            defaultValue={v("word_count")}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Publication status</Label>
        <textarea
          id="status"
          name="status"
          rows={2}
          defaultValue={v("status")}
          className={inputClass}
        />
      </div>
      <div>
        <Label htmlFor="cover_image_path">Cover</Label>
        <FilePicker name="cover_image_path" bucket="media" defaultValue={v("cover_image_path")} />
      </div>
      <div>
        <Label htmlFor="amazon_url">Amazon link</Label>
        <input
          id="amazon_url"
          name="amazon_url"
          type="url"
          placeholder="https://"
          defaultValue={v("amazon_url")}
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-ink-faint">
          Leave empty and the site says the link is coming, rather than showing a dead button.
        </p>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="direct_order_enabled"
          defaultChecked={Boolean(book.direct_order_enabled ?? true)}
          className="h-4 w-4 accent-[color:var(--ink)]"
        />
        <span>Accept direct orders from Türkiye and Pakistan</span>
      </label>

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-verdant" : "text-ember"}`}>{state.message}</p>
      )}

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
