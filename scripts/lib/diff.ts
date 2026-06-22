import type { Snapshot, Diff } from "../../lib/crawlers/types";

const listDiff = (prev: string[], next: string[]) => ({
  added: next.filter((x) => !prev.includes(x)),
  removed: prev.filter((x) => !next.includes(x)),
});

/** 직전 스냅샷 대비 변경 필드 목록. prev 가 없으면(최초 수집) 빈 배열. */
export function diffSnapshots(prev: Snapshot | null, next: Snapshot): Diff[] {
  if (!prev) return [];
  const changes: Diff[] = [];

  if (prev.version !== next.version) {
    changes.push({ field: "version", old: prev.version, new: next.version });
  }

  const f = listDiff(prev.features, next.features);
  if (f.added.length) changes.push({ field: "features.added", old: "", new: f.added.join(", ") });
  if (f.removed.length) changes.push({ field: "features.removed", old: f.removed.join(", "), new: "" });

  const m = listDiff(prev.models, next.models);
  if (m.added.length) changes.push({ field: "models.added", old: "", new: m.added.join(", ") });
  if (m.removed.length) changes.push({ field: "models.removed", old: m.removed.join(", "), new: "" });

  const priceStr = (s: Snapshot) => s.pricing.map((p) => `${p.plan}:${p.price}`).join("|");
  if (priceStr(prev) !== priceStr(next)) {
    changes.push({ field: "pricing", old: priceStr(prev), new: priceStr(next) });
  }

  return changes;
}
