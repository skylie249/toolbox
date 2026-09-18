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
    title: locale === "ko" ? "이용약관" : "Terms of Use",
    description:
      locale === "ko" ? "NexaLab Toolbox 이용약관" : "Terms of Use for NexaLab Toolbox.",
    alternates: { canonical: `${SITE_URL}/${locale}/terms` },
  };
}

export default async function TermsPage({
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
            이용약관
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>최종 수정일: 2026년</p>

            <h2>서비스 이용</h2>
            <p>
              NexaLab Toolbox의 도구들은 무료로 제공되며, 회원가입 없이 있는
              그대로(&quot;as is&quot;) 사용하실 수 있어요.
            </p>

            <h2>책임의 한계</h2>
            <p>
              도구의 처리 결과에 대해 정확성을 보장하려 노력하지만, 중요한
              문서나 데이터는 항상 별도로 백업해 주세요. 도구 사용으로 인해
              발생하는 손해에 대해 책임지지 않아요.
            </p>

            <h2>금지 행위</h2>
            <p>
              서비스를 불법적인 목적으로 사용하거나, 서비스의 정상적인 운영을
              방해하는 행위(예: 자동화된 과도한 요청)를 해서는 안 돼요.
            </p>

            <h2>약관 변경</h2>
            <p>
              본 약관은 사전 고지 없이 변경될 수 있어요. 변경 후에도 서비스를
              계속 사용하는 경우 변경된 약관에 동의한 것으로 간주해요.
            </p>

            <h2>문의</h2>
            <p>
              본 약관에 대한 문의는 <Link href="/ko/contact">문의 페이지</Link>를
              통해 보내주세요.
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Terms of Use
          </h1>
          <div className="prose prose-zinc mt-6 dark:prose-invert">
            <p>Last updated: 2026</p>

            <h2>Using the service</h2>
            <p>
              NexaLab Toolbox tools are provided free of charge and available
              on an &quot;as is&quot; basis, with no account required.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              While we aim for accurate results, please keep independent
              backups of any important documents or data. We are not liable
              for any damages arising from use of these tools.
            </p>

            <h2>Prohibited use</h2>
            <p>
              You may not use the service for unlawful purposes or in a way
              that disrupts normal operation (e.g. excessive automated
              requests).
            </p>

            <h2>Changes to these terms</h2>
            <p>
              These terms may change without prior notice. Continued use of
              the service after a change constitutes acceptance of the
              updated terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can be sent through the{" "}
              <Link href="/en/contact">Contact page</Link>.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
