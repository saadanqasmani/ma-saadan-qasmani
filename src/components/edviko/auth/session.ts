"use client";

import { useMemo, useSyncExternalStore } from "react";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/edviko/browserStore";
import {
  accountOf,
  ACCOUNTS_KEY,
  readAccounts,
  readSession,
  SESSION_KEY,
  type Account,
} from "@/lib/edviko/auth";

/**
 * Who is signed in on this device.
 *
 * Two stores rather than one: the accounts, which persist, and the session,
 * which is one line saying which of them is current. Signing out clears the
 * second and touches nothing else, which is what a person expects and what
 * makes it safe to hand a laptop to somebody.
 */
export function useSession(): {
  account: Account | null;
  accounts: Account[];
  signedIn: boolean;
} {
  const rawAccounts = useSyncExternalStore(subscribe(ACCOUNTS_KEY), snapshot(ACCOUNTS_KEY), serverSnapshot);
  const rawSession = useSyncExternalStore(subscribe(SESSION_KEY), snapshot(SESSION_KEY), serverSnapshot);

  return useMemo(() => {
    const accounts = readAccounts(rawAccounts);
    const account = accountOf(accounts, readSession(rawSession));
    return { account, accounts, signedIn: Boolean(account) };
  }, [rawAccounts, rawSession]);
}

export function saveAccounts(accounts: Account[]) {
  write(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function startSession(account: Account) {
  write(SESSION_KEY, JSON.stringify({ code: account.code, at: new Date().toISOString() }));
}

export function endSession() {
  write(SESSION_KEY, "");
}
