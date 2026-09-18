import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import FaqJsonLd from "@/components/FaqJsonLd";
import JsonCsvApp from "@/components/JsonCsvApp";
import { isLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/dictionary";
import { getTool, SITE_URL } from "@/lib/site";

const tool = getTool("json-csv")!;

const titles: Record<Locale, string> = {
  ko: "JSON/CSV 포맷터 — 정렬, 압축, 유효성 검사",
  en: "JSON/CSV Formatter — Pretty Print, Minify & Validate",
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
      canonical: `${SITE_URL}/${locale}/json-csv`,
      languages: {
        ko: `${SITE_URL}/ko/json-csv`,
        en: `${SITE_URL}/en/json-csv`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: tool.description[locale],
      url: `${SITE_URL}/${locale}/json-csv`,
      type: "website",
    },
  };
}

const faqItems: Record<Locale, { question: string; answer: string }[]> = {
  ko: [
    {
      question: "입력한 데이터가 서버에 저장되나요?",
      answer: "아니요. 모든 처리는 브라우저에서만 이루어지고, 어디에도 저장되지 않아요.",
    },
    {
      question: "대용량 데이터도 처리할 수 있나요?",
      answer:
        "몇 MB 수준의 JSON/CSV는 문제없이 처리돼요. 다만 5MB를 넘는 매우 큰 입력은 브라우저 성능에 따라 느려질 수 있으니, 파일을 나누어 확인하는 걸 권장해요.",
    },
    {
      question: "CSV 구분자가 자동으로 안 맞을 땐 어떻게 하나요?",
      answer:
        "구분자 선택 메뉴에서 쉼표, 세미콜론, 탭 중 원하는 구분자를 직접 선택할 수 있어요.",
    },
    {
      question: "JSON 오류가 나면 어느 부분이 문제인지 알 수 있나요?",
      answer:
        "네. 문법 오류가 발생한 줄과 칸 번호를 함께 표시해서 빠르게 원인을 찾을 수 있어요.",
    },
    {
      question: "JSON과 CSV를 서로 변환할 수도 있나요?",
      answer:
        "현재는 각 형식의 정렬·검증·표 보기만 지원해요. JSON↔CSV 상호 변환은 추후 업데이트에서 검토하고 있어요.",
    },
  ],
  en: [
    {
      question: "Is my data stored on a server?",
      answer: "No. Everything is processed entirely in your browser and nothing is ever stored anywhere.",
    },
    {
      question: "Can it handle large files?",
      answer:
        "JSON/CSV up to a few megabytes works smoothly. Inputs larger than about 5MB may slow down depending on your browser — consider splitting large files.",
    },
    {
      question: "What if the CSV delimiter isn't detected correctly?",
      answer: "Use the delimiter dropdown to manually choose comma, semicolon, or tab.",
    },
    {
      question: "Can I see exactly where a JSON error is?",
      answer: "Yes — the formatter reports the exact line and column of any syntax error.",
    },
    {
      question: "Can I convert between JSON and CSV?",
      answer:
        "Not yet — this version supports formatting, validating, and viewing each format. JSON↔CSV conversion is being considered for a future update.",
    },
  ],
};

export default async function JsonCsvPage({
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

      <JsonCsvApp locale={locale} />

      <article className="prose prose-zinc mx-auto mt-16 max-w-3xl dark:prose-invert">
        {locale === "ko" ? (
          <>
            <h2>이런 상황에서 써보세요</h2>
            <p>
              API 응답으로 받은 한 줄짜리 JSON 로그를 읽기 좋게 정리하고 싶을
              때, 엑셀이나 다른 프로그램에서 내보낸 CSV 파일이 제대로
              구성됐는지 눈으로 확인하고 싶을 때, 혹은 JSON 설정 파일에
              문법 오류가 있는데 어디가 문제인지 찾기 어려울 때 유용해요.
            </p>
            <h2>이렇게 사용하세요</h2>
            <p>
              ① JSON 또는 CSV 탭을 선택하고 데이터를 붙여넣으세요. ② 정렬된
              결과나 표가 자동으로 반영돼요 — JSON은 정렬/압축 모드와 들여쓰기
              칸 수를 바로 조절할 수 있어요. ③ 결과를 클립보드로 복사하거나
              파일로 다운로드하세요.
            </p>
            <h2>왜 이 도구를 만들었나</h2>
            <p>
              로그나 응답 데이터를 확인할 때마다 매번 다른 도구를 찾아 들어가
              로그인하고 붙여넣는 과정이 번거로웠어요. 그래서 로그인 없이
              바로 열어 쓸 수 있고, 입력한 데이터가 어디에도 저장되지 않는
              가벼운 도구를 만들었어요.
            </p>
          </>
        ) : (
          <>
            <h2>When this comes in handy</h2>
            <p>
              Use it when you need to make a minified JSON log from an API
              response readable, when you want to visually verify a CSV file
              exported from Excel or another tool, or when a JSON config file
              has a syntax error and you can&apos;t tell where.
            </p>
            <h2>How to use it</h2>
            <p>
              ① Choose the JSON or CSV tab and paste your data. ② The
              formatted result or table updates automatically — for JSON, you
              can switch between pretty-print and minify and adjust the
              indent size. ③ Copy the result to your clipboard or download it
              as a file.
            </p>
            <h2>Why this tool exists</h2>
            <p>
              Checking logs or API responses shouldn&apos;t require signing
              into yet another tool just to paste some text. This one opens
              instantly, requires no account, and never stores anything you
              paste into it.
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
