"use client";

import { useState } from "react";
import { fmtDate, newId, type Persona, type Segment, type Task } from "@/lib/ops/model";
import { upsertTask, useOps } from "@/lib/ops/store";
import { Seg, Sheet, useCelebrate } from "./ui";

/**
 * A new task in four fields. Title is the only one that has to be filled;
 * everything else can be changed on the card afterwards.
 */
export function TaskForm({ open, onClose, who, fromMeeting }: { open: boolean; onClose: () => void; who: Persona; fromMeeting?: string }) {
  const { state } = useOps();
  const { toast } = useCelebrate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [segment, setSegment] = useState<Segment>("academic");
  const [due, setDue] = useState("");
  const [steps, setSteps] = useState("");

  function reset() {
    setTitle("");
    setDesc("");
    setSegment("academic");
    setDue("");
    setSteps("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const order = state.tasks.filter((t) => t.segment === segment).length + 1;
    const task: Task = {
      id: newId("t"),
      segment,
      title: title.trim(),
      desc: desc.trim(),
      when: due ? `Due ${fmtDate(due)}` : "",
      due: due || null,
      status: "not_started",
      percent: 0,
      order,
      checklist: steps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((text) => ({ text, done: false })),
      createdBy: who,
      comments: [],
      submissions: [],
      approval: null,
      fromMeeting,
    };
    upsertTask(task);
    toast(who === "osman" ? "On Saadan's board." : "Added to the board.", { tone: "blue" });
    reset();
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} label="New task">
      <form onSubmit={submit} className="stack">
        <h2 className="h2">{who === "osman" ? "Give Saadan a task" : "New task"}</h2>
        <label className="fieldset">
          <span className="label">What</span>
          <input className="field field--title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="One line that says what done looks like" required />
        </label>
        <label className="fieldset">
          <span className="label">Details (optional)</span>
          <textarea className="field field--area" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Anything Saadan needs to know to start" />
        </label>
        <div className="row" style={{ gap: 14 }}>
          <div className="fieldset">
            <span className="label">Kind</span>
            <Seg<Segment>
              ariaLabel="Segment"
              value={segment}
              onChange={setSegment}
              options={[
                { id: "academic", label: "Academic", tone: "blue" },
                { id: "administrative", label: "Admin", tone: "yellow" },
              ]}
            />
          </div>
          <label className="fieldset">
            <span className="label">Due</span>
            <input type="date" className="field field--date" value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
        </div>
        <label className="fieldset">
          <span className="label">Steps, one per line (optional)</span>
          <textarea className="field field--area" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder={"Draft the outline\nSend it to Osman\nRevise"} />
        </label>
        <div className="row row--end">
          <button type="button" className="btn btn--quiet" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={!title.trim()}>
            {who === "osman" ? "Assign to Saadan" : "Add to board"}
          </button>
        </div>
      </form>
    </Sheet>
  );
}
