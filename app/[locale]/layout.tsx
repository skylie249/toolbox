import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { isLocale, LOCALES, otherLocale, type Locale } from "@/lib/i18n";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const adsenseClientId = "ca-pub-7463332684235098";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "ko";
  const other = otherLocale(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default:
        locale === "ko"
          ? `${SITE_NAME.ko} — 무료 온라인 데이터 유틸리티`
          : `${SITE_NAME.en} — Free Online Data Utilities`,
      template: `%s | ${SITE_NAME[locale]}`,
    },
    description: SITE_DESCRIPTION[locale],
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        [locale]: `${SITE_URL}/${locale}`,
        [other]: `${SITE_URL}/${other}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME[locale],
      url: `${SITE_URL}/${locale}`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <SiteHeader locale={locale} />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
