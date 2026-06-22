import fs from "node:fs/promises";
import path from "node:path";
import type { Snapshot, ChangeRecord, Timeline } from "../../lib/crawlers/types";
import { RAW_DIR, SNAP_DIR, TIMELINE_FILE, CHANGES_FILE } from "./paths";

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Layer 1: 크롤 원본 HTML 저장 (불변). name 은 보통 날짜, 다중 URL이면 `날짜-n` */
export async function saveRaw(slug: string, name: string, html: string): Promise<void> {
  const dir = path.join(RAW_DIR, slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${name}.html`), html, "utf8");
}

/** Layer 2+3: 스냅샷 저장 (불변, 파일명 = collectedAt) */
export async function saveSnapshot(slug: string, snap: Snapshot): Promise<void> {
  const dir = path.join(SNAP_DIR, slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${snap.collectedAt}.json`), JSON.stringify(snap, null, 2) + "\n", "utf8");
}

/** 특정 날짜 직전(미만)의 가장 최근 스냅샷. 없으면 null */
export async function loadPrevSnapshot(slug: string, beforeDate: string): Promise<Snapshot | null> {
  const dir = path.join(SNAP_DIR, slug);
  let files: string[];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch {
    return null;
  }
  const prior = files
    .map((f) => f.replace(/\.json$/, ""))
    .filter((d) => d < beforeDate)
    .sort();
  const latest = prior.at(-1);
  if (!latest) return null;
  return JSON.parse(await fs.readFile(path.join(dir, `${latest}.json`), "utf8")) as Snapshot;
}

/** Layer 4: 변경 이력 append */
export async function appendChanges(records: ChangeRecord[]): Promise<void> {
  if (records.length === 0) return;
  const existing = await readJson<ChangeRecord[]>(CHANGES_FILE, []);
  await fs.writeFile(CHANGES_FILE, JSON.stringify([...existing, ...records], null, 2) + "\n", "utf8");
}

/** 모든 스냅샷 파일을 읽어 앱용 통합 timeline.json 재생성 */
export async function rebuildTimeline(): Promise<void> {
  const products: Record<string, Snapshot[]> = {};
  let slugs: string[];
  try {
    slugs = await fs.readdir(SNAP_DIR);
  } catch {
    slugs = [];
  }
  for (const slug of slugs) {
    const dir = path.join(SNAP_DIR, slug);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
    for (const file of files) {
      const snap = JSON.parse(await fs.readFile(path.join(dir, file), "utf8")) as Snapshot;
      (products[snap.product] ??= []).push(snap);
    }
  }
  const timeline: Timeline = { updatedAt: new Date().toISOString().slice(0, 10), products };
  await fs.writeFile(TIMELINE_FILE, JSON.stringify(timeline, null, 2) + "\n", "utf8");
}
