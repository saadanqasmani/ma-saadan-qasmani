import { brand } from "@/content/site";

/**
 * The wordmark's glyph.
 *
 * Renders Saadan's own logo file, and falls back to a drawn mark if there is
 * none. The fallback is a placeholder, not a design decision: dropping a file
 * in and naming it in one place replaces it everywhere it appears.
 *
 * `src` comes from the content layer, so a mark swapped from the dashboard
 * appears here; without it the file named in the code is used, which is what
 * happens anywhere the header is rendered outside a page.
 */
export function Logo({
  className = "h-5 w-5",
  src,
}: {
  className?: string;
  src?: string | null;
}) {
  const file = src === undefined ? brand.logo : src;
  if (file) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={file}
        alt=""
        aria-hidden
        className={`${className} object-contain`}
        width={768}
        height={642}
      />
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M10 19V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 11L4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 9.5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="3" r="2" className="fill-ember" />
      <circle cx="4" cy="5" r="1.6" className="fill-azure" />
    </svg>
  );
}
