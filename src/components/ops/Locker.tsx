"use client";

import { useState } from "react";
import {
  PART_ROLES,
  PIECE_KINDS,
  newId,
  partRoleMeta,
  partsByRole,
  pieceKindMeta,
  type Comment,
  type Part,
  type PartRole,
  type Persona,
  type Piece,
  type PieceKind,
} from "@/lib/ops/model";
import { removePiece, upsertPiece, useOps } from "@/lib/ops/store";
import { Thread } from "./TaskCard";
import { Avatar, Confirm, Empty, FileRow, Seg, Sheet, Upload, nameOf, useCelebrate, whenLabel } from "./ui";

/**
 * The locker: work that is finished, filed whole.
 *
 * A shelf holds loose things, each read on its own. A finished course is not
 * loose — the guidebook, the description and the slides only mean anything
 * together, and filing them as three unrelated items is how you spend an
 * afternoon two terms later looking for the slides.
 *
 * So a piece is one card with its parts named by the job they do, and the
 * books it was built from are pointed at rather than copied, because they
 * are already on a shelf and a book should be one book.
 */
export function LockerView({ who }: { who: Persona }) {
  const { state } = useOps();
  const [adding, setAdding] = useState(false);

  return (
    <div className="stack">
      <div className="row row--between">
        <p className="muted small">
          {state.pieces.length} finished piece{state.pieces.length === 1 ? "" : "s"}
        </p>
        {!adding && (
          <button type="button" className="btn btn--primary" onClick={() => setAdding(true)}>
            + File finished work
          </button>
        )}
      </div>

      {adding && <PieceForm who={who} onDone={() => setAdding(false)} />}

      {state.pieces.length === 0 && !adding && (
        <Empty
          title="The locker is empty"
          body="A course, a syllabus, a paper: file it once with its guidebook, its description and its slides, and it is never hunted for again."
        >
          <button type="button" className="btn btn--yellow" onClick={() => setAdding(true)}>
            File the first one
          </button>
        </Empty>
      )}

      <div className="stack stagger">
        {state.pieces.map((p) => (
          <PieceCard key={p.id} piece={p} who={who} />
        ))}
      </div>
    </div>
  );
}

/* ---- filing a piece ---------------------------------------------------- */

function PieceForm({ who, piece, onDone }: { who: Persona; piece?: Piece; onDone: () => void }) {
  const [title, setTitle] = useState(piece?.title ?? "");
  const [kind, setKind] = useState<PieceKind>(piece?.kind ?? "course");
  const [finished, setFinished] = useState(piece?.finished ?? "");
  const [note, setNote] = useState(piece?.note ?? "");
  const { toast, burst } = useCelebrate();

  function save(e: React.FormEvent) {
    e.preventDefault();
    const named = title.trim();
    if (!named) return;
    upsertPiece({
      id: piece?.id ?? newId("piece"),
      title: named,
      kind,
      finished: finished.trim(),
      note: note.trim(),
      by: piece?.by ?? who,
      at: piece?.at ?? new Date().toISOString(),
      builtFrom: piece?.builtFrom ?? [],
      parts: piece?.parts ?? [],
      comments: piece?.comments ?? [],
    });
    if (!piece) burst();
    toast(piece ? "Saved." : `“${named}” is in the locker. Add its parts.`, { tone: "gold" });
    onDone();
  }

  return (
    <form onSubmit={save} className="g g--pop stack">
      <h2 className="h2">{piece ? "Edit the record" : "File finished work"}</h2>
      <Seg<PieceKind>
        ariaLabel="What kind of work"
        value={kind}
        onChange={setKind}
        options={PIECE_KINDS.map((k) => ({ id: k.id, label: k.label }))}
      />
      <label className="fieldset">
        <span className="label">What is it called</span>
        <input
          className="field"
          autoFocus
          placeholder="Peace & Diplomacy, 14 weeks"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label className="fieldset">
        <span className="label">Finished</span>
        <input
          className="field"
          placeholder="Spring 2026, March, whenever it was"
          value={finished}
          onChange={(e) => setFinished(e.target.value)}
        />
      </label>
      <label className="fieldset">
        <span className="label">A line about it</span>
        <input
          className="field"
          placeholder="Who it is for and what it does"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <div className="row row--end">
        <button type="button" className="btn btn--quiet" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!title.trim()}>
          {piece ? "Save" : "Put it in"}
        </button>
      </div>
    </form>
  );
}

/* ---- a piece, opened --------------------------------------------------- */

function PieceCard({ piece, who }: { piece: Piece; who: Persona }) {
  const { state } = useOps();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addingTo, setAddingTo] = useState<PartRole | null>(null);
  const [picking, setPicking] = useState(false);
  const [notes, setNotes] = useState(false);
  const kind = pieceKindMeta(piece.kind);
  const cited = piece.builtFrom
    .map((id) => state.books.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  if (editing) return <PieceForm who={who} piece={piece} onDone={() => setEditing(false)} />;

  function addPart(role: PartRole, p: { path?: string; name: string; type?: string; url?: string }) {
    const part: Part = {
      id: newId("part"),
      role,
      name: p.name,
      path: p.path ?? "",
      fileType: p.type ?? "",
      url: p.url ?? "",
      by: who,
      at: new Date().toISOString(),
    };
    upsertPiece({ ...piece, parts: [...piece.parts, part] });
    setAddingTo(null);
  }

  function dropPart(id: string) {
    upsertPiece({ ...piece, parts: piece.parts.filter((p) => p.id !== id) });
  }

  function post(text: string) {
    const c: Comment = { by: who, at: new Date().toISOString(), text };
    upsertPiece({ ...piece, comments: [...piece.comments, c] });
  }

  return (
    <div className="piece">
      <button type="button" className="piece__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="piece__k">{kind.label}</span>
        <span className="grow" style={{ minWidth: 0, textAlign: "left" }}>
          <span className="piece__t">{piece.title}</span>
          <span className="piece__m">
            {[piece.finished, `${piece.parts.length} part${piece.parts.length === 1 ? "" : "s"}`, nameOf(piece.by)]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
        <Avatar who={piece.by} />
      </button>

      {open && (
        <div className="piece__body stack stack--tight">
          {piece.note && <p className="small" style={{ color: "var(--ink-soft)" }}>{piece.note}</p>}

          {PART_ROLES.map((role) => {
            const parts = partsByRole(piece, role.id);
            if (parts.length === 0 && addingTo !== role.id) {
              return (
                <div key={role.id} className="piece__row piece__row--empty">
                  <span className="label">{role.label}</span>
                  <button type="button" className="btn btn--sm btn--quiet" onClick={() => setAddingTo(role.id)}>
                    + Add
                  </button>
                </div>
              );
            }
            return (
              <div key={role.id} className="piece__row">
                <div className="row row--between">
                  <span className="label">{role.label}</span>
                  {addingTo !== role.id && (
                    <button type="button" className="btn btn--sm btn--quiet" onClick={() => setAddingTo(role.id)}>
                      + Add
                    </button>
                  )}
                </div>
                {parts.map((part) => (
                  <PartRow key={part.id} part={part} onRemove={() => dropPart(part.id)} />
                ))}
                {addingTo === role.id && (
                  <PartForm role={role.id} onAdd={addPart} onCancel={() => setAddingTo(null)} />
                )}
              </div>
            );
          })}

          {/* The books it came out of. Pointed at, not copied: they are on a
              shelf already and one book should stay one book. */}
          <div className="piece__row">
            <div className="row row--between">
              <span className="label">Built from</span>
              <button type="button" className="btn btn--sm btn--quiet" onClick={() => setPicking(true)}>
                {cited.length > 0 ? "Change" : "+ Pick from the shelves"}
              </button>
            </div>
            {cited.length === 0 ? (
              <p className="hint">Nothing cited yet.</p>
            ) : (
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                {cited.map((b) => (
                  <span key={b.id} className="chip">
                    {b.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="row row--between">
            <button type="button" className="btn btn--sm btn--quiet" onClick={() => setNotes(!notes)}>
              {notes ? "Hide notes" : piece.comments.length > 0 ? `Notes (${piece.comments.length})` : "Add a note"}
            </button>
            {piece.by === who && (
              <span className="row" style={{ gap: 8 }}>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => setEditing(true)}>
                  Edit
                </button>
                <Confirm
                  label="Take it out"
                  question={`Take “${piece.title}” out of the locker?`}
                  onYes={() => removePiece(piece.id)}
                />
              </span>
            )}
          </div>

          {notes && <Thread comments={piece.comments} who={who} onPost={post} />}
        </div>
      )}

      <BookPicker
        open={picking}
        onClose={() => setPicking(false)}
        chosen={piece.builtFrom}
        onToggle={(id) =>
          upsertPiece({
            ...piece,
            builtFrom: piece.builtFrom.includes(id)
              ? piece.builtFrom.filter((x) => x !== id)
              : [...piece.builtFrom, id],
          })
        }
      />
    </div>
  );
}

function PartRow({ part, onRemove }: { part: Part; onRemove: () => void }) {
  const remove = (
    <Confirm label="Remove" question="Remove this part?" onYes={onRemove} />
  );
  if (part.path) {
    return <FileRow name={part.name} path={part.path} type={part.fileType} right={remove} />;
  }
  return (
    <div className="file">
      <span className="file__i" aria-hidden>
        ↗
      </span>
      <div className="grow" style={{ minWidth: 0 }}>
        <a href={part.url} target="_blank" rel="noopener noreferrer" className="file__n" style={{ display: "block" }}>
          {part.name || part.url}
        </a>
        <p className="small muted">
          {nameOf(part.by)} · {whenLabel(part.at)}
        </p>
      </div>
      {remove}
    </div>
  );
}

function PartForm({
  role,
  onAdd,
  onCancel,
}: {
  role: PartRole;
  onAdd: (role: PartRole, p: { path?: string; name: string; type?: string; url?: string }) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const meta = partRoleMeta(role);

  return (
    <div className="g g--pop stack stack--tight" style={{ padding: 14 }}>
      <span className="hint">{meta.hint}</span>
      <Upload onDone={(u) => onAdd(role, u)} label="Drop the file here, or tap to choose" />
      <div className="row row--nowrap">
        <input
          className="field grow"
          placeholder="Or paste a link"
          value={url}
          inputMode="url"
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="field"
          style={{ maxWidth: 150 }}
          placeholder="Call it"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button
          type="button"
          className="btn btn--sm btn--primary"
          disabled={!url.trim()}
          onClick={() => onAdd(role, { name: label.trim() || url.trim(), url: url.trim() })}
        >
          Add
        </button>
      </div>
      <div className="row row--end">
        <button type="button" className="btn btn--sm btn--quiet" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Tick the books, on either man's shelves, that this was built out of. */
function BookPicker({
  open,
  onClose,
  chosen,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  chosen: string[];
  onToggle: (id: string) => void;
}) {
  const { state } = useOps();
  const [q, setQ] = useState("");
  const list = state.books.filter((b) =>
    q.trim() ? `${b.title} ${b.author}`.toLowerCase().includes(q.trim().toLowerCase()) : true,
  );

  return (
    <Sheet open={open} onClose={onClose} label="Pick from the shelves">
      <h2 className="h2">Built from</h2>
      <p className="hint" style={{ marginTop: 6 }}>
        Anything on either set of shelves. The book stays where it is; this only points at it.
      </p>
      <input
        className="field"
        style={{ marginTop: 14 }}
        placeholder="Search the shelves"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="stack stack--tight" style={{ marginTop: 14 }}>
        {list.length === 0 && <p className="hint">Nothing on the shelves yet.</p>}
        {list.map((b) => {
          const on = chosen.includes(b.id);
          const shelf = state.shelves.find((s) => s.id === b.shelfId);
          return (
            <button
              key={b.id}
              type="button"
              className={`btn ${on ? "btn--primary" : "btn--ghost"}`}
              style={{ justifyContent: "flex-start", textAlign: "left" }}
              onClick={() => onToggle(b.id)}
              aria-pressed={on}
            >
              <span>
                {on ? "✓ " : ""}
                {b.title}
                {b.author ? ` — ${b.author}` : ""}
                {shelf ? ` · ${shelf.name}` : ""}
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
