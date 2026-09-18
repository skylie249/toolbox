import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { TOOLS } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          <span aria-hidden>🧰</span>
          NexaLab Toolbox
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${locale}/${tool.slug}`}
              className="rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white sm:px-3"
            >
              {tool.shortName[locale]}
            </Link>
          ))}
          <LanguageSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
