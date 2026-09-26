"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STUDENTS } from "@/content/edviko/demo";

/**
 * Find a student from anywhere.
 *
 * An advisor holding two hundred cases does not navigate to a person, they
 * remember a name halfway through doing something else. Without this, every
 * such moment costs a trip back to the caseload, a filter and a scan, which
 * is the kind of friction that makes people keep their own list on paper.
 *
 * Matches a name or a code, because the code is what appears on a document,
 * an email from a university, or a parent's message. Eight results, because
 * a list longer than that is a search that has not worked.
 */
export function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return STUDENTS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="ev-search">
      <input
        className="ev-field ev-search__field"
        value={query}
        placeholder="Find a student"
        aria-label="Find a student by name or code"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQuery("");
            setOpen(false);
          }
        }}
      />

      {open && query.trim().length >= 2 && (
        <div className="ev-search__out">
          {found.length === 0 && (
            <p className="ev-small" style={{ color: "var(--text-faint)", padding: "0.6rem 0.8rem" }}>
              Nobody by that name or code.
            </p>
          )}
          {found.map((s) => (
            <Link
              key={s.id}
              href={`/edviko/advisor/students/${s.id}`}
              className="ev-search__hit"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
            >
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              <span className="ev-small" style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
                {s.id}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
