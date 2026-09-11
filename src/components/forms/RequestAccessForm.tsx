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
import type { Dictionary } from "@/content/i18n/en";
import { fill } from "@/lib/i18n/dictionary";

/** Validation messages are read in the language the page is in. */
function makeSchema(copy: Dictionary["forms"]) {
  return z.object({
    full_name: z.string().min(1, copy.required),
    email: z.string().email(copy.invalidEmail),
    phone: z.string().optional(),
    institution: z.string().min(1, copy.required),
    position: z.string().optional(),
    country: z.string().min(1, copy.required),
    reason: z.string().min(1, copy.required),
    message: z.string().optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function RequestAccessForm({
  researchSlug,
  researchTitle,
  onClose,
  copy,
}: {
  researchSlug: string;
  researchTitle: string;
  /** Omitted when the form is embedded in a page rather than a dialog. */
  onClose?: () => void;
  copy: Dictionary["forms"];
}) {
  const quoted = `\u201C${researchTitle}\u201D`;
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(makeSchema(copy)) });

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
        setServerError(data.error ?? copy.somethingWrong);
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setServerError(copy.tryAgain);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="space-y-4">
        <FormNotice tone="success">
          {fill(copy.requestDone, { title: quoted })}
        </FormNotice>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="t-label text-ink-soft hover:text-ink"
          >
            {copy.close}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <p className="text-sm text-ink-soft">
        {copy.requestingAccess.split("{title}")[0]}
        <span className="text-ink">{quoted}</span>
        {copy.requestingAccess.split("{title}")[1]}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name" required>
            {copy.fullName}
          </Label>
          <TextInput id="full_name" {...register("full_name")} aria-invalid={!!errors.full_name} />
          {errors.full_name && <FormNotice tone="error">{errors.full_name.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="email" required>
            {copy.email}
          </Label>
          <TextInput id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <FormNotice tone="error">{errors.email.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="phone">{copy.phone}</Label>
          <TextInput id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="country" required>
            {copy.country}
          </Label>
          <TextInput id="country" {...register("country")} aria-invalid={!!errors.country} />
          {errors.country && <FormNotice tone="error">{errors.country.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="institution" required>
            {copy.institution}
          </Label>
          <TextInput id="institution" {...register("institution")} aria-invalid={!!errors.institution} />
          {errors.institution && <FormNotice tone="error">{errors.institution.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="position">{copy.position}</Label>
          <TextInput id="position" {...register("position")} />
        </div>
      </div>

      <div>
        <Label htmlFor="reason" required>
          {copy.reason}
        </Label>
        <TextArea id="reason" {...register("reason")} aria-invalid={!!errors.reason} />
        {errors.reason && <FormNotice tone="error">{errors.reason.message}</FormNotice>}
      </div>

      <div>
        <Label htmlFor="message">{copy.optionalMessage}</Label>
        <TextArea id="message" {...register("message")} />
      </div>

      {serverError && <FormNotice tone="error">{serverError}</FormNotice>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === "loading"} className={submitButtonClass}>
          <SubmitLabel>{status === "loading" ? copy.sending : copy.submitRequest}</SubmitLabel>
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="t-label text-ink-faint transition-colors hover:text-ink"
          >
            {copy.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
