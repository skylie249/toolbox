import type { Locale } from "./i18n";

export const SITE_URL = "https://toolbox.nexalab.app";

export const SITE_NAME: Record<Locale, string> = {
  ko: "NexaLab Toolbox",
  en: "NexaLab Toolbox",
};

export const SITE_DESCRIPTION: Record<Locale, string> = {
  ko: "무료·빠른 브라우저 기반 데이터 유틸리티. 회원가입 없이, 파일은 브라우저 밖으로 나가지 않아요.",
  en: "Free, fast, browser-based data utilities. No sign-up, no data leaves your browser.",
};

export type ToolDefinition = {
  slug: string;
  emoji: string;
  name: Record<Locale, string>;
  shortName: Record<Locale, string>;
  tagline: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "json-csv",
    emoji: "🧩",
    name: {
      ko: "JSON/CSV 포맷터",
      en: "JSON/CSV Formatter",
    },
    shortName: {
      ko: "JSON/CSV 포맷터",
      en: "JSON/CSV Formatter",
    },
    tagline: {
      ko: "지저분한 JSON·CSV를 붙여넣으면 보기 좋게 정렬해요",
      en: "Paste messy JSON or CSV and get it instantly formatted",
    },
    description: {
      ko: "무료 온라인 JSON/CSV 포맷터. JSON을 정렬(Pretty Print)하거나 압축(Minify)하고, 문법 오류 위치를 바로 확인하세요. CSV는 표 형태로 렌더링하고 구분자를 자동으로 감지해요.",
      en: "Free online JSON/CSV formatter. Pretty-print or minify JSON, spot syntax errors instantly, and render CSV as a readable table with automatic delimiter detection.",
    },
  },
  {
    slug: "pdf",
    emoji: "📄",
    name: {
      ko: "PDF 분리·병합",
      en: "PDF Split & Merge",
    },
    shortName: {
      ko: "PDF 분리·병합",
      en: "PDF Split & Merge",
    },
    tagline: {
      ko: "필요한 페이지만 뽑거나 여러 PDF를 하나로 합쳐요",
      en: "Extract the pages you need or combine multiple PDFs into one",
    },
    description: {
      ko: "무료 온라인 PDF 분리·병합 도구. 여러 PDF 파일을 순서대로 합치거나, 하나의 PDF에서 원하는 페이지 범위만 추출하세요. 업로드한 파일은 서버로 전송되지 않고 브라우저에서만 처리돼요.",
      en: "Free online PDF split and merge tool. Combine multiple PDF files in order, or extract specific page ranges from one PDF. Files are processed entirely in your browser and never uploaded to a server.",
    },
  },
];

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
