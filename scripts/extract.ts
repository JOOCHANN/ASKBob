import OpenAI from "openai";
import type { Snapshot, Diff, CrawlTarget } from "../lib/crawlers/types";

const MODEL = "gpt-4o-mini";

/** HTML에서 스크립트/스타일/태그를 제거해 LLM 입력용 텍스트로 정리 */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SCHEMA_HINT = `{
  "version": "string (없으면 'latest')",
  "pricing": [{ "plan": "string", "price": "string (예: '20', '문의', 'Free')", "unit": "string (예: 'user/month')", "features": ["string"] }],
  "features": ["string — 핵심 기능 및 차별점 5~8개, 한국어. 에이전트/자동완성/코드리뷰/보안/온프레미스/엔터프라이즈 지원/커스텀 등 셀러 비교에 의미 있는 항목 위주로 구체적으로"],
  "models": ["string — 지원 LLM (예: GPT-5, Claude Sonnet 4)"],
  "supportedIDEs": ["string — IDE/터미널/브라우저 등 통합 환경"]
}`;

/** 여러 페이지의 raw HTML → 구조화 Snapshot (OpenAI JSON mode) */
export async function extractSnapshot(target: CrawlTarget, htmls: string[], date: string): Promise<Snapshot> {
  const openai = new OpenAI();
  const text = htmls.map(htmlToText).join("\n\n----- 다음 페이지 -----\n\n").slice(0, 32_000);
  const res = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `너는 AI 코딩 어시스턴트의 공식 페이지에서 가격/기능/지원모델 정보를 추출하는 도구다. 아래 JSON 스키마로만 응답하라. 여러 페이지가 주어지면 종합하라. 페이지에 없는 정보는 빈 배열/문자열로 둔다.\n${SCHEMA_HINT}`,
      },
      { role: "user", content: `제품: ${target.product}\n출처: ${target.sourceUrls.join(", ")}\n\n페이지 텍스트:\n${text}` },
    ],
  });
  const parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}");
  return {
    product: target.product,
    collectedAt: date,
    sourceUrl: target.sourceUrls[0],
    version: parsed.version ?? "latest",
    pricing: Array.isArray(parsed.pricing) ? parsed.pricing : [],
    features: Array.isArray(parsed.features) ? parsed.features : [],
    models: Array.isArray(parsed.models) ? parsed.models : [],
    supportedIDEs: Array.isArray(parsed.supportedIDEs) ? parsed.supportedIDEs : [],
  };
}

/** 변경 diff → 한국어 1~2문장 인사이트 요약 */
export async function summarizeChanges(product: string, changes: Diff[]): Promise<string> {
  const openai = new OpenAI();
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "AI 코딩 도구의 변경사항을 셀러 관점에서 한국어 1~2문장으로 간결히 요약하라." },
      { role: "user", content: `${product} 변경:\n${changes.map((c) => `- ${c.field}: "${c.old}" → "${c.new}"`).join("\n")}` },
    ],
  });
  return res.choices[0]?.message?.content?.trim() ?? "";
}
