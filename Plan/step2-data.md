# Step 2 — 데이터 모델 & 4계층 저장 레이아웃

**Status**: ✅ 완료

## Intent

"모든 것은 시점의 스냅샷이며 절대 덮어쓰지 않는다"를 구현할 데이터 모델과 저장 레이아웃을 정의한다.
기존 단일 가변 캐시(`comparison-cache`) 구조를 폐기하고, 불변 시계열 스냅샷 + 원본 보존 + 변경 이력 구조로 전환한다.

## Expected Outcomes

- `Snapshot` / `ChangeRecord` / `Timeline` / `CrawlTarget` 타입 정의
- `data/` 4계층 레이아웃 확정 (raw / snapshots / timeline / changes)
- `bob-static.json`을 새 스냅샷 스키마(`product`, `collectedAt`, `models`)에 맞춤
- 앱은 통합본만 read (쓰기·KV 없음)

## Todo List

- [x] [lib/crawlers/types.ts](../lib/crawlers/types.ts)에 `Snapshot`/`ChangeRecord`/`Timeline`/`CrawlTarget` 추가, 구 `ProductData` 폐기
- [x] 4개 크롤러 파일을 `CrawlTarget` 디스크립터로 재작성 (fetch 스텁 + `as unknown` 해킹 제거)
- [x] [lib/data-store.ts](../lib/data-store.ts) — KV/쓰기/diff 제거, `loadTimeline`/`getLatestSnapshots`/`loadChanges` read 함수로 교체
- [x] `data/{timeline.json, changes.json}` 초기 생성, `data/snapshots/ibm-bob/<date>.json` 샘플 스냅샷
- [x] `bob-static.json` 새 스키마 반영

## Relevant Context

- 디렉터리는 제품 **슬러그**(`copilot`, `claude-code`, `codex`, `cursor`, `ibm-bob`) 기준
- `Snapshot.features`는 Bob 중심 비교 유지를 위해 평면 배열 유지
- `models` 신규 필드 — 지원 모델(GPT/Claude/Granite) 추적
- 통합본(`timeline.json`/`changes.json`)은 파이프라인이 매 실행 재생성 → Cloudflare 정적 import
