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
    title: locale === "ko" ? "개인정보처리방침" : "Privacy Policy",
    description:
      locale === "ko"
        ? "NexaLab Toolbox 개인정보처리방침"
        : "Privacy Policy for NexaLab Toolbox.",
    alternates: { canonical: `${SITE_URL}/${locale}/privacy` },
  };
}

export default async function PrivacyPage({
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
            개인정보처리방침
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>최종 수정일: 2026년 9월 18일</p>

            <h2>도구에 입력·업로드하는 데이터</h2>
            <p>
              JSON/CSV 포맷터와 PDF 분리·병합 도구는 모두 브라우저 안에서만
              동작해요. 입력하거나 업로드한 텍스트·파일은 자바스크립트로
              로컬에서 처리되며, 저희 서버로 전송되거나 저장되지 않아요.
            </p>

            <h2>분석(애널리틱스)</h2>
            <p>
              전체 트래픽 파악을 위해 개인정보를 침해하지 않는 분석 도구(예:
              Google Analytics)를 사용할 수 있어요. 이 데이터는 익명화·집계된
              형태이며, 도구에 입력한 내용과는 연결되지 않아요.
            </p>

            <h2>광고</h2>
            <p>
              이 사이트는 제3자(예: Google AdSense)가 제공하는 광고를 표시할
              수 있어요. 이들 제공자는 이전 방문 이력을 바탕으로 맞춤 광고를
              제공하기 위해 쿠키 등을 사용할 수 있어요. 해당 제공자의 광고
              설정에서 맞춤 광고를 거부할 수 있어요.
            </p>

            <h2>쿠키</h2>
            <p>
              사이트는 기본 기능과 분석을 위해 쿠키를 사용할 수 있어요. 브라우저
              설정에서 쿠키를 비활성화할 수 있으며, 이 경우 일부 기능이 의도한
              대로 동작하지 않을 수 있어요.
            </p>

            <h2>문의</h2>
            <p>
              본 방침에 대한 문의는 <Link href="/ko/contact">문의 페이지</Link>를
              통해 보내주세요.
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Privacy Policy
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>Last updated: September 18, 2026</p>

            <h2>Data you enter or upload into the tools</h2>
            <p>
              The JSON/CSV formatter and PDF split/merge tools run entirely in
              your browser. The text or files you enter or upload are
              processed locally using JavaScript and are never transmitted
              to, or stored on, our servers.
            </p>

            <h2>Analytics</h2>
            <p>
              We may use privacy-respecting analytics (such as Google
              Analytics) to understand aggregate traffic, such as which pages
              are visited and how often. This data is anonymized and
              aggregated, and is not linked to the content you enter into any
              tool.
            </p>

            <h2>Advertising</h2>
            <p>
              This site may display advertising served by third parties (such
              as Google AdSense). These providers may use cookies or similar
              technologies to serve ads based on your prior visits to this or
              other websites. You can opt out of personalized advertising by
              visiting your ad settings with the relevant provider.
            </p>

            <h2>Cookies</h2>
            <p>
              The site may use cookies for basic functionality and analytics.
              You can disable cookies in your browser settings; some features
              may not function as intended if you do.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy can be sent through the{" "}
              <Link href="/en/contact">Contact page</Link>.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
