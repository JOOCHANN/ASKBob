# Step 3 — 수집 파이프라인 (Playwright + OpenAI + diff + 인사이트 + timeline)

**Status**: ⏳ 대기

## Intent

경쟁사 데이터를 수집·구조화·비교·요약하는 전체 파이프라인을 `scripts/`에 구현한다.
**앱 API가 아니라 GitHub Actions(Node)에서 실행**되며, 결과를 `data/`에 커밋한다.
Cloudflare Workers는 Playwright 실행·파일쓰기가 불가하므로 수집과 표시를 분리한다.

## Expected Outcomes

- `npm run crawl` → 4개 경쟁사 페이지를 Playwright로 렌더 → `data/raw/<slug>/<date>.html`
- OpenAI JSON mode로 raw HTML → `Snapshot` 추출·정규화 → `data/snapshots/<slug>/<date>.json` (불변)
- 직전 스냅샷과 diff → 변경 시 `data/changes.json`에 append (한국어 AI 요약 포함)
- `data/timeline.json` 통합본 재생성 (Bob 포함)
- 크롤 실패 시 해당 제품만 스킵, 나머지 정상 진행 (부분 실패 허용)

## Todo List

- [ ] `scripts/lib/targets.ts` — 4개 `CrawlTarget` + Bob(bob-static) 레지스트리
- [ ] `scripts/lib/paths.ts` — `data/` 경로 헬퍼, 오늘 날짜(YYYY-MM-DD)
- [ ] `scripts/lib/diff.ts` — `diffSnapshots(prev, next): Diff[]` (version/features/pricing/models)
- [ ] `scripts/lib/store.ts` — 스냅샷 read/write, 직전 스냅샷 조회, changes append, timeline 재생성
- [ ] `scripts/crawl.ts` — Playwright로 raw HTML 저장
- [ ] `scripts/extract.ts` — OpenAI JSON mode로 `Snapshot` 추출
- [ ] `scripts/pipeline.ts` — crawl→extract→저장→diff→insight→timeline 오케스트레이션
- [ ] `package.json`에 `playwright`/`openai`/`tsx` 의존성 + `crawl`/`pipeline` 스크립트

## Relevant Context

- OpenAI JSON mode: `response_format: { type: "json_object" }`, 프롬프트에 `Snapshot` 스키마 명시
- 인사이트: 변경 diff를 OpenAI로 한국어 1~2문장 요약 → `ChangeRecord.summary`
- 스냅샷은 **불변** — 같은 날짜 파일이 있으면 재처리(덮어쓰기) 가능하되 과거 날짜는 보존
- 원본(`data/raw`)이 있으므로 추출 로직 변경 시 재처리 가능
- Bob은 크롤 대상 아님 — `bob-static.json`을 그대로 스냅샷으로 사용
