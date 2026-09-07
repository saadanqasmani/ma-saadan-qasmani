import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto max-w-7xl px-6 sm:px-10", className)}>{children}</div>;
}
