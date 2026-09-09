import { cn } from "@/lib/utils";

/**
 * A white card on a gradient hairline, drifting slowly.
 *
 * The border is a gradient behind the card rather than a border property,
 * because a border cannot hold a gradient. The card sits on top with a
 * one-and-a-half pixel inset, which is the visible line.
 *
 * The drift is CSS, not JS: these appear twenty at a time, and twenty
 * main-thread animations is a real cost for a nine-pixel movement.
 */
export function FloatCard({
  children,
  tone = "blue",
  index = 0,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  tone?: "blue" | "ember" | "mixed";
  /** Staggers the drift so a row of cards never moves as one. */
  index?: number;
  className?: string;
  innerClassName?: string;
}) {
  const gradient =
    tone === "ember"
      ? "from-ember/55 via-ember/15 to-azure/25"
      : tone === "mixed"
        ? "from-azure/45 via-ember/30 to-azure/20"
        : "from-azure/55 via-azure/15 to-ember/25";

  return (
    <div
      className={cn(
        "float-card h-full bg-gradient-to-br p-[1.5px]",
        "shadow-[0_18px_44px_-28px_rgba(21,32,60,0.55)]",
        "transition-shadow duration-500 hover:shadow-[0_26px_60px_-26px_rgba(21,32,60,0.6)]",
        gradient,
        className
      )}
      style={
        {
          "--float-delay": `${(index % 5) * 0.7}s`,
          "--float-dur": `${6.4 + (index % 4) * 0.6}s`,
        } as React.CSSProperties
      }
    >
      <div className={cn("h-full bg-white", innerClassName)}>{children}</div>
    </div>
  );
}
