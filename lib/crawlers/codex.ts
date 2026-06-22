import type { ProductData } from "./types";

export const CODEX_SOURCE_URL = "https://platform.openai.com/docs/codex";

export async function fetchCodexData(): Promise<ProductData> {
  const res = await fetch(CODEX_SOURCE_URL);
  const html = await res.text();
  return { name: "OpenAI Codex", sourceUrl: CODEX_SOURCE_URL, rawHtml: html } as unknown as ProductData;
}
