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

/**
 * Built from the dictionary rather than declared once at module scope, so a
 * reader is told what is wrong with their entry in the language they are
 * reading the page in.
 */
function makeSchema(copy: Dictionary["forms"]) {
  return z.object({
    name: z.string().min(1, copy.required),
    email: z.string().email(copy.invalidEmail),
    subject: z.string().optional(),
    message: z.string().min(1, copy.required),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function ContactForm({ copy }: { copy: Dictionary["forms"] }) {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
    return <FormNotice tone="success">{copy.contactDone}</FormNotice>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            {copy.name}
          </Label>
          <TextInput id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <FormNotice tone="error">{errors.name.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="email" required>
            {copy.email}
          </Label>
          <TextInput id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <FormNotice tone="error">{errors.email.message}</FormNotice>}
        </div>
      </div>

      <div>
        <Label htmlFor="subject">{copy.subject}</Label>
        <TextInput id="subject" {...register("subject")} />
      </div>

      <div>
        <Label htmlFor="message" required>
          {copy.message}
        </Label>
        <TextArea id="message" {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && <FormNotice tone="error">{errors.message.message}</FormNotice>}
      </div>

      {serverError && <FormNotice tone="error">{serverError}</FormNotice>}

      <button type="submit" disabled={status === "loading"} className={submitButtonClass}>
        <SubmitLabel>{status === "loading" ? copy.sending : copy.sendMessage}</SubmitLabel>
      </button>
    </form>
  );
}
