import { parse as jsoncParse, printParseErrorCode, ParseError } from "jsonc-parser";
import Papa from "papaparse";

function friendlyParseErrorMessage(code: string): string {
  // printParseErrorCode returns names like "PropertyNameExpected" — turn
  // CamelCase into a readable phrase.
  return code.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export type JsonValidationResult =
  | { valid: true; value: unknown }
  | { valid: false; message: string; line: number; column: number };

/**
 * Validates and parses JSON text, returning precise line/column info on error
 * (native JSON.parse error messages are inconsistent across engines).
 */
export function validateJson(text: string): JsonValidationResult {
  const errors: ParseError[] = [];
  const value = jsoncParse(text, errors, {
    allowTrailingComma: false,
    disallowComments: true,
  });

  if (errors.length > 0) {
    const err = errors[0];
    const upTo = text.slice(0, err.offset);
    const line = upTo.split("\n").length;
    const lastNewline = upTo.lastIndexOf("\n");
    const column = err.offset - lastNewline;
    return {
      valid: false,
      message: friendlyParseErrorMessage(printParseErrorCode(err.error)),
      line,
      column,
    };
  }

  if (text.trim() === "") {
    return { valid: false, message: "Empty input", line: 1, column: 1 };
  }

  return { valid: true, value };
}

export function prettyPrintJson(value: unknown, indent: 2 | 4): string {
  return JSON.stringify(value, null, indent);
}

export function minifyJson(value: unknown): string {
  return JSON.stringify(value);
}

export type CsvDelimiter = "," | ";" | "\t" | "auto";

export type CsvParseResult = {
  headers: string[];
  rows: string[][];
  delimiter: string;
  errors: Papa.ParseError[];
};

export function parseCsv(text: string, delimiter: CsvDelimiter): CsvParseResult {
  const result = Papa.parse<string[]>(text, {
    delimiter: delimiter === "auto" ? "" : delimiter,
    skipEmptyLines: true,
  });

  const data = result.data;
  const headers = data.length > 0 ? data[0] : [];
  const rows = data.slice(1);

  return {
    headers,
    rows,
    delimiter: result.meta.delimiter,
    errors: result.errors,
  };
}

export function csvToDownloadText(headers: string[], rows: string[][]): string {
  return Papa.unparse([headers, ...rows]);
}
