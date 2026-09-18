import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import FaqJsonLd from "@/components/FaqJsonLd";
import PdfApp from "@/components/PdfApp";
import { isLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/dictionary";
import { getTool, SITE_URL } from "@/lib/site";
import { MAX_FILE_SIZE_MB, MAX_TOTAL_SIZE_MB } from "@/lib/pdfTools";

const tool = getTool("pdf")!;

const titles: Record<Locale, string> = {
  ko: "PDF 분리·병합 — 브라우저에서 바로, 서버 전송 없이",
  en: "PDF Split & Merge — Right in Your Browser, No Upload",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "ko";
  return {
    title: titles[locale],
    description: tool.description[locale],
    alternates: {
      canonical: `${SITE_URL}/${locale}/pdf`,
      languages: {
        ko: `${SITE_URL}/ko/pdf`,
        en: `${SITE_URL}/en/pdf`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: tool.description[locale],
      url: `${SITE_URL}/${locale}/pdf`,
      type: "website",
    },
  };
}

const faqItems: Record<Locale, { question: string; answer: string }[]> = {
  ko: [
    {
      question: "업로드한 PDF가 서버에 저장되나요?",
      answer: "아니요. 파일은 브라우저(클라이언트)에서만 처리되고 서버로 전송되지 않아요.",
    },
    {
      question: "비밀번호 걸린 PDF도 되나요?",
      answer: "현재는 지원하지 않아요. 비밀번호를 해제한 뒤 다시 시도해주세요 — 비밀번호 해제 기능은 추후 확장 후보예요.",
    },
    {
      question: "파일 크기 제한이 있나요?",
      answer: `파일당 최대 ${MAX_FILE_SIZE_MB}MB, 전체 합계 최대 ${MAX_TOTAL_SIZE_MB}MB까지 지원해요. 브라우저 메모리에서 전량 처리하기 때문에 그 이상은 느려지거나 실패할 수 있어요.`,
    },
    {
      question: "페이지 순서를 바꿀 수 있나요?",
      answer: "병합하기 탭에서 업로드한 파일 목록의 위/아래 버튼으로 순서를 바꿀 수 있어요.",
    },
    {
      question: "손상된 PDF를 올리면 어떻게 되나요?",
      answer: "손상되었거나 열 수 없는 파일이면 명확한 오류 메시지로 알려드려요.",
    },
  ],
  en: [
    {
      question: "Are uploaded PDFs stored on a server?",
      answer: "No — files are processed entirely in your browser (client-side) and never transmitted anywhere.",
    },
    {
      question: "Does it support password-protected PDFs?",
      answer: "Not currently. Remove the password first and try again — password removal is a candidate for a future update.",
    },
    {
      question: "Is there a file size limit?",
      answer: `Each file can be up to ${MAX_FILE_SIZE_MB}MB, with a combined total of ${MAX_TOTAL_SIZE_MB}MB. Everything is processed in browser memory, so larger files may be slow or fail.`,
    },
    {
      question: "Can I reorder pages or files?",
      answer: "In the Merge tab, use the up/down buttons on the uploaded file list to reorder them.",
    },
    {
      question: "What happens if I upload a corrupted PDF?",
      answer: "You'll get a clear error message if a file is damaged or can't be opened.",
    },
  ],
};

export default async function PdfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = t(locale);
  const items = faqItems[locale];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <FaqJsonLd items={items} />
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {dict.freeTool}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {tool.emoji} {tool.name[locale]}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {tool.description[locale]}
        </p>
      </div>

      <PdfApp locale={locale} />

      <article className="prose prose-zinc mx-auto mt-16 max-w-3xl dark:prose-invert">
        {locale === "ko" ? (
          <>
            <h2>이런 상황에서 써보세요</h2>
            <p>
              계약서에서 서명이 필요한 페이지만 뽑아 상대방에게 보낼 때,
              여러 업체의 견적서 PDF를 하나로 합쳐 제출할 때, 혹은 보고서에서
              불필요한 앞뒤 페이지를 빼고 필요한 부분만 남기고 싶을 때
              유용해요.
            </p>
            <h2>이렇게 사용하세요</h2>
            <p>
              ① 병합하기 또는 분리하기 탭을 선택하고 PDF 파일을 업로드하세요.
              ② 병합할 파일의 순서를 정하거나, 분리할 페이지 범위(예: 1-3,
              5, 7-9)를 입력하세요. ③ 버튼을 누르면 처리된 PDF가 바로
              다운로드돼요.
            </p>
            <h2>왜 이 도구를 만들었나</h2>
            <p>
              계약서나 보고서처럼 민감한 문서를 다룰 때는 파일을 낯선
              서버에 올리고 싶지 않을 때가 많아요. 그래서 파일이 브라우저
              밖으로 전혀 나가지 않는 방식으로, 업로드 즉시 로컬에서 처리를
              끝내는 도구를 만들었어요.
            </p>
          </>
        ) : (
          <>
            <h2>When this comes in handy</h2>
            <p>
              Use it when you need to pull out just the signature page of a
              contract to send someone, combine several vendor quotes into a
              single PDF for submission, or trim unnecessary front/back pages
              from a report down to what actually matters.
            </p>
            <h2>How to use it</h2>
            <p>
              ① Choose the Merge or Split tab and upload your PDF file(s). ②
              Reorder files to merge, or enter the page range to extract
              (e.g. 1-3, 5, 7-9). ③ Click the button and the processed PDF
              downloads immediately.
            </p>
            <h2>Why this tool exists</h2>
            <p>
              When you&apos;re working with contracts or reports, you often don&apos;t
              want to upload sensitive files to an unfamiliar server. This
              tool never sends your files anywhere — everything finishes
              locally the moment you upload.
            </p>
          </>
        )}
      </article>

      <div className="mx-auto max-w-3xl">
        <Faq items={items} heading={dict.faqHeading} />
      </div>
    </main>
  );
}
