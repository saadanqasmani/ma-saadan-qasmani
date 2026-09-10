"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Label,
  TextInput,
  TextArea,
  Select,
  FormNotice,
  submitButtonClass,
  SubmitLabel,
} from "@/components/forms/fields";
import type { Dictionary } from "@/content/i18n/en";

/** Validation messages are read in the language the page is in. */
function makeSchema(copy: Dictionary["forms"]) {
  return z.object({
    full_name: z.string().min(1, copy.required),
    email: z.string().email(copy.invalidEmail),
    phone: z.string().min(1, copy.required),
    // The two country names are proper nouns and stay as they are.
    country: z.enum(["Türkiye", "Pakistan"]),
    city: z.string().min(1, copy.required),
    shipping_address: z.string().min(1, copy.required),
    quantity: z.number().int().min(1).max(50),
    message: z.string().optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function DirectOrderForm({ copy }: { copy: Dictionary["forms"] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(makeSchema(copy)),
    defaultValues: { quantity: 1, country: "Türkiye" },
  });

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/book-orders", {
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
    return (
      <FormNotice tone="success">{copy.orderDone}</FormNotice>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          <Label htmlFor="phone" required>
            {copy.phoneNumber}
          </Label>
          <TextInput id="phone" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <FormNotice tone="error">{errors.phone.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="country" required>
            {copy.country}
          </Label>
          <Select id="country" {...register("country")}>
            <option value="Türkiye">Türkiye</option>
            <option value="Pakistan">Pakistan</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="city" required>
            {copy.city}
          </Label>
          <TextInput id="city" {...register("city")} aria-invalid={!!errors.city} />
          {errors.city && <FormNotice tone="error">{errors.city.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="quantity" required>
            {copy.quantity}
          </Label>
          <TextInput
            id="quantity"
            type="number"
            min={1}
            max={50}
            {...register("quantity", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shipping_address" required>
          {copy.shippingAddress}
        </Label>
        <TextArea
          id="shipping_address"
          {...register("shipping_address")}
          aria-invalid={!!errors.shipping_address}
        />
        {errors.shipping_address && (
          <FormNotice tone="error">{errors.shipping_address.message}</FormNotice>
        )}
      </div>

      <div>
        <Label htmlFor="message">{copy.optionalMessage}</Label>
        <TextArea id="message" {...register("message")} />
      </div>

      <p className="text-xs text-ink-soft">{copy.orderNote}</p>

      {serverError && <FormNotice tone="error">{serverError}</FormNotice>}

      <button type="submit" disabled={status === "loading"} className={submitButtonClass}>
        <SubmitLabel>{status === "loading" ? copy.sending : copy.submitOrder}</SubmitLabel>
      </button>
    </form>
  );
}
