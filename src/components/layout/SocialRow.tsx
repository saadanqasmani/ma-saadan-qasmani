import { social } from "@/content/site";

/**
 * The profile links, set under the portrait so a reader can connect at the
 * moment they are looking at the person rather than hunting for Correspondence.
 */
export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {social.map((s) => (
        <li key={s.label}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ember"
          >
            <span className="inline-block h-px w-4 bg-current transition-all duration-300 group-hover:w-7" />
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
