"use client";

import { useActionState, useState } from "react";
import { setPassword, type ActionResult } from "@/app/admin/actions";
import { buttonClass, inputClass } from "@/components/admin/ui";

const initial: ActionResult = { ok: false };

/**
 * Setting a login password, without anybody having to open Supabase.
 *
 * Your own password comes first and is checked against Supabase, so a
 * session left open on a borrowed machine is not a way in. After that it
 * offers the allowlisted addresses and nothing else, so this can change
 * your own password or hand one to whoever is going to work the orders,
 * and cannot make an account for a stranger. If the address has no account
 * yet, saving here creates it.
 */
export function PasswordForm({ emails, me }: { emails: string[]; me: string }) {
  const [state, action, pending] = useActionState(setPassword, initial);
  const [shown, setShown] = useState(false);

  return (
    <form action={action} className="mt-5 max-w-md space-y-4">
      {emails.length > 1 ? (
        <div>
          <label htmlFor="pw-email" className="t-label mb-1.5 block text-ink-faint">
            Whose login
          </label>
          <select id="pw-email" name="email" defaultValue={me} className={inputClass}>
            {emails.map((e) => (
              <option key={e} value={e}>
                {e}
                {e === me ? " (you)" : ""}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="email" value={me} />
      )}

      <div>
        <label htmlFor="pw-current" className="t-label mb-1.5 block text-ink-faint">
          Your current password
        </label>
        <input
          id="pw-current"
          name="current"
          type={shown ? "text" : "password"}
          autoComplete="current-password"
          required
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-faint">
          The one you signed in with. Without it nothing here can be changed, whoever is sitting
          at this screen.
        </p>
      </div>

      <div>
        <label htmlFor="pw-new" className="t-label mb-1.5 block text-ink-faint">
          New password
        </label>
        <input
          id="pw-new"
          name="password"
          type={shown ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pw-again" className="t-label mb-1.5 block text-ink-faint">
          And again
        </label>
        <input
          id="pw-again"
          name="confirm"
          type={shown ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-ink-faint">
        <input
          type="checkbox"
          checked={shown}
          onChange={(e) => setShown(e.target.checked)}
          className="h-3.5 w-3.5 accent-[color:var(--ink)]"
        />
        Show what I am typing
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving…" : "Set the password"}
        </button>
        {state.message && (
          <span className={`text-sm ${state.ok ? "text-verdant" : "text-ember"}`}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
