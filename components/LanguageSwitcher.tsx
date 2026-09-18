"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const target = otherLocale(locale);

  // Strip the current locale prefix, e.g. "/ko/json-csv" -> "/json-csv"
  const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "";
  const href = `/${target}${rest}`;
  const label = target === "ko" ? "한국어" : "English";

  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white sm:px-3"
      hrefLang={target}
    >
      {label}
    </Link>
  );
}
