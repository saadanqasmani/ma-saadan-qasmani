import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="border-b border-line pb-14 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <p className="eyebrow">
            <span className="inline-block h-px w-8 translate-y-[-4px] bg-ember" /> {eyebrow}
          </p>
        </Reveal>
        <SplitText
          text={title}
          as="h1"
          className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.9] tracking-[-0.02em]"
        />
        {lede && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-ink-soft">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
