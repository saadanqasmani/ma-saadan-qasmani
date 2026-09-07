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
  name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
    return <FormNotice tone="success">Your message has been received. Thank you.</FormNotice>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Name
          </Label>
          <TextInput id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <FormNotice tone="error">{errors.name.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <TextInput id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <FormNotice tone="error">{errors.email.message}</FormNotice>}
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <TextInput id="subject" {...register("subject")} />
      </div>

      <div>
        <Label htmlFor="message" required>
          Message
        </Label>
        <TextArea id="message" {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && <FormNotice tone="error">{errors.message.message}</FormNotice>}
      </div>

      {serverError && <FormNotice tone="error">{serverError}</FormNotice>}

      <button type="submit" disabled={status === "loading"} className={submitButtonClass}>
        <SubmitLabel>{status === "loading" ? "Sending…" : "Send Message"}</SubmitLabel>
      </button>
    </form>
  );
}
