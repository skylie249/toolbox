"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  extractPages,
  mergePdfs,
  MAX_FILE_SIZE_MB,
  MAX_TOTAL_SIZE_MB,
  PdfToolError,
} from "@/lib/pdfTools";
import { downloadBinaryFile } from "@/lib/download";

type Copy = {
  tabMerge: string;
  tabSplit: string;
  dropMulti: string;
  dropSingle: string;
  trustNote: string;
  filesLabel: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  mergeButton: string;
  splitButton: string;
  rangeLabel: string;
  rangePlaceholder: string;
  processing: string;
  download: string;
  errorCorrupted: string;
  errorPassword: string;
  errorInvalidRange: string;
  errorInvalidFormat: string;
  errorEmptyRange: string;
  errorTooLarge: (mb: number) => string;
  errorTotalTooLarge: (mb: number) => string;
  errorNeedTwo: string;
  errorNeedOne: string;
  resultReady: string;
};

const copy: Record<Locale, Copy> = {
  ko: {
    tabMerge: "병합하기",
    tabSplit: "분리하기",
    dropMulti: "여기로 파일을 끌어다 놓거나 클릭해서 여러 PDF를 선택하세요",
    dropSingle: "여기로 파일을 끌어다 놓거나 클릭해서 PDF 1개를 선택하세요",
    trustNote: "업로드한 파일은 서버로 전송되지 않고 브라우저에서만 처리돼요",
    filesLabel: "업로드된 파일",
    moveUp: "위로",
    moveDown: "아래로",
    remove: "삭제",
    mergeButton: "병합하기",
    splitButton: "분리하기",
    rangeLabel: "페이지 범위 (예: 1-3, 5, 7-9)",
    rangePlaceholder: "예: 1-3, 5, 7-9",
    processing: "처리 중…",
    download: "다운로드",
    errorCorrupted: "손상된 PDF 파일이에요. 다른 파일로 시도해주세요.",
    errorPassword: "비밀번호로 보호된 PDF는 지원하지 않아요.",
    errorInvalidRange: "페이지 범위가 올바르지 않아요. 파일의 실제 페이지 수를 확인해주세요.",
    errorInvalidFormat: "페이지 범위 형식이 올바르지 않아요. 예: 1-3, 5, 7-9",
    errorEmptyRange: "페이지 범위를 입력해주세요.",
    errorTooLarge: (mb: number) => `파일당 최대 ${mb}MB까지 지원해요.`,
    errorTotalTooLarge: (mb: number) => `전체 파일 합계는 최대 ${mb}MB까지 지원해요.`,
    errorNeedTwo: "병합하려면 파일을 2개 이상 업로드해주세요.",
    errorNeedOne: "분리할 PDF 파일을 1개 업로드해주세요.",
    resultReady: "처리가 완료됐어요",
  },
  en: {
    tabMerge: "Merge",
    tabSplit: "Split",
    dropMulti: "Drag and drop, or click to select multiple PDF files",
    dropSingle: "Drag and drop, or click to select one PDF file",
    trustNote: "Uploaded files are never sent to a server — everything is processed in your browser",
    filesLabel: "Uploaded files",
    moveUp: "Up",
    moveDown: "Down",
    remove: "Remove",
    mergeButton: "Merge",
    splitButton: "Split",
    rangeLabel: "Page range (e.g. 1-3, 5, 7-9)",
    rangePlaceholder: "e.g. 1-3, 5, 7-9",
    processing: "Processing…",
    download: "Download",
    errorCorrupted: "This PDF appears to be corrupted. Try a different file.",
    errorPassword: "Password-protected PDFs aren't supported.",
    errorInvalidRange: "That page range is out of bounds — check the file's actual page count.",
    errorInvalidFormat: "Invalid page range format. Example: 1-3, 5, 7-9",
    errorEmptyRange: "Please enter a page range.",
    errorTooLarge: (mb: number) => `Each file can be at most ${mb}MB.`,
    errorTotalTooLarge: (mb: number) => `Total upload size can be at most ${mb}MB.`,
    errorNeedTwo: "Upload at least 2 files to merge.",
    errorNeedOne: "Upload one PDF file to split.",
    resultReady: "Done",
  },
};

export default function PdfApp({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [tab, setTab] = useState<"merge" | "split">("merge");

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Merge / Split"
        className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "merge"}
          onClick={() => setTab("merge")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
            tab === "merge"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          {c.tabMerge}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "split"}
          onClick={() => setTab("split")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
            tab === "split"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          {c.tabSplit}
        </button>
      </div>

      {tab === "merge" ? <MergePanel locale={locale} /> : <SplitPanel locale={locale} />}
    </div>
  );
}

function errorMessage(err: unknown, c: Copy): string {
  if (err instanceof PdfToolError) {
    switch (err.message) {
      case "corrupted":
        return c.errorCorrupted;
      case "password-protected":
        return c.errorPassword;
      case "invalid-range":
        return c.errorInvalidRange;
      case "invalid-format":
        return c.errorInvalidFormat;
      case "empty-range":
        return c.errorEmptyRange;
    }
  }
  return c.errorCorrupted;
}

function validateFiles(files: File[], c: Copy): string | null {
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return c.errorTooLarge(MAX_FILE_SIZE_MB);
    }
  }
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
    return c.errorTotalTooLarge(MAX_TOTAL_SIZE_MB);
  }
  return null;
}

function MergePanel({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles = Array.from(list);
    const combined = [...files, ...newFiles];
    const err = validateFiles(combined, c);
    setError(err);
    if (!err) setFiles(combined);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...files];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  const remove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError(c.errorNeedTwo);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const bytes = await mergePdfs(files);
      downloadBinaryFile("merged.pdf", bytes, "application/pdf");
    } catch (err) {
      setError(errorMessage(err, c));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 max-w-3xl">
      <DropZone
        multiple
        label={c.dropMulti}
        onFiles={handleFiles}
      />
      <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <span aria-hidden>🔒</span> {c.trustNote}
      </p>

      {files.length > 0 && (
        <div className="mt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {c.filesLabel} ({files.length})
          </span>
          <ul className="mt-2 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="truncate text-zinc-800 dark:text-zinc-200">{f.name}</span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === files.length - 1}
                    className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    {c.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleMerge}
        disabled={busy || files.length < 2}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
      >
        {busy ? c.processing : c.mergeButton}
      </button>
    </div>
  );
}

function SplitPanel({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const f = list[0];
    const err = validateFiles([f], c);
    setError(err);
    if (!err) setFile(f);
  };

  const handleSplit = async () => {
    if (!file) {
      setError(c.errorNeedOne);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const bytes = await extractPages(file, range);
      downloadBinaryFile("extracted.pdf", bytes, "application/pdf");
    } catch (err) {
      setError(errorMessage(err, c));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 max-w-3xl">
      <DropZone
        multiple={false}
        label={c.dropSingle}
        onFiles={handleFiles}
      />
      <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <span aria-hidden>🔒</span> {c.trustNote}
      </p>

      {file && (
        <p className="mt-3 truncate rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {file.name}
        </p>
      )}

      <div className="mt-4">
        <label htmlFor="page-range" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {c.rangeLabel}
        </label>
        <input
          id="page-range"
          type="text"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          placeholder={c.rangePlaceholder}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSplit}
        disabled={busy || !file || range.trim() === ""}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
      >
        {busy ? c.processing : c.splitButton}
      </button>
    </div>
  );
}

function DropZone({
  multiple,
  label,
  onFiles,
}: {
  multiple: boolean;
  label: string;
  onFiles: (files: FileList | null) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center text-sm transition-colors ${
        dragOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-zinc-300 bg-white hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-900"
      }`}
    >
      <span aria-hidden className="mb-2 text-2xl">
        📄
      </span>
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <input
        type="file"
        accept="application/pdf"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => onFiles(e.target.files)}
      />
    </label>
  );
}
