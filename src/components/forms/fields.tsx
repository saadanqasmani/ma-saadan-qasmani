import { cn } from "@/lib/utils";

const baseInput =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-ember focus:outline-none focus:ring-0";

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
      className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint"
    >
      {children}
      {required && <span className="text-ember"> *</span>}
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
  return <textarea {...props} className={cn(baseInput, "min-h-28 resize-y", props.className)} />;
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }
) {
  return <select {...props} className={cn(baseInput, props.className)} />;
}

export function FormNotice({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-2 text-sm",
        tone === "error" ? "text-ember" : "font-serif text-lg italic text-verdant"
      )}
    >
      {children}
    </p>
  );
}

export const submitButtonClass =
  "group relative inline-flex overflow-hidden border border-ink px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-ink disabled:opacity-50";

export function SubmitLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-disabled:translate-y-full" />
      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
        {children}
      </span>
    </>
  );
}
