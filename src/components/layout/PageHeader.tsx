import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export function PageHeader({
  eyebrow,
  title,
  lede,
  accent,
  accentTone = "ember",
  sub,
  aside,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /**
   * The trailing part of the title, set in colour. The novel page has always
   * put "Branch" in ember; this makes that treatment available everywhere
   * instead of being one page's exception.
   */
  accent?: string;
  accentTone?: "ember" | "azure" | "verdant";
  /** A quiet line under the title, for an attribution rather than a phrase. */
  sub?: string;
  /** Optional art set beside the title. Absent on every page that has none. */
  aside?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line pb-14 pt-24 sm:pt-32">
      <div
        className={
          aside
            ? "mx-auto grid max-w-7xl items-center gap-10 px-6 sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16"
            : "mx-auto max-w-7xl px-6 sm:px-10"
        }
      >
        <div>
        <Reveal>
          <p className="eyebrow">
            <span className="inline-block h-px w-8 translate-y-[-4px] bg-ember" /> {eyebrow}
          </p>
        </Reveal>
        <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.9] tracking-[-0.02em]">
          <SplitText text={title} as="span" className="block" />
          {accent && (
            <SplitText
              text={accent}
              as="span"
              delay={0.15}
              className={`block ${
                accentTone === "azure"
                  ? "text-azure"
                  : accentTone === "verdant"
                    ? "text-verdant"
                    : "text-ember"
              }`}
            />
          )}
        </h1>
        {sub && (
          <Reveal delay={0.18}>
            <p className="mt-3 font-serif text-lg font-light italic text-ink-faint sm:text-xl">
              {sub}
            </p>
          </Reveal>
        )}
        {lede && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-ink-soft">
              {lede}
            </p>
          </Reveal>
        )}
        </div>
        {aside}
      </div>
    </header>
  );
}
