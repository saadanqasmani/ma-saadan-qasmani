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

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Required"),
  country: z.enum(["Türkiye", "Pakistan"]),
  city: z.string().min(1, "Required"),
  shipping_address: z.string().min(1, "Required"),
  quantity: z.number().int().min(1).max(50),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function DirectOrderForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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
      <FormNotice tone="success">
        Your order has been received. Our team reviews every order personally — you will receive
        payment and shipping instructions by email once it is confirmed. No payment is required
        yet.
      </FormNotice>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          <Label htmlFor="phone" required>
            Phone number
          </Label>
          <TextInput id="phone" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <FormNotice tone="error">{errors.phone.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="country" required>
            Country
          </Label>
          <Select id="country" {...register("country")}>
            <option value="Türkiye">Türkiye</option>
            <option value="Pakistan">Pakistan</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="city" required>
            City
          </Label>
          <TextInput id="city" {...register("city")} aria-invalid={!!errors.city} />
          {errors.city && <FormNotice tone="error">{errors.city.message}</FormNotice>}
        </div>
        <div>
          <Label htmlFor="quantity" required>
            Quantity
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
          Shipping address
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
        <Label htmlFor="message">Optional message</Label>
        <TextArea id="message" {...register("message")} />
      </div>

      <p className="text-xs text-ink-soft">
        This form does not collect payment or banking details. Our team reviews every order
        personally and sends payment instructions directly once your order is confirmed.
      </p>

      {serverError && <FormNotice tone="error">{serverError}</FormNotice>}

      <button type="submit" disabled={status === "loading"} className={submitButtonClass}>
        <SubmitLabel>{status === "loading" ? "Sending…" : "Submit Order"}</SubmitLabel>
      </button>
    </form>
  );
}
