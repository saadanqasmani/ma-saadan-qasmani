"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localePath } from "@/lib/i18n/config";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * A link written in English paths that lands in the reader's language.
 *
 * Every internal link on the site is written as /work or /research, the way
 * it has always been. This is the piece that keeps a reader inside the
 * language they chose: on the Arabic site the same link goes to /ar/work,
 * without any page having to know that.
 *
 * External URLs and anchors are left exactly as written.
 */
export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale();
  const target = /^([a-z]+:|\/\/|#)/i.test(href) ? href : localePath(href, locale);
  return <Link href={target} {...props} />;
}
