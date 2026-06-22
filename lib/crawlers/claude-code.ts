import type { ProductData } from "./types";

export const CLAUDE_SOURCE_URL = "https://claude.ai/code";

export async function fetchClaudeCodeData(): Promise<ProductData> {
  const res = await fetch(CLAUDE_SOURCE_URL);
  const html = await res.text();
  return { name: "Claude Code", sourceUrl: CLAUDE_SOURCE_URL, rawHtml: html } as unknown as ProductData;
}
