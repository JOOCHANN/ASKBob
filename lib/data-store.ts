import type { Snapshot, ChangeRecord, Timeline } from "./crawlers/types";
import timelineData from "@/data/timeline.json";
import changesData from "@/data/changes.json";

// 앱은 파이프라인이 생성한 통합본을 정적 import 만 한다 (쓰기/KV 없음).
// 데이터 수집·저장은 scripts/pipeline.ts (GitHub Actions) 가 담당한다.
const timeline = timelineData as Timeline;
const changes = changesData as ChangeRecord[];

/** 제품별 전체 시계열 스냅샷 */
export function loadTimeline(): Timeline {
  return timeline;
}

/** 각 제품의 최신 스냅샷 (비교 대시보드용) */
export function getLatestSnapshots(): Snapshot[] {
  return Object.values(timeline.products)
    .map((snaps) => snaps[snaps.length - 1])
    .filter((s): s is Snapshot => Boolean(s));
}

/** 변경 이력 (최신순) */
export function loadChanges(): ChangeRecord[] {
  return [...changes].sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
}
