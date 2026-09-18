import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/dictionary";
import { SITE_DESCRIPTION, SITE_NAME, TOOLS } from "@/lib/site";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = t(locale);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {SITE_NAME[locale]}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {SITE_DESCRIPTION[locale]}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${locale}/${tool.slug}`}
              className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-3xl" aria-hidden>
                {tool.emoji}
              </span>
              <h2 className="mt-4 text-lg font-bold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {tool.name[locale]}
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {tool.tagline[locale]}
              </p>
              <span className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                {dict.openTool}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {dict.whyTitle}
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {dict.why1Title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {dict.why1Body}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {dict.why2Title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {dict.why2Body}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {dict.why3Title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {dict.why3Body}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
