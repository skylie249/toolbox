import { PDFDocument } from "pdf-lib";

export const MAX_FILE_SIZE_MB = 50;
export const MAX_TOTAL_SIZE_MB = 100;

export class PdfToolError extends Error {}

async function loadPdf(file: File): Promise<PDFDocument> {
  const bytes = await file.arrayBuffer();
  try {
    return await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch (err) {
    if (err instanceof Error && /encrypted/i.test(err.message)) {
      throw new PdfToolError("password-protected");
    }
    throw new PdfToolError("corrupted");
  }
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const doc = await loadPdf(file);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}

/** Parses a page-range string like "1-3, 5, 7-9" into a zero-based, deduped, ordered index list. */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const indices = new Set<number>();
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new PdfToolError("empty-range");
  }

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);

    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start < 1 || end > pageCount || start > end) {
        throw new PdfToolError("invalid-range");
      }
      for (let i = start; i <= end; i++) indices.add(i - 1);
    } else if (singleMatch) {
      const page = parseInt(singleMatch[1], 10);
      if (page < 1 || page > pageCount) {
        throw new PdfToolError("invalid-range");
      }
      indices.add(page - 1);
    } else {
      throw new PdfToolError("invalid-format");
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export async function extractPages(file: File, pageRanges: string): Promise<Uint8Array> {
  const doc = await loadPdf(file);
  const pageCount = doc.getPageCount();
  const indices = parsePageRanges(pageRanges, pageCount);

  const result = await PDFDocument.create();
  const pages = await result.copyPages(doc, indices);
  pages.forEach((page) => result.addPage(page));
  return result.save();
}

export async function getPageCount(file: File): Promise<number> {
  const doc = await loadPdf(file);
  return doc.getPageCount();
}
