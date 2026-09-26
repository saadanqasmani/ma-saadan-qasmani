"use client";

import { useSession } from "@/components/edviko/auth/session";

/**
 * The name at the top of a dashboard.
 *
 * Server-rendered pages cannot know who is signed in, because the account
 * lives in the browser until there is a server to hold it. So the one line
 * that has to say a real name says it from the client and falls back to the
 * demo's own, rather than the whole page becoming client-rendered for the
 * sake of a greeting.
 */
export function Greeting({ fallback, role }: { fallback: string; role: string }) {
  const { account } = useSession();
  const name = account && account.role === role ? account.name : fallback;
  return <>Good morning, {name.split(" ")[0]}</>;
}
