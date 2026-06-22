import { chromium } from "playwright";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * JS 렌더링된 페이지 HTML을 가져온다. (GitHub Actions에서 실행)
 * networkidle 은 SPA(claude.com/cursor.com 등)에서 타임아웃되기 쉬우므로
 * domcontentloaded 후 고정 렌더 대기로 본문을 받는다.
 */
export async function fetchRawHtml(url: string): Promise<string> {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ userAgent: USER_AGENT, viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForTimeout(4_000); // 클라이언트 렌더 대기
    return await page.content();
  } finally {
    await browser.close();
  }
}
