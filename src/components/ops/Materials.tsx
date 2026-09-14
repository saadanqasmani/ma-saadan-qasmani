"use client";

import { useState } from "react";
import { newId, type Comment, type Material, type Persona } from "@/lib/ops/model";
import { removeMaterial, upsertMaterial, useOps } from "@/lib/ops/store";
import { Thread } from "./TaskCard";
import { Avatar, Confirm, Empty, FileRow, Upload, nameOf, useCelebrate, whenLabel } from "./ui";

/**
 * Reading material, mostly Osman to Saadan, with a note on why and a
 * thread under each for what came of it.
 */
export function MaterialsView({ who }: { who: Persona }) {
  const { state } = useOps();
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState("");
  const { toast } = useCelebrate();

  function add(u: { path: string; name: string; type: string }) {
    const m: Material = { id: newId("mat"), name: u.name, path: u.path, type: u.type, by: who, at: new Date().toISOString(), note: note.trim(), comments: [] };
    upsertMaterial(m);
    setNote("");
    setAdding(false);
    toast(who === "osman" ? "Shared. Saadan will see it on his desk." : "Shared.", { tone: "blue" });
  }

  return (
    <div className="stack">
      <div className="row row--between">
        <p className="muted small">
          {state.materials.length} item{state.materials.length === 1 ? "" : "s"}
        </p>
        {!adding && (
          <button type="button" className="btn btn--primary" onClick={() => setAdding(true)}>
            + Share reading
          </button>
        )}
      </div>

      {adding && (
        <div className="g g--pop stack">
          <h2 className="h2">{who === "osman" ? "Reading for Saadan" : "Share something"}</h2>
          <input className="field" autoFocus placeholder="Why this, and what to look for" value={note} onChange={(e) => setNote(e.target.value)} />
          <Upload onDone={add} />
          <div className="row row--end">
            <button type="button" className="btn btn--quiet" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {state.materials.length === 0 && !adding && (
        <Empty title="Nothing shared yet" body={who === "osman" ? "Drop a PDF or a link and a line about why." : "Osman's reading lands here."}>
          <button type="button" className="btn btn--yellow" onClick={() => setAdding(true)}>
            Share the first thing
          </button>
        </Empty>
      )}

      <div className="stack stagger">
        {state.materials.map((m) => (
          <MaterialCard key={m.id} material={m} who={who} />
        ))}
      </div>
    </div>
  );
}

function MaterialCard({ material, who }: { material: Material; who: Persona }) {
  const [open, setOpen] = useState(false);
  function post(text: string) {
    const c: Comment = { by: who, at: new Date().toISOString(), text };
    upsertMaterial({ ...material, comments: [...material.comments, c] });
  }
  return (
    <div className="g stack stack--tight">
      <div className="row">
        <Avatar who={material.by} />
        <span className="small muted">
          {nameOf(material.by)} · {whenLabel(material.at)}
        </span>
        <span className="grow" />
        {material.comments.length > 0 && <span className="chip">{material.comments.length} comment{material.comments.length === 1 ? "" : "s"}</span>}
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOpen(!open)}>
          {open ? "Hide comments" : "Comments"}
        </button>
      </div>
      <FileRow name={material.name} path={material.path} type={material.type ?? ""} note={material.note || undefined} />
      {open && (
        <>
          <Thread comments={material.comments} who={who} onPost={post} />
          {material.by === who && (
            <div className="row row--end">
              <Confirm label="Remove" question="Remove it?" onYes={() => removeMaterial(material.id)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
