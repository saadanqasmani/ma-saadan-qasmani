"use client";

import { useActionState, useState } from "react";
import { getResource, humanizeStatus } from "@/lib/admin/resources";
import { updateInbox, type ActionResult } from "@/app/admin/actions";
import { StatusBadge, buttonClass, formatDate } from "@/components/admin/ui";

const initial: ActionResult = { ok: false };

export function InboxRow({
  resourceKey,
  row,
}: {
  resourceKey: string;
  row: Record<string, unknown>;
}) {
  const resource = getResource(resourceKey);
  const [open, setOpen] = useState(false);
  const id = String(row.id);
  const [state, action, pending] = useActionState(
    updateInbox.bind(null, resourceKey, id),
    initial
  );

  if (!resource) return null;

  const status = String(row[resource.statusField ?? ""] ?? "");
  const title = String(row[resource.titleField] ?? "Untitled");

  return (
    <li className="border border-line bg-canvas">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate font-serif text-lg">{title}</span>
          <span className="mt-0.5 block text-xs text-ink-faint">
            {resource.listColumns
              .filter((c) => c.name !== resource.titleField && c.name !== resource.statusField)
              .map((c) =>
                c.name.includes("_at")
                  ? formatDate(row[c.name] as string)
                  : String(row[c.name] ?? "")
              )
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {status && <StatusBadge value={status} />}
          <span className={`text-ink-faint transition-transform ${open ? "rotate-45" : ""}`}>
            +
          </span>
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-5 py-5">
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {resource.fields.map((f) => {
              const value = row[f.name];
              if (value === null || value === undefined || value === "") return null;
              return (
                <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <dt className="t-label text-ink-faint">
                    {f.label}
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">{String(value)}</dd>
                </div>
              );
            })}
          </dl>

          {row.email ? (
            <a
              href={`mailto:${String(row.email)}`}
              className="t-label mt-5 inline-block text-azure underline-offset-4 hover:underline"
            >
              Reply by email →
            </a>
          ) : null}

          <form action={action} className="mt-6 border-t border-line pt-5">
            <div className="flex flex-wrap items-end gap-4">
              {resource.statusOptions && (
                <div>
                  <label
                    htmlFor={`status-${id}`}
                    className="t-label mb-1 block text-ink-faint"
                  >
                    Status
                  </label>
                  <select
                    id={`status-${id}`}
                    name="status"
                    defaultValue={status}
                    className="border border-line bg-canvas-light px-3 py-2 text-sm"
                  >
                    {resource.statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {humanizeStatus(s)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button type="submit" disabled={pending} className={buttonClass}>
                {pending ? "Saving…" : "Update"}
              </button>
              {state.message && (
                <span className={`text-sm ${state.ok ? "text-verdant" : "text-ember"}`}>
                  {state.message}
                </span>
              )}
            </div>

            {resource.notesField && (
              <div className="mt-4">
                <label
                  htmlFor={`notes-${id}`}
                  className="t-label mb-1 block text-ink-faint"
                >
                  Private notes (never shown to the sender)
                </label>
                <textarea
                  id={`notes-${id}`}
                  name="notes"
                  defaultValue={String(row[resource.notesField] ?? "")}
                  className="min-h-20 w-full border border-line bg-canvas-light px-3 py-2 text-sm"
                />
              </div>
            )}
          </form>
        </div>
      )}
    </li>
  );
}
