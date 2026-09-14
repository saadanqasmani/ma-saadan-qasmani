"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { stripLocale } from "@/lib/i18n/config";
import { unlockOps, type OpsUnlockState } from "@/lib/actions/ops";

const initial: OpsUnlockState = { error: null };

/**
 * A very small man standing beside the egg.
 *
 * He rocks on his heels, and now and then he waves. Click him and he asks
 * for a word. The word is checked on the server, and the door it opens is
 * named nowhere on this page.
 */
export function Osman() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(unlockOps, initial);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    if (node && !node.open) node.showModal();
  }, [open]);

  useEffect(() => {
    if (!state.ok) return;
    window.open("/ops", "_blank", "noopener,noreferrer");
    dialog.current?.close();
  }, [state.ok]);

  function close() {
    dialog.current?.close();
    setOpen(false);
  }

  if (stripLocale(pathname || "/") !== "/") return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="osman-button">
        <span className="sr-only">.</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/osman@2x.png" alt="" width={48} height={96} draggable={false} />
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
            <label htmlFor="osman-code" className="t-label block text-ink-faint">
              Word
            </label>
            <input
              id="osman-code"
              name="code"
              type="password"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="mt-3 w-full border-b border-ink bg-transparent py-2 font-mono text-base tracking-[0.16em] text-ink outline-none focus:border-ember"
            />
            {state.error && <p className="mt-3 text-sm text-ember">{state.error === "empty" ? "Say it." : "Not that one."}</p>}
            <div className="mt-6 flex items-center justify-between">
              <button type="submit" disabled={pending} className="t-label text-ink transition-opacity hover:opacity-60 disabled:opacity-40">
                {pending ? "Checking" : "Enter"}
              </button>
              <button type="button" onClick={close} className="t-label text-ink-faint transition-colors hover:text-ink">
                Close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
