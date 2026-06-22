# Step 5 — 메인 비교 대시보드 UI

**Status**: ⏳ 대기

## Intent

IBM Carbon Design System 스타일로 메인 페이지를 구현한다.
기능 비교 테이블, 가격 비교 카드, "최신 정보 갱신" 버튼, 변경사항 알림 배너를 포함한다.

## Expected Outcomes

- `/` 페이지에서 Bob vs 4개 경쟁사 기능/가격 비교 가능
- "최신 정보 갱신" 버튼 → 로딩 → 변경사항 배너 표시
- IBM Carbon g100 다크 테마 적용, Bob 열 시각적 강조
- 반응형 레이아웃

## Todo List

- [ ] `components/NavBar.tsx` — Carbon `Header`, IBM Bob 로고, 네비게이션
- [ ] `components/ComparisonTable.tsx` — Carbon `DataTable`, 기능 비교 (✓/✗), Bob 열 강조
- [ ] `components/PricingCard.tsx` — Carbon `Tile`, 가격 플랜 카드
- [ ] `components/UpdateBanner.tsx` — Carbon `InlineNotification`, 변경사항 알림
- [ ] `app/page.tsx` — 레이아웃 조합, 초기 데이터 로드, 갱신 버튼 로직
- [ ] 마지막 업데이트 날짜/시간 표시

## Relevant Context

- Carbon 컴포넌트: `DataTable`, `Tile`, `Button`, `InlineNotification`, `Header`, `Loading`
- Bob 열 강조: `#0f62fe` 계열 배경색 (다른 열과 시각적 구분)
- 기능 비교 항목:
  - IDE 지원 범위
  - 보안 / 컴플라이언스 (SOC2, GDPR 등)
  - 엔터프라이즈 지원 (SLA, 전담 지원)
  - 모델 커스터마이징
  - 온프레미스 배포 가능 여부
  - 가격 (Free / Pro / Enterprise)
- Step 3의 `/api/comparison-data`로 초기 데이터 로드
- Step 3의 `/api/crawl`로 갱신 트리거
