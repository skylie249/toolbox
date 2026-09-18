import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "ko";
  return {
    title: locale === "ko" ? "문의" : "Contact",
    description:
      locale === "ko"
        ? "NexaLab Toolbox 팀에 문의하세요."
        : "Get in touch with the NexaLab Toolbox team.",
    alternates: { canonical: `${SITE_URL}/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
      {locale === "ko" ? (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            문의
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>버그를 발견했거나, 기능 제안이나 안부 인사를 남기고 싶다면 이메일로 연락해주세요:</p>
            <p>
              <a href="mailto:kimhg249@gmail.com">kimhg249@gmail.com</a>
            </p>
            <p>
              NexaLab Toolbox는{" "}
              <a href="https://nexalab.app" target="_blank" rel="noreferrer">
                nexalab.app
              </a>
              의 일부입니다.
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Contact
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>
              Found a bug, have a feature request, or just want to say hello?
              Reach out by email:
            </p>
            <p>
              <a href="mailto:kimhg249@gmail.com">kimhg249@gmail.com</a>
            </p>
            <p>
              NexaLab Toolbox is part of{" "}
              <a href="https://nexalab.app" target="_blank" rel="noreferrer">
                nexalab.app
              </a>
              .
            </p>
          </div>
        </>
      )}
    </main>
  );
}
