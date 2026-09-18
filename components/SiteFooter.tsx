import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/dictionary";
import { TOOLS } from "@/lib/site";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const dict = t(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="text-base font-bold text-zinc-900 dark:text-white">
              NexaLab Toolbox
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {dict.footerTagline}{" "}
              {dict.footerProjectBy}{" "}
              <a
                href="https://nexalab.app"
                className="underline hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                nexalab.app
              </a>
              .
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {dict.tools}
            </div>
            <ul className="mt-3 space-y-2">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${locale}/${tool.slug}`}
                    className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    {tool.shortName[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {dict.company}
            </div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {dict.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {dict.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {dict.legal}
            </div>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {dict.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {dict.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          © {year} NexaLab Toolbox, a project by nexalab.app. {dict.footerNote}
        </div>
      </div>
    </footer>
  );
}
