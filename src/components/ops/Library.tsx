"use client";

import { useState } from "react";
import {
  BOOK_KINDS,
  SHELF_TONES,
  bookKindMeta,
  booksOn,
  findBooks,
  newId,
  shelfTone,
  shelvesOf,
  type Book,
  type BookKind,
  type Comment,
  type Persona,
  type Shelf,
  type ShelfTone,
} from "@/lib/ops/model";
import { removeBook, removeShelf, toggleRead, upsertBook, upsertShelf, useOps } from "@/lib/ops/store";
import { LockerView } from "./Locker";
import { Thread } from "./TaskCard";
import { Avatar, Confirm, Empty, FileRow, Seg, Upload, nameOf, useCelebrate, whenLabel } from "./ui";

/**
 * The library: two sets of shelves, each man's open to the other.
 *
 * The reading tab is a stream — one of them hands the other a thing and
 * they talk about it. This is the opposite shape. It is kept rather than
 * sent, arranged by its owner into shelves he names himself, and the whole
 * point of the other being able to see it is that he can go and look
 * without anyone handing him anything.
 *
 * A shelf belongs to whoever built it and only he renames or clears it.
 * Either of them may put something on either shelf, and either may say he
 * has read a thing. Ownership of the furniture, not of the books.
 */
export function LibraryView({ who }: { who: Persona }) {
  // One tab, two shapes. Splitting them across the nav would mean hunting
  // for the right word before you can look for the right thing; putting
  // them in one list would mean either shelves with compulsory roles or a
  // locker with none. A switch at the top is the whole of the complexity.
  const [side, setSide] = useState<"shelves" | "locker">("shelves");

  return (
    <div className="stack">
      <Seg<"shelves" | "locker">
        ariaLabel="Which half of the library"
        value={side}
        onChange={setSide}
        options={[
          { id: "shelves", label: "Shelves" },
          { id: "locker", label: "Locker" },
        ]}
      />

      {side === "locker" ? (
        <LockerView who={who} />
      ) : (
        <Shelves who={who} />
      )}
    </div>
  );
}

/** Study material, kept and arranged. */
function Shelves({ who }: { who: Persona }) {
  const { state } = useOps();
  const other: Persona = who === "saadan" ? "osman" : "saadan";
  const [building, setBuilding] = useState(false);
  const [query, setQuery] = useState("");

  const mine = shelvesOf(state.shelves, who);
  const theirs = shelvesOf(state.shelves, other);
  const hits = findBooks(state.books, query);

  return (
    <div className="stack">
      <div className="row row--between">
        <p className="muted small">
          {state.books.length} item{state.books.length === 1 ? "" : "s"} on {state.shelves.length} shelf
          {state.shelves.length === 1 ? "" : "ves"}
        </p>
        {!building && (
          <button type="button" className="btn btn--primary" onClick={() => setBuilding(true)}>
            + New shelf
          </button>
        )}
      </div>

      <input
        className="field"
        placeholder="Search every shelf by title, author or note"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search the library"
      />

      {building && <ShelfForm who={who} onDone={() => setBuilding(false)} />}

      {query.trim() && (
        <section className="g stack stack--tight">
          <span className="label">
            {hits.length} found for &ldquo;{query.trim()}&rdquo;
          </span>
          {hits.length === 0 ? (
            <p className="hint">Nothing by that name on either set of shelves.</p>
          ) : (
            hits.map((b) => <BookRow key={b.id} book={b} who={who} showShelf />)
          )}
        </section>
      )}

      {state.shelves.length === 0 && !building && (
        <Empty title="No shelves yet" body="Name one, and everything you are working through can live on it.">
          <button type="button" className="btn btn--yellow" onClick={() => setBuilding(true)}>
            Build the first shelf
          </button>
        </Empty>
      )}

      {mine.length > 0 && (
        <section className="stack stack--tight">
          <span className="label">Your shelves</span>
          <div className="stack stagger">
            {mine.map((s) => (
              <ShelfCard key={s.id} shelf={s} who={who} owned />
            ))}
          </div>
        </section>
      )}

      {theirs.length > 0 && (
        <section className="stack stack--tight">
          <span className="label">{nameOf(other)}&rsquo;s shelves</span>
          <div className="stack stagger">
            {theirs.map((s) => (
              <ShelfCard key={s.id} shelf={s} who={who} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---- building and naming a shelf -------------------------------------- */

function ShelfForm({
  who,
  shelf,
  onDone,
}: {
  who: Persona;
  /** Present when an existing shelf is being renamed rather than built. */
  shelf?: Shelf;
  onDone: () => void;
}) {
  const [name, setName] = useState(shelf?.name ?? "");
  const [note, setNote] = useState(shelf?.note ?? "");
  const [tone, setTone] = useState<ShelfTone>(shelf?.tone ?? "blue");
  const { toast } = useCelebrate();

  function save(e: React.FormEvent) {
    e.preventDefault();
    const named = name.trim();
    if (!named) return;
    upsertShelf({
      id: shelf?.id ?? newId("shelf"),
      name: named,
      note: note.trim(),
      by: shelf?.by ?? who,
      at: shelf?.at ?? new Date().toISOString(),
      tone,
    });
    toast(shelf ? "Shelf renamed." : `“${named}” is up.`, { tone: "blue" });
    onDone();
  }

  return (
    <form onSubmit={save} className="g g--pop stack">
      <h2 className="h2">{shelf ? "Rename the shelf" : "Name a shelf"}</h2>
      <label className="fieldset">
        <span className="label">What is it called</span>
        <input
          className="field"
          autoFocus
          placeholder="Diplomatic history, Statistics, Things to finish"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="fieldset">
        <span className="label">What lives on it</span>
        <input
          className="field"
          placeholder="One line, so the other one knows what he is looking at"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <div className="fieldset">
        <span className="label">Spine</span>
        <div className="row" style={{ gap: 8 }}>
          {SHELF_TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="spine"
              data-on={t.id === tone}
              onClick={() => setTone(t.id)}
              aria-pressed={t.id === tone}
              aria-label={t.label}
              style={{ background: t.hex }}
            />
          ))}
        </div>
      </div>
      <div className="row row--end">
        <button type="button" className="btn btn--quiet" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
          {shelf ? "Save" : "Put it up"}
        </button>
      </div>
    </form>
  );
}

/* ---- a shelf, and what stands on it ----------------------------------- */

function ShelfCard({ shelf, who, owned }: { shelf: Shelf; who: Persona; owned?: boolean }) {
  const { state } = useOps();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const books = booksOn(state.books, shelf.id);
  const unread = books.filter((b) => !b.readBy.includes(who)).length;

  if (renaming) {
    return <ShelfForm who={who} shelf={shelf} onDone={() => setRenaming(false)} />;
  }

  return (
    <div className="shelf" style={{ ["--spine" as string]: shelfTone(shelf.tone) }}>
      <button type="button" className="shelf__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="grow" style={{ minWidth: 0, textAlign: "left" }}>
          <span className="shelf__name">{shelf.name}</span>
          <span className="shelf__note">
            {shelf.note || `${books.length} item${books.length === 1 ? "" : "s"}`}
          </span>
        </span>
        <span className="row" style={{ gap: 6, flex: "none" }}>
          <span className="chip">{books.length}</span>
          {unread > 0 && <span className="chip chip--soon">{unread} unread</span>}
          <Avatar who={shelf.by} />
        </span>
      </button>

      {open && (
        <div className="shelf__body stack stack--tight">
          {books.length === 0 && !adding && (
            <p className="hint">Nothing on it yet.</p>
          )}
          {books.map((b) => (
            <BookRow key={b.id} book={b} who={who} />
          ))}

          {adding ? (
            <BookForm shelf={shelf} who={who} onDone={() => setAdding(false)} />
          ) : (
            <div className="row row--between">
              <button type="button" className="btn btn--sm btn--primary" onClick={() => setAdding(true)}>
                + Add to this shelf
              </button>
              {owned && (
                <span className="row" style={{ gap: 8 }}>
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => setRenaming(true)}>
                    Rename
                  </button>
                  <Confirm
                    label="Take it down"
                    question={`Take down “${shelf.name}” and everything on it?`}
                    onYes={() => removeShelf(shelf.id)}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- putting something on a shelf ------------------------------------- */

function BookForm({ shelf, who, onDone }: { shelf: Shelf; who: Persona; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [kind, setKind] = useState<BookKind>("book");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<{ path: string; name: string; type: string } | null>(null);
  const { toast } = useCelebrate();

  function save(e: React.FormEvent) {
    e.preventDefault();
    const named = title.trim() || file?.name || "";
    if (!named) return;
    upsertBook({
      id: newId("book"),
      shelfId: shelf.id,
      title: named,
      author: author.trim(),
      kind,
      path: file?.path ?? "",
      fileName: file?.name ?? "",
      fileType: file?.type ?? "",
      url: url.trim(),
      note: note.trim(),
      by: who,
      at: new Date().toISOString(),
      readBy: [],
      comments: [],
    });
    toast(`On “${shelf.name}”.`, { tone: "blue" });
    onDone();
  }

  return (
    <form onSubmit={save} className="g g--pop stack stack--tight">
      <span className="label">Onto {shelf.name}</span>
      <Seg<BookKind>
        ariaLabel="What kind of thing"
        value={kind}
        onChange={setKind}
        options={BOOK_KINDS.map((k) => ({ id: k.id, label: k.label }))}
      />
      <input
        className="field"
        autoFocus
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="field"
        placeholder="Author, editor, whoever wrote it"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        className="field"
        placeholder="Why it is here, and what to read it for"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input
        className="field"
        placeholder="A link, if it lives somewhere else"
        value={url}
        inputMode="url"
        onChange={(e) => setUrl(e.target.value)}
      />
      {/* A copy of its own, for what is not online. A shelf entry with no
          file and no link is still worth keeping: it is the paper book. */}
      {file ? (
        <FileRow
          name={file.name}
          path={file.path}
          type={file.type}
          right={
            <button type="button" className="btn btn--sm btn--quiet" onClick={() => setFile(null)}>
              Remove
            </button>
          }
        />
      ) : (
        <Upload onDone={setFile} label="Attach a copy, if you have one" />
      )}
      <div className="row row--end">
        <button type="button" className="btn btn--quiet" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!title.trim() && !file}>
          Shelve it
        </button>
      </div>
    </form>
  );
}

/* ---- one thing on a shelf --------------------------------------------- */

function BookRow({ book, who, showShelf }: { book: Book; who: Persona; showShelf?: boolean }) {
  const { state } = useOps();
  const [open, setOpen] = useState(false);
  const meta = bookKindMeta(book.kind);
  const read = book.readBy.includes(who);
  const shelf = showShelf ? state.shelves.find((s) => s.id === book.shelfId) : null;

  function post(text: string) {
    const c: Comment = { by: who, at: new Date().toISOString(), text };
    upsertBook({ ...book, comments: [...book.comments, c] });
  }

  return (
    <div className="book" data-read={read}>
      <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
        <span className="book__k" aria-hidden>
          {meta.glyph}
        </span>
        <div className="grow" style={{ minWidth: 0 }}>
          <p className="book__t">{book.title}</p>
          <p className="small muted">
            {[book.author, shelf?.name, `${nameOf(book.by)} · ${whenLabel(book.at)}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {book.note && <p className="small" style={{ color: "var(--ink-soft)" }}>{book.note}</p>}
          {book.path && (
            <div style={{ marginTop: 8 }}>
              <FileRow name={book.fileName || book.title} path={book.path} type={book.fileType} />
            </div>
          )}
          {book.url && (
            <a className="small" href={book.url} target="_blank" rel="noopener noreferrer">
              {book.url}
            </a>
          )}
        </div>
        <button
          type="button"
          className={`btn btn--sm ${read ? "btn--yellow" : "btn--ghost"}`}
          onClick={() => toggleRead(book, who)}
          style={{ flex: "none" }}
        >
          {read ? "Read" : "Mark read"}
        </button>
      </div>

      {book.readBy.length > 0 && (
        <p className="small muted" style={{ paddingLeft: 30 }}>
          Read by {book.readBy.map(nameOf).join(" and ")}
        </p>
      )}

      <div className="row row--between" style={{ paddingLeft: 30 }}>
        <button type="button" className="btn btn--sm btn--quiet" onClick={() => setOpen(!open)}>
          {open ? "Hide notes" : book.comments.length > 0 ? `Notes (${book.comments.length})` : "Add a note"}
        </button>
        {book.by === who && (
          <Confirm label="Take it off" question="Take it off the shelf?" onYes={() => removeBook(book.id)} />
        )}
      </div>

      {open && (
        <div style={{ paddingLeft: 30 }}>
          <Thread comments={book.comments} who={who} onPost={post} />
        </div>
      )}
    </div>
  );
}

/** How many things neither of them has read yet. For the tab badge. */
export function unreadCount(books: Book[], who: Persona): number {
  return books.filter((b) => !b.readBy.includes(who)).length;
}
