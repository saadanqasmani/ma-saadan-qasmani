"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { stripLocale } from "@/lib/i18n/config";
import { unlockTaraki, type UnlockState } from "@/lib/actions/taraki";

const initial: UnlockState = { error: null };

/**
 * The egg at the foot of the home page.
 *
 * Small, unlabelled, and carrying no hint of what is behind it. To anyone
 * who is not looking for it, it is a piece of decoration at the bottom of a
 * writer's website. The code is checked on the server; nothing about the
 * thing it opens exists in the page a visitor is sent.
 *
 * No title attribute, no aria-label naming the destination, no hover text.
 * A screen reader is told there is a button, because leaving it unreachable
 * by keyboard would be worse, and it is told only that.
 */
export function EasterEgg() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(unlockTaraki, initial);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    if (node && !node.open) node.showModal();
  }, [open]);

  // The cookie is set by the time the action returns, so the new tab opens
  // already through the gate.
  useEffect(() => {
    if (!state.ok) return;
    window.open("/taraki", "_blank", "noopener,noreferrer");
    // Closing fires the dialog's own close event, which is what clears the
    // state. Setting it here as well would be the same job done twice.
    dialog.current?.close();
  }, [state.ok]);

  function close() {
    dialog.current?.close();
    setOpen(false);
  }

  // The home page only. On every other page the footer ends where it ends.
  if (stripLocale(pathname || "/") !== "/") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="egg-button"
      >
        <span className="sr-only">.</span>
        <Egg />
      </button>

      {open && (
        <dialog
          ref={dialog}
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === dialog.current) close();
          }}
          className="egg-dialog w-[min(22rem,calc(100vw-2rem))] border border-ink/15 bg-canvas-light p-0 backdrop:bg-ink/50"
        >
          <form action={action} className="p-6">
            <label htmlFor="egg-code" className="t-label block text-ink-faint">
              Code
            </label>
            <input
              id="egg-code"
              name="code"
              type="password"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="mt-3 w-full border-b border-ink bg-transparent py-2 font-mono text-base tracking-[0.16em] text-ink outline-none focus:border-ember"
            />
            {state.error && (
              <p className="mt-3 text-sm text-ember">
                {state.error === "empty" ? "Enter the code." : "Not that one."}
              </p>
            )}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                disabled={pending}
                className="t-label text-ink transition-opacity hover:opacity-60 disabled:opacity-40"
              >
                {pending ? "Checking" : "Enter"}
              </button>
              <button
                type="button"
                onClick={close}
                className="t-label text-ink-faint transition-colors hover:text-ink"
              >
                Close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}

/** A painted egg, drawn rather than fetched: it is 14 pixels tall. */
function Egg() {
  return (
    <svg viewBox="0 0 28 36" className="h-full w-full" aria-hidden>
      <defs>
        <clipPath id="egg-shell">
          <path d="M14 1c6.2 0 12 8.9 12 19 0 8.8-5.4 15-12 15S2 28.8 2 20C2 9.9 7.8 1 14 1z" />
        </clipPath>
      </defs>

      <path
        d="M14 1c6.2 0 12 8.9 12 19 0 8.8-5.4 15-12 15S2 28.8 2 20C2 9.9 7.8 1 14 1z"
        fill="var(--canvas-deep)"
      />

      <g clipPath="url(#egg-shell)">
        <path d="M-2 11h32v2.6H-2z" fill="var(--ember)" opacity="0.85" />
        <path d="M-2 23h32v2.6H-2z" fill="var(--azure)" opacity="0.7" />
        <g fill="var(--verdant)" opacity="0.8">
          <circle cx="7" cy="18" r="1.5" />
          <circle cx="14" cy="18" r="1.5" />
          <circle cx="21" cy="18" r="1.5" />
          <circle cx="10.5" cy="29" r="1.3" />
          <circle cx="17.5" cy="29" r="1.3" />
        </g>
        <path
          d="M-2 6.5c4 2.2 7 0 11 0s7 2.2 11 0 8 0 8 0"
          fill="none"
          stroke="var(--ember)"
          strokeWidth="1.1"
          opacity="0.6"
        />
        {/* The light a curved shell catches. */}
        <ellipse cx="10" cy="12" rx="4.5" ry="6.5" fill="#fff" opacity="0.28" />
      </g>

      <path
        d="M14 1c6.2 0 12 8.9 12 19 0 8.8-5.4 15-12 15S2 28.8 2 20C2 9.9 7.8 1 14 1z"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2"
        opacity="0.55"
      />
    </svg>
  );
}
