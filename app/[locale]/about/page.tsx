import type { Metadata } from "next";
import Link from "next/link";
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
    title: locale === "ko" ? "소개" : "About",
    description:
      locale === "ko"
        ? "NexaLab Toolbox는 nexalab.app이 만든 무료 브라우저 기반 데이터 유틸리티 모음입니다."
        : "NexaLab Toolbox is a collection of free, browser-based data utilities built by nexalab.app.",
    alternates: { canonical: `${SITE_URL}/${locale}/about` },
  };
}

export default async function AboutPage({
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
            NexaLab Toolbox 소개
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>
              NexaLab Toolbox는 JSON/CSV 정리, PDF 분리·병합처럼 자주 필요한
              데이터 작업을 위한 작고 빠른 브라우저 기반 유틸리티 모음이에요.{" "}
              <a href="https://nexalab.app" target="_blank" rel="noreferrer">
                nexalab.app
              </a>
              의 일부로 제작·운영되고 있어요.
            </p>
            <p>
              모든 도구는 브라우저 안에서만 동작해요. 입력한 텍스트나 업로드한
              파일은 서버로 전송되거나 저장되지 않고, 그 자리에서 자바스크립트로
              처리돼요.
            </p>
            <p>
              피드백이나 버그 제보, 새 도구 아이디어가 있다면{" "}
              <Link href="/ko/contact">문의 페이지</Link>로 알려주세요.
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            About NexaLab Toolbox
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>
              NexaLab Toolbox is a small collection of free, fast,
              browser-based utilities for everyday data tasks — cleaning up
              JSON/CSV and splitting or merging PDFs. It&apos;s built and
              maintained as part of{" "}
              <a href="https://nexalab.app" target="_blank" rel="noreferrer">
                nexalab.app
              </a>
              , a personal platform for small web tools and side projects.
            </p>
            <p>
              Every tool here runs entirely client-side in your browser.
              Nothing you type or upload is sent to a server, logged, or
              stored — the page simply runs JavaScript locally to compute the
              result you see.
            </p>
            <p>
              Have feedback, a bug report, or an idea for a new tool? Get in
              touch on the <Link href="/en/contact">Contact page</Link>.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
