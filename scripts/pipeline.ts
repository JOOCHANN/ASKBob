import fs from "node:fs/promises";
import type { Snapshot, ChangeRecord } from "../lib/crawlers/types";
import { TARGETS, BOB_SLUG } from "./lib/targets";
import { today, BOB_STATIC_FILE } from "./lib/paths";
import { saveRaw, saveSnapshot, loadPrevSnapshot, appendChanges, rebuildTimeline } from "./lib/store";
import { diffSnapshots } from "./lib/diff";
import { fetchRawHtml } from "./crawl";
import { extractSnapshot, summarizeChanges } from "./extract";

/** 한 스냅샷을 저장하고 직전 대비 변경을 ChangeRecord로 반환 (변경 없으면 null) */
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
      console.log(`[crawl] ${target.product} ${target.sourceUrl}`);
      const html = await fetchRawHtml(target.sourceUrl);
      await saveRaw(target.slug, date, html);
      const snap = await extractSnapshot(target, html, date);
      const rec = await recordSnapshot(target.slug, snap);
      if (rec) records.push(rec);
    } catch (err) {
      console.error(`[skip] ${target.product}:`, err instanceof Error ? err.message : err);
    }
  }

  // Bob: 수동 데이터(bob-static.json)를 스냅샷으로 사용 (크롤 안 함)
  try {
    const bob = JSON.parse(await fs.readFile(BOB_STATIC_FILE, "utf8")) as Snapshot;
    const rec = await recordSnapshot(BOB_SLUG, bob);
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
