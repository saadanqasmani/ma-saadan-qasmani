"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NewsletterForm, hasSubscribed } from "@/components/forms/NewsletterForm";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import type { Dictionary } from "@/content/i18n/en";
import { stripLocale } from "@/lib/i18n/config";

/**
 * Remembered for the length of one visit, not for good.
 *
 * Session storage rather than local: moving between pages inside a visit
 * must not reopen it, but coming back tomorrow should. Which panel opens
 * then depends on whether the address was ever left.
 */
const VISIT = "thb-announcement-visit";

/**
 * The one interruption on the site: the novel is coming, and here is where
 * to leave an address for the day it does.
 *
 * It waits a moment before appearing, so the page a reader came for gets to
 * arrive first. It closes on Escape, on the backdrop, and on its own button,
 * and stays closed for the rest of that visit.
 *
 * It opens once per visit, and says one of two things. To someone who has
 * never left an address it makes the same offer as before, because the offer
 * has not been answered. To someone already on the list it drops the form
 * and becomes a reminder that the date is coming — asking a subscriber to
 * subscribe is the fastest way to look like you are not paying attention.
 *
 * A native <dialog> rather than a div: focus goes in and stays in, Escape
 * works, and the rest of the page is inert for a screen reader without any
 * of that having to be rebuilt by hand.
 */
export function BookAnnouncement({
  copy,
  cover,
  newsletter,
}: {
  copy: Dictionary["announcement"];
  cover: string | null;
  newsletter: Dictionary["newsletter"];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  // Nobody needs to be told about the novel on the novel's own page.
  const onNovelPage = stripLocale(pathname || "/").startsWith("/the-highest-branch");

  const remember = useCallback(() => {
    try {
      window.sessionStorage.setItem(VISIT, "1");
    } catch {
      // Nothing to remember it with. It will open again on the next page,
      // which is worse than it should be but better than never opening.
    }
  }, []);

  useEffect(() => {
    if (onNovelPage) return;

    let shownThisVisit = false;
    try {
      shownThisVisit = window.sessionStorage.getItem(VISIT) === "1";
    } catch {
      // Storage blocked: show it, rather than never showing it.
    }
    if (shownThisVisit) return;

    const timer = window.setTimeout(() => {
      // Read at opening time, not at mount: a reader who subscribed a moment
      // ago on this very page should not be asked again on the next one.
      setSubscribed(hasSubscribed());
      setMounted(true);
      remember();
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [onNovelPage, remember]);

  useEffect(() => {
    if (!mounted) return;
    const node = dialog.current;
    if (!node || node.open) return;
    node.showModal();
  }, [mounted]);

  const close = useCallback(() => {
    remember();
    dialog.current?.close();
    setMounted(false);
  }, [remember]);

  if (!mounted) return null;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="announcement-heading"
      onClose={remember}
      onCancel={remember}
      // Clicks land on the dialog itself only when they miss the panel
      // inside it, which is what a click on the backdrop is.
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
      className="announcement-dialog w-[min(34rem,calc(100vw-2rem))] border border-ink/20 bg-azure p-0 text-canvas-light shadow-[0_40px_100px_-40px_rgba(11,20,50,0.8)] backdrop:bg-ink/60"
    >
      <div className="relative flex flex-col gap-6 p-7 sm:flex-row sm:gap-7 sm:p-9">
        <button
          type="button"
          onClick={close}
          aria-label={copy.dismiss}
          className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center text-canvas-light/70 transition-colors hover:text-canvas-light"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="M2.5 2.5l11 11m0-11l-11 11" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        {cover && (
          <div className="shrink-0 self-start">
            <Image
              src={cover}
              alt=""
              width={132}
              height={200}
              className="h-auto w-24 border border-canvas-light/25 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.7)] sm:w-32"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-light">
            {copy.eyebrow}
          </p>
          <h2
            id="announcement-heading"
            className="mt-2.5 pe-8 font-display text-3xl leading-[1.05] sm:text-4xl"
          >
            {copy.heading}
          </h2>
          <p className="mt-3.5 font-serif text-[0.95rem] leading-relaxed text-canvas-light/85">
            {copy.body}
          </p>
          {subscribed ? (
            <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-canvas-light/70">
              <span aria-hidden className="mt-2 block h-px w-4 shrink-0 bg-ember-light" />
              {copy.onList}
            </p>
          ) : (
            <>
              <p className="mt-4 text-sm leading-relaxed text-canvas-light/70">{copy.ask}</p>

              <div className="mt-5">
                <NewsletterForm
                  tone="light"
                  copy={{ ...newsletter, subscribe: copy.submit, sending: copy.sending, done: copy.done, placeholder: copy.placeholder }}
                />
              </div>
            </>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <LocaleLink
              href="/the-highest-branch"
              onClick={close}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-canvas-light transition-opacity hover:opacity-75"
            >
              <span className="inline-block h-px w-5 bg-current transition-all duration-300 group-hover:w-8" />
              {copy.readMore}
            </LocaleLink>
            {!subscribed && (
              <button
                type="button"
                onClick={close}
                className="text-xs uppercase tracking-[0.16em] text-canvas-light/55 transition-colors hover:text-canvas-light"
              >
                {copy.later}
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
