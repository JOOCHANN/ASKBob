# Step 5 — 대시보드 UI (비교 / 타임라인 / 체인지로그)

**Status**: ⏳ 대기

## Intent

IBM Carbon 스타일로 메인 페이지를 구현한다. 기존 "최신 정보 갱신" 버튼 방식은 폐기(주간 자동 수집으로 대체)하고,
**최신 스냅샷 비교 + 시계열 변천 + 변경 이력**을 보여주는 세 가지 뷰를 제공한다.

## Expected Outcomes

- `/`에서 Bob vs 4개 경쟁사 **최신 스냅샷** 기능/가격 비교 (Bob 열 강조)
- 타임라인 뷰: 제품별 스냅샷 변천 (예: Cursor $20 → $25)
- 체인지로그 뷰: `changes.json` 주간 변경 요약 (AI 인사이트)
- IBM Carbon g100 다크 테마, 반응형

## Todo List

- [ ] `components/ComparisonTable.tsx` — `getLatestSnapshots()` 기반 기능/가격 매트릭스, Bob 열 강조
- [ ] `components/PricingCard.tsx` — 가격 플랜 카드
- [ ] `components/TimelineView.tsx` — `loadTimeline()` 기반 제품별 시점 변화
- [ ] `components/ChangeLog.tsx` — `loadChanges()` 기반 변경 요약 카드 (제품/날짜/요약)
- [ ] `app/page.tsx` — 세 뷰 조합, 마지막 업데이트(`timeline.updatedAt`) 표시

## Relevant Context

- 데이터는 모두 [lib/data-store.ts](../lib/data-store.ts)에서 정적 import (런타임 fetch 없음)
- Carbon 컴포넌트: `DataTable`, `Tile`, `Tabs`, `Tag`
- Bob 열 강조: `#0f62fe` 계열 배경
- 비교 항목: IDE 지원, 보안/컴플라이언스, 엔터프라이즈 지원, 모델 커스터마이징, 온프레미스, 가격, 지원 모델
- 갱신 버튼/`UpdateBanner`/`/api/crawl`은 폐기 — 수집은 주간 Actions가 담당
