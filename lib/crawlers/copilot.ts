import type { ProductData } from "./types";

export const COPILOT_SOURCE_URL = "https://github.com/features/copilot/plans";

export async function fetchCopilotData(): Promise<ProductData> {
  const res = await fetch(COPILOT_SOURCE_URL);
  const html = await res.text();
  return { name: "GitHub Copilot", sourceUrl: COPILOT_SOURCE_URL, rawHtml: html } as unknown as ProductData;
}
