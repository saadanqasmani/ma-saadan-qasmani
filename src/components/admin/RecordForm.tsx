"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveRecord, deleteRecord, type ActionResult } from "@/app/admin/actions";
import type { Field, Resource } from "@/lib/admin/resources";
import { buttonClass, ghostButtonClass } from "@/components/admin/ui";
import { FilePicker } from "@/components/admin/FilePicker";

const initial: ActionResult = { ok: false };

const inputClass =
  "w-full border border-line bg-canvas-light px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

function FieldInput({ field, value }: { field: Field; value: unknown }) {
  const id = field.name;
  const common = { id, name: field.name, className: inputClass };

  switch (field.type) {
    case "boolean":
      return (
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            id={id}
            name={field.name}
            defaultChecked={Boolean(value)}
            className="h-4 w-4 accent-[color:var(--ink)]"
          />
          <span>{field.label}</span>
        </label>
      );
    case "longtext":
      return <textarea {...common} defaultValue={String(value ?? "")} rows={12} />;
    case "textarea":
      return <textarea {...common} defaultValue={String(value ?? "")} rows={4} />;
    case "select":
      return (
        <select {...common} defaultValue={String(value ?? "")}>
          <option value="">Not set</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "tags":
      return (
        <input
          {...common}
          type="text"
          defaultValue={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
          placeholder="Separate with commas"
        />
      );
    case "number":
      return <input {...common} type="number" defaultValue={value === null ? "" : String(value ?? "")} />;
    case "date":
      return (
        <input
          {...common}
          type="date"
          defaultValue={value ? String(value).slice(0, 10) : ""}
        />
      );
    case "image":
      return (
        <FilePicker
          name={field.name}
          bucket={field.bucket ?? "media"}
          defaultValue={value ? String(value) : ""}
        />
      );
    case "url":
      return <input {...common} type="url" defaultValue={String(value ?? "")} placeholder="https://" />;
    default:
      return <input {...common} type="text" defaultValue={String(value ?? "")} />;
  }
}

export function RecordForm({
  resource,
  record,
}: {
  resource: Resource;
  record: Record<string, unknown> | null;
}) {
  const id = record ? String(record.id) : null;
  const [state, action, pending] = useActionState(
    saveRecord.bind(null, resource.key, id),
    initial
  );

  return (
    <>
      <form action={action} className="mt-10 max-w-2xl space-y-7">
        {resource.fields.map((field) => (
          <div key={field.name}>
            {field.type !== "boolean" && (
              <label
                htmlFor={field.name}
                className="t-label mb-1.5 block font-medium text-ink-faint"
              >
                {field.label}
                {field.required && <span className="text-ember"> *</span>}
              </label>
            )}
            <FieldInput field={field} value={record?.[field.name]} />
            {field.help && <p className="mt-1.5 text-xs text-ink-faint">{field.help}</p>}
          </div>
        ))}

        {state.message && !state.ok && <p className="text-sm text-ember">{state.message}</p>}

        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-7">
          <button type="submit" disabled={pending} className={buttonClass}>
            {pending ? "Saving…" : "Save"}
          </button>
          <Link href={`/admin/${resource.key}`} className={ghostButtonClass}>
            Cancel
          </Link>
        </div>
      </form>

      {id && (
        <form
          action={deleteRecord.bind(null, resource.key, id)}
          className="mt-10 max-w-2xl border-t border-line pt-7"
        >
          <button
            type="submit"
            className="t-label text-ember underline-offset-4 hover:underline"
          >
            Delete this {resource.singular.toLowerCase()}
          </button>
          <p className="mt-1.5 text-xs text-ink-faint">This cannot be undone.</p>
        </form>
      )}
    </>
  );
}
