import type { ProductData } from "./types";

export const CURSOR_SOURCE_URL = "https://cursor.com/pricing";

export async function fetchCursorData(): Promise<ProductData> {
  const res = await fetch(CURSOR_SOURCE_URL);
  const html = await res.text();
  return { name: "Cursor", sourceUrl: CURSOR_SOURCE_URL, rawHtml: html } as unknown as ProductData;
}
