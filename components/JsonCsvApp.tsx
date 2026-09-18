"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  minifyJson,
  parseCsv,
  prettyPrintJson,
  validateJson,
  csvToDownloadText,
  type CsvDelimiter,
} from "@/lib/jsonCsv";
import { downloadTextFile } from "@/lib/download";

const copy = {
  ko: {
    tabJson: "JSON",
    tabCsv: "CSV",
    inputLabel: "붙여넣기",
    resultLabel: "결과",
    placeholderJson: "여기에 JSON을 붙여넣으세요…",
    placeholderCsv: "여기에 CSV를 붙여넣으세요…",
    clear: "초기화",
    copy: "복사",
    copied: "복사됨!",
    download: "다운로드",
    indent: "들여쓰기",
    minify: "압축(Minify)",
    pretty: "정렬(Pretty)",
    valid: "유효한 JSON이에요",
    invalidAt: (line: number, col: number) => `${line}번째 줄, ${col}번째 칸에 오류가 있어요`,
    empty: "결과가 여기에 표시돼요",
    delimiter: "구분자",
    delimiterAuto: "자동 감지",
    delimiterComma: "쉼표 (,)",
    delimiterSemicolon: "세미콜론 (;)",
    delimiterTab: "탭",
    detected: (d: string) => `감지된 구분자: ${d === "\t" ? "탭" : d}`,
    csvEmpty: "CSV 데이터를 붙여넣으면 표로 보여드려요",
    rowCount: (n: number) => `${n}행`,
  },
  en: {
    tabJson: "JSON",
    tabCsv: "CSV",
    inputLabel: "Paste input",
    resultLabel: "Result",
    placeholderJson: "Paste your JSON here…",
    placeholderCsv: "Paste your CSV here…",
    clear: "Clear",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    indent: "Indent",
    minify: "Minify",
    pretty: "Pretty",
    valid: "Valid JSON",
    invalidAt: (line: number, col: number) => `Error at line ${line}, column ${col}`,
    empty: "Result appears here",
    delimiter: "Delimiter",
    delimiterAuto: "Auto-detect",
    delimiterComma: "Comma (,)",
    delimiterSemicolon: "Semicolon (;)",
    delimiterTab: "Tab",
    detected: (d: string) => `Detected delimiter: ${d === "\t" ? "Tab" : d}`,
    csvEmpty: "Paste CSV data to see it as a table",
    rowCount: (n: number) => `${n} rows`,
  },
} as const;

export default function JsonCsvApp({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [tab, setTab] = useState<"json" | "csv">("json");

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="JSON / CSV"
        className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "json"}
          onClick={() => setTab("json")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
            tab === "json"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          {c.tabJson}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "csv"}
          onClick={() => setTab("csv")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
            tab === "csv"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          {c.tabCsv}
        </button>
      </div>

      {tab === "json" ? <JsonPanel locale={locale} /> : <CsvPanel locale={locale} />}
    </div>
  );
}

function JsonPanel({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [text, setText] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => validateJson(text), [text]);

  const output = useMemo(() => {
    if (text.trim() === "" || !validation.valid) return "";
    return mode === "pretty"
      ? prettyPrintJson(validation.value, indent)
      : minifyJson(validation.value);
  }, [text, validation, mode, indent]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!output) return;
    downloadTextFile("formatted.json", output, "application/json");
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setMode("pretty")}
            className={`px-3 py-1.5 text-xs font-semibold ${
              mode === "pretty"
                ? "bg-blue-600 text-white"
                : "bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {c.pretty}
          </button>
          <button
            type="button"
            onClick={() => setMode("minify")}
            className={`px-3 py-1.5 text-xs font-semibold ${
              mode === "minify"
                ? "bg-blue-600 text-white"
                : "bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {c.minify}
          </button>
        </div>

        {mode === "pretty" && (
          <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            {c.indent}
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value) as 2 | 4)}
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </label>
        )}
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="json-input" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {c.inputLabel}
            </label>
            <button
              type="button"
              onClick={() => setText("")}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              {c.clear}
            </button>
          </div>
          <textarea
            id="json-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={c.placeholderJson}
            spellCheck={false}
            className="h-80 w-full resize-y rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {text.trim() !== "" && (
            <p
              className={`mt-2 text-xs font-medium ${
                validation.valid ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {validation.valid ? c.valid : c.invalidAt(validation.line, validation.column)}
              {!validation.valid && `: ${validation.message}`}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {c.resultLabel}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-blue-400 dark:hover:bg-blue-950 dark:disabled:text-zinc-700"
              >
                {copied ? c.copied : c.copy}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output}
                className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-blue-400 dark:hover:bg-blue-950 dark:disabled:text-zinc-700"
              >
                {c.download}
              </button>
            </div>
          </div>
          <pre className="h-80 w-full overflow-auto rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            {output || <span className="text-zinc-400 dark:text-zinc-600">{c.empty}</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}

function CsvPanel({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [text, setText] = useState("");
  const [delimiter, setDelimiter] = useState<CsvDelimiter>("auto");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    if (text.trim() === "") return null;
    return parseCsv(text, delimiter);
  }, [text, delimiter]);

  const handleCopy = async () => {
    if (!parsed) return;
    try {
      await navigator.clipboard.writeText(csvToDownloadText(parsed.headers, parsed.rows));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!parsed) return;
    downloadTextFile("formatted.csv", csvToDownloadText(parsed.headers, parsed.rows), "text/csv");
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {c.delimiter}
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as CsvDelimiter)}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <option value="auto">{c.delimiterAuto}</option>
            <option value=",">{c.delimiterComma}</option>
            <option value=";">{c.delimiterSemicolon}</option>
            <option value="\t">{c.delimiterTab}</option>
          </select>
        </label>
        {parsed && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {c.detected(parsed.delimiter)} · {c.rowCount(parsed.rows.length)}
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="csv-input" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {c.inputLabel}
            </label>
            <button
              type="button"
              onClick={() => setText("")}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              {c.clear}
            </button>
          </div>
          <textarea
            id="csv-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={c.placeholderCsv}
            spellCheck={false}
            className="h-80 w-full resize-y rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {c.resultLabel}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!parsed}
                className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-blue-400 dark:hover:bg-blue-950 dark:disabled:text-zinc-700"
              >
                {copied ? c.copied : c.copy}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!parsed}
                className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-blue-400 dark:hover:bg-blue-950 dark:disabled:text-zinc-700"
              >
                {c.download}
              </button>
            </div>
          </div>
          <div className="h-80 w-full overflow-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {parsed ? (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    {parsed.headers.map((h, i) => (
                      <th key={i} className="whitespace-nowrap border-b border-zinc-200 px-3 py-2 font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-950/50">
                      {row.map((cell, j) => (
                        <td key={j} className="whitespace-nowrap border-b border-zinc-100 px-3 py-1.5 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-400 dark:text-zinc-600">
                {c.csvEmpty}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
