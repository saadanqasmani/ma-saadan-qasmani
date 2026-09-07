import { cn } from "@/lib/utils";

const baseInput =
  "w-full border border-ink-text/20 bg-ink-raised/40 px-4 py-3 text-sm text-ink-text placeholder:text-ink-text-muted focus:border-gold-bright focus:outline-none";

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-sans uppercase tracking-[0.16em] text-ink-text-muted"
    >
      {children}
      {required && <span className="text-gold-bright"> *</span>}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
  return <input {...props} className={cn(baseInput, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
) {
  return <textarea {...props} className={cn(baseInput, "min-h-32 resize-y", props.className)} />;
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }
) {
  return <select {...props} className={cn(baseInput, props.className)} />;
}

export function FormNotice({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "text-sm",
        tone === "error" ? "text-burgundy-bright" : "font-serif italic text-gold-bright"
      )}
    >
      {children}
    </p>
  );
}
