import fs from "node:fs/promises";
import type { Snapshot, ChangeRecord, CrawlTarget } from "../lib/crawlers/types";
import { TARGETS, BOB } from "./lib/targets";
import { today, BOB_STATIC_FILE } from "./lib/paths";
import { saveRaw, saveSnapshot, loadPrevSnapshot, appendChanges, rebuildTimeline } from "./lib/store";
import { diffSnapshots } from "./lib/diff";
import { fetchRawHtml } from "./crawl";
import { extractSnapshot, summarizeChanges } from "./extract";

/** 대상의 모든 URL을 크롤(URL 단위 실패 허용) → raw 저장 → 종합 추출 → Snapshot */
async function crawlSnapshot(target: CrawlTarget, date: string): Promise<Snapshot> {
  const multi = target.sourceUrls.length > 1;
  const htmls: string[] = [];
  for (let i = 0; i < target.sourceUrls.length; i++) {
    const url = target.sourceUrls[i];
    try {
      console.log(`[crawl] ${target.product} ${url}`);
      const html = await fetchRawHtml(url);
      await saveRaw(target.slug, multi ? `${date}-${i + 1}` : date, html);
      htmls.push(html);
    } catch (err) {
      console.error(`  [url skip] ${url}:`, err instanceof Error ? err.message : err);
    }
  }
  if (htmls.length === 0) throw new Error("모든 URL 크롤 실패");
  return extractSnapshot(target, htmls, date);
}

/** Bob: 크롤 결과를 우선하되 빈 필드는 curated(bob-static)로 보완 */
function mergeBob(crawled: Snapshot, curated: Snapshot): Snapshot {
  const pick = <T>(a: T[], b: T[]) => (a.length ? a : b);
  return {
    product: crawled.product,
    collectedAt: crawled.collectedAt,
    sourceUrl: crawled.sourceUrl,
    version: crawled.version || curated.version,
    pricing: crawled.pricing.length ? crawled.pricing : curated.pricing,
    features: pick(crawled.features, curated.features),
    models: pick(crawled.models, curated.models),
    supportedIDEs: pick(crawled.supportedIDEs, curated.supportedIDEs),
  };
}

/** 스냅샷 저장 후 직전 대비 변경을 ChangeRecord로 반환 (변경 없으면 null) */
async function recordSnapshot(slug: string, snap: Snapshot): Promise<ChangeRecord | null> {
  const prev = await loadPrevSnapshot(slug, snap.collectedAt);
  await saveSnapshot(slug, snap);
  const changes = diffSnapshots(prev, snap);
  if (changes.length === 0) return null;
  const summary = await summarizeChanges(snap.product, changes);
  return { product: snap.product, detectedAt: today(), from: prev?.collectedAt ?? null, to: snap.collectedAt, changes, summary };
}

async function main() {
  const date = today();
  const records: ChangeRecord[] = [];

  // 경쟁사: 크롤 → 추출 → 스냅샷 → diff (부분 실패 허용)
  for (const target of TARGETS) {
    try {
      const snap = await crawlSnapshot(target, date);
      const rec = await recordSnapshot(target.slug, snap);
      if (rec) records.push(rec);
    } catch (err) {
      console.error(`[skip] ${target.product}:`, err instanceof Error ? err.message : err);
    }
  }

  // Bob: 크롤 + 큐레이션 병행 (크롤 실패 시 curated 사용)
  try {
    const curated = JSON.parse(await fs.readFile(BOB_STATIC_FILE, "utf8")) as Snapshot;
    let snap: Snapshot;
    try {
      snap = mergeBob(await crawlSnapshot(BOB, date), curated);
    } catch (err) {
      console.error("[bob] 크롤 실패 → 큐레이션 사용:", err instanceof Error ? err.message : err);
      snap = { ...curated, collectedAt: date, sourceUrl: BOB.sourceUrls[0] };
    }
    const rec = await recordSnapshot(BOB.slug, snap);
    if (rec) records.push(rec);
  } catch (err) {
    console.error("[skip] IBM Bob:", err instanceof Error ? err.message : err);
  }

  await appendChanges(records);
  await rebuildTimeline();
  console.log(`[done] 변경 ${records.length}건, timeline 재생성 완료`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
