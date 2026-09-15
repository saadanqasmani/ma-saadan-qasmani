/**
 * The board, written out for someone who cannot see it.
 *
 * /ops answers 404 to anyone without the cookie, which is the point of it,
 * and means no assistant in a chat window can read it. So the desk writes
 * itself out instead: plain Markdown, pasted into a conversation, carrying
 * the state and the question rather than a screenshot of a dashboard.
 *
 * Written for a reader with no context at all. Every task says what it is,
 * how far along, what is ticked, what was said about it and what is
 * actually being asked, because a brief that assumes yesterday's
 * conversation produces an answer about the wrong thing.
 */

import {
  dueLabel,
  fmtDate,
  pct,
  todayISO,
  type Comment,
  type OpsState,
  type Persona,
  type Task,
} from "./model";

function who(p: Persona): string {
  return p === "osman" ? "Osman" : "Saadan";
}

function comments(list: Comment[] | undefined): string[] {
  if (!list || list.length === 0) return [];
  return ["", "Said about it so far:", ...list.map((c) => `- ${who(c.by)}: ${c.text}`)];
}

/** One task, with everything needed to act on it and nothing else. */
export function taskBrief(task: Task): string {
  const due = dueLabel(task);
  const lines: string[] = [
    `## ${task.title}`,
    "",
    task.desc || "_No description written._",
    "",
    `- Segment: ${task.segment === "academic" ? "Academic" : "Administrative"}`,
    `- Progress: ${pct(task)}%`,
    `- Status: ${task.status.replace("_", " ")}`,
    `- Due: ${task.due ? `${fmtDate(task.due)} (${due.txt})` : task.when || "no date set"}`,
  ];

  if (task.createdBy === "osman") lines.push("- Put on the board by Osman, not by me.");
  if (task.approval) lines.push(`- Approval: ${task.approval}`);

  if (task.checklist.length) {
    lines.push("", "Checklist:");
    task.checklist.forEach((c) => lines.push(`- [${c.done ? "x" : " "}] ${c.text}`));
  }

  if (task.notes?.trim()) lines.push("", "My notes:", task.notes.trim());

  const subs = task.submissions ?? [];
  if (subs.length) {
    lines.push("", "Work handed in:");
    subs.forEach((s) => lines.push(`- ${s.name}${s.note ? ` (${s.note})` : ""}`));
  }

  lines.push(...comments(task.comments));
  return lines.join("\n");
}

/**
 * One task, and the request wrapped around it.
 *
 * This is the thing worth pasting into a chat: the state, then the ask, in
 * that order, so the answer is about this task rather than about tasks.
 */
export function taskPrompt(task: Task): string {
  return [
    "I am working through a task on my own board. Here is where it stands.",
    "",
    taskBrief(task),
    "",
    "---",
    "",
    "Help me actually finish this. Start by telling me the single next thing to do,",
    "then work through it with me. Ask me for anything you need that is not above,",
    "rather than assuming it.",
  ].join("\n");
}

/** The whole desk, for a conversation about what to do next. */
export function boardBrief(state: OpsState, persona: Persona): string {
  const open = state.tasks.filter((t) => pct(t) < 100);
  const done = state.tasks.filter((t) => pct(t) === 100);
  const att = state.attendance[todayISO()];

  const lines: string[] = [
    `# My work board, as of ${fmtDate(todayISO())}`,
    "",
    `Reading this as ${who(persona)}. ${open.length} open, ${done.length} finished.`,
    att?.checkInAt ? `Checked in today: ${att.status}, ${att.hours} hours.` : "Not checked in today.",
    "",
    "## Open, nearest deadline first",
  ];

  const sorted = [...open].sort((a, b) => {
    if (!a.due) return 1;
    if (!b.due) return -1;
    return a.due.localeCompare(b.due);
  });

  if (sorted.length === 0) lines.push("", "_Nothing open._");
  sorted.forEach((t) => {
    const d = dueLabel(t);
    lines.push("", `### ${t.title}`);
    lines.push(`${pct(t)}% · ${d.txt || "no date"}${t.createdBy === "osman" ? " · from Osman" : ""}`);
    if (t.desc) lines.push(t.desc);
    const left = t.checklist.filter((c) => !c.done);
    if (left.length) lines.push(`Still to do: ${left.map((c) => c.text).join("; ")}`);
    if (t.notes?.trim()) lines.push(`Notes: ${t.notes.trim()}`);
    if (t.approval === "changes") lines.push("Osman asked for changes on this.");
  });

  if (done.length) {
    lines.push("", "## Finished", "", done.map((t) => `- ${t.title}`).join("\n"));
  }

  const waiting = state.tasks.filter((t) => t.approval === "requested");
  if (waiting.length) {
    lines.push("", "## Waiting on Osman", "", waiting.map((t) => `- ${t.title}`).join("\n"));
  }

  if (state.materials.length) {
    lines.push("", "## Reading I have been given", "");
    state.materials.forEach((m) => lines.push(`- ${m.name}${m.note ? ` — ${m.note}` : ""} (from ${who(m.by)})`));
  }

  const recentMeetings = state.meetings.slice(0, 3);
  if (recentMeetings.length) {
    lines.push("", "## Recent meetings", "");
    recentMeetings.forEach((m) => {
      lines.push(`- ${fmtDate(m.date)}, with ${m.with}: ${m.title}`);
      const unconfirmed = m.items.filter((i) => !i.confirmed);
      if (unconfirmed.length) lines.push(`  Not yet on the board: ${unconfirmed.map((i) => i.text).join("; ")}`);
    });
  }

  lines.push(
    "",
    "---",
    "",
    "Help me decide what to do first today, and why. Then work through it with me.",
    "If something above is too vague to act on, say so and ask me rather than guessing.",
  );

  return lines.join("\n");
}

/** A filename that sorts by date and says what it is. */
export function briefFilename(): string {
  return `board-${todayISO()}.md`;
}
