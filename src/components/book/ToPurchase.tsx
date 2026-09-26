"use client";

import { useEffect, useState } from "react";

/**
 * A button that floats over the page and takes you to where the book is
 * sold.
 *
 * The description runs long, and on a phone the buying is a great deal of
 * thumb away from the cover. So this rides along: round, raised off the
 * page on its own shadow, and gone once you have arrived, because a button
 * pointing down at the thing you are already reading is an irritation.
 */
/** Clear of the sticky header, so the heading is not under it on arrival. */
const HEADER = 88;

/**
 * Sections above this one reveal as they are scrolled past, and each one
 * settling changes the height of the page under the scroll already in
 * flight: aim once and you land a couple of hundred pixels short. So it
 * aims, waits for the page to stop moving, and corrects.
 */
function goToPurchase() {
  const el = document.getElementById("purchase");
  if (!el) return;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = smooth ? "smooth" : "auto";

  window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - HEADER, behavior });
  window.setTimeout(() => {
    const drift = el.getBoundingClientRect().top - HEADER;
    if (Math.abs(drift) > 16) window.scrollTo({ top: window.scrollY + drift, behavior });
  }, 650);
}

export function ToPurchase({ label }: { label: string }) {
  // True from the first paint, so the button is in the HTML the page
  // arrives with rather than appearing once something has been scrolled.
  // The only thing that takes it away is having got where it points.
  const [show, setShow] = useState(true);

  useEffect(() => {
    const target = document.getElementById("purchase");
    if (!target) return;

    const look = () => {
      const rect = target.getBoundingClientRect();
      // Gone once the shop is up: an arrow pointing down at what you are
      // already reading is only in the way.
      setShow(rect.top > window.innerHeight * 0.45);
    };
    look();
    window.addEventListener("scroll", look, { passive: true });
    window.addEventListener("resize", look);
    return () => {
      window.removeEventListener("scroll", look);
      window.removeEventListener("resize", look);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      hidden={!show}
      onClick={goToPurchase}
      className="to-purchase"
    >
      <span className="to-purchase__ring" aria-hidden />
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d="M12 4v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
