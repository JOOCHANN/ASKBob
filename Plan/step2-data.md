# Step 2 — Bob 정적 데이터 및 크롤러 기반 구조

**Status**: ⏳ 대기

## Intent

IBM Bob의 기능/가격 데이터를 JSON으로 정의하고, 4개 경쟁사 크롤러의 공통 인터페이스와 데이터 구조를 설계한다.
UI 컴포넌트가 일관된 형태로 데이터를 소비할 수 있도록 타입을 표준화한다.

## Expected Outcomes

- `data/bob-static.json` — Bob 기능 목록, 가격 플랜, 지원 IDE, 보안 특징
- `lib/crawlers/types.ts` — 공통 `ProductData` 타입
- 크롤러 4개 스텁 (`copilot.ts`, `claude-code.ts`, `codex.ts`, `cursor.ts`)
- `lib/data-store.ts` — save / load / diff 함수
- `lib/bob-knowledge.ts` — 챗봇 시스템 프롬프트용 Bob 지식 텍스트

## Todo List

- [ ] `lib/crawlers/types.ts` — `ProductData`, `PricingPlan`, `Diff` 타입 정의
- [ ] `data/bob-static.json` — Bob 현재 기능/가격 입력
- [ ] 크롤러 4개 스텁 생성 (`fetchProductData(): Promise<ProductData>` 인터페이스)
- [ ] `lib/data-store.ts` — save / load / diff 구현
- [ ] `lib/bob-knowledge.ts` — Bob 셀링 포인트 텍스트 정리

## Relevant Context

- `ProductData` 구조:
  ```ts
  { name, version, features: string[], pricing: PricingPlan[], supportedIDEs: string[], lastUpdated: string, sourceUrl: string }
  ```
- `PricingPlan` 구조:
  ```ts
  { plan: string, price: string, unit: string, features: string[] }
  ```
- `Diff` 구조:
  ```ts
  { field: string, old: string, new: string }
  ```
- diff 결과는 Step 5의 `UpdateBanner` 컴포넌트에 전달됨
- Bob 데이터는 수동 관리 (공식 내부 자료 기반) — 크롤링 대상 아님
