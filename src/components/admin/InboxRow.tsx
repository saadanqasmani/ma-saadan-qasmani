"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { getResource, humanizeStatus } from "@/lib/admin/resources";
import { updateInbox, deleteInbox, type ActionResult } from "@/app/admin/actions";
import { StatusBadge, buttonClass, formatDate } from "@/components/admin/ui";
import { FieldInput } from "@/components/admin/RecordForm";
import { formatCell } from "@/lib/admin/format";

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
  // An order is a working document; the rest of the inbox is a record of
  // what somebody sent, and is shown rather than offered up for editing.
  const editable = Boolean(resource.editable);

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
              .map((c) => {
                // Dates carry their own label. Two bare dates side by side
                // say nothing about which is which, and an empty one is
                // indistinguishable from a column that is not there at all.
                if (!c.name.includes("_at") && c.format !== "date") return formatCell(row, c);
                const when = formatDate(row[c.name] as string);
                return `${c.label}: ${when || "not yet"}`;
              })
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
          {resourceKey === "orders" && (
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Link href={`/admin/invoice/${id}`} className={buttonClass}>
                Open the invoice
              </Link>
              {row.email ? (
                <a
                  href={`mailto:${String(row.email)}`}
                  className="t-label text-azure underline-offset-4 hover:underline"
                >
                  Reply by email →
                </a>
              ) : null}
              <p className="text-xs text-ink-faint">
                Correct anything below first. The invoice is made from what is saved here.
              </p>
            </div>
          )}

          <form action={action}>
            {editable ? (
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {resource.fields.map((f) => {
                  const value = row[f.name];
                  const wide = f.type === "textarea" || f.type === "longtext";

                  if (f.readOnly) {
                    if (value === null || value === undefined || value === "") return null;
                    return (
                      <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
                        <dt className="t-label text-ink-faint">{f.label}</dt>
                        <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">
                          {formatCell(row, f)}
                        </dd>
                      </div>
                    );
                  }

                  return (
                    <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
                      <label
                        htmlFor={`${f.name}-${id}`}
                        className="t-label mb-1.5 block text-ink-faint"
                      >
                        {f.label}
                      </label>
                      {/* The id carries the row's own, or every open order
                          on the page would share one label. */}
                      <FieldInput field={f} value={value} id={`${f.name}-${id}`} />
                      {f.help && <p className="mt-1 text-xs text-ink-faint">{f.help}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {resource.fields.map((f) => {
                  const value = row[f.name];
                  if (value === null || value === undefined || value === "") return null;
                  // A zero postage or a zero discount is not a fact about the
                  // order, it is a line that was not charged. Nine of them on a
                  // record make the ones that were charged harder to find.
                  if (f.format === "money" && Number(value) === 0) return null;
                  return (
                    <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                      <dt className="t-label text-ink-faint">{f.label}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">{formatCell(row, f)}</dd>
                    </div>
                  );
                })}
              </dl>
            )}

            {!editable && row.email ? (
              <a
                href={`mailto:${String(row.email)}`}
                className="t-label mt-5 inline-block text-azure underline-offset-4 hover:underline"
              >
                Reply by email →
              </a>
            ) : null}

            <div className="mt-6 border-t border-line pt-5">
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
                  {pending ? "Saving…" : editable ? "Save changes" : "Update"}
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
            </div>
          </form>

          {/* Its own form, because a form cannot sit inside another one, and
              because deleting must never be one stray Enter away from
              saving. There is no undo, so it asks first. */}
          {resource.deletable && (
            <form
              action={deleteInbox.bind(null, resourceKey, id)}
              onSubmit={(e) => {
                if (!window.confirm(`Delete this ${resource.singular.toLowerCase()} for good? This cannot be undone.`)) {
                  e.preventDefault();
                }
              }}
              className="mt-5 border-t border-line pt-5"
            >
              <button
                type="submit"
                className="t-label text-ember underline-offset-4 hover:underline"
              >
                Delete this {resource.singular.toLowerCase()}
              </button>
            </form>
          )}
        </div>
      )}
    </li>
  );
}
