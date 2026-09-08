"use client";

import { useActionState } from "react";
import { signIn, type ActionResult } from "@/app/admin/actions";
import { Label, TextInput } from "@/components/forms/fields";
import { buttonClass } from "@/components/admin/ui";

const initial: ActionResult = { ok: false };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <form action={action} className="space-y-6">
      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <TextInput id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.message && <p className="text-sm text-ember">{state.message}</p>}

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
