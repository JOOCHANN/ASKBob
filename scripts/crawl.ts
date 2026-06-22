import { chromium } from "playwright";

/**
 * JS 렌더링된 페이지 HTML을 가져온다. (GitHub Actions에서 실행)
 * 단일 브라우저를 재사용하려면 호출부에서 순차 실행한다.
 */
export async function fetchRawHtml(url: string): Promise<string> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    return await page.content();
  } finally {
    await browser.close();
  }
}
