"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Label,
  TextInput,
  TextArea,
  FormNotice,
  submitButtonClass,
  SubmitLabel,
} from "@/components/forms/fields";

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  institution: z.string().min(1, "Required"),
  position: z.string().optional(),
  country: z.string().min(1, "Required"),
  reason: z.string().min(1, "Required"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RequestAccessForm({
  researchSlug,
  researchTitle,
  onClose,
}: {
  researchSlug: string;
  researchTitle: string;
  /** Omitted when the form is embedded in a page rather than a dialog. */
  onClose?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/research-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, research_slug: researchSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setServerError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="space-y-4">
        <FormNotice tone="success">
          Your request for &ldquo;{researchTitle}&rdquo; has been received. Every request is
          reviewed individually — you will hear back if it is approved.
        </FormNotice>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.16em] text-ink-soft hover:text-ink"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <p className="text-sm text-ink-soft">
        Requesting access to <span className="text-ink">&ldquo;{researchTitle}&rdquo;</span>.
        Every request is reviewed before anything is sent.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name" required>
            Full name
          </Label>
          <TextInput id="full_name" {...register("full_name")} aria-invalid={!!errors.full_name} />
          {errors.full_name && <FormNotice tone="error">{errors.full_name.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <TextInput id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <FormNotice tone="error">{errors.email.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <TextInput id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="country" required>
            Country
          </Label>
          <TextInput id="country" {...register("country")} aria-invalid={!!errors.country} />
          {errors.country && <FormNotice tone="error">{errors.country.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="institution" required>
            Institution
          </Label>
          <TextInput id="institution" {...register("institution")} aria-invalid={!!errors.institution} />
          {errors.institution && <FormNotice tone="error">{errors.institution.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="position">Position / title</Label>
          <TextInput id="position" {...register("position")} />
        </div>
      </div>

      <div>
        <Label htmlFor="reason" required>
          Reason for requesting access
        </Label>
        <TextArea id="reason" {...register("reason")} aria-invalid={!!errors.reason} />
        {errors.reason && <FormNotice tone="error">{errors.reason.message}</FormNotice>}
      </div>

      <div>
        <Label htmlFor="message">Optional message</Label>
        <TextArea id="message" {...register("message")} />
      </div>

      {serverError && <FormNotice tone="error">{serverError}</FormNotice>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === "loading"} className={submitButtonClass}>
          <SubmitLabel>{status === "loading" ? "Sending…" : "Submit Request"}</SubmitLabel>
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.16em] text-ink-faint transition-colors hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
