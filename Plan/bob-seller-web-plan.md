# IBM Bob Seller Web — 개발 플랜

## 개요

IBM Bob 테크 셀러를 위한 웹 애플리케이션. AI 코드 어시스턴트 경쟁사(GitHub Copilot, Claude Code, OpenAI Codex, Cursor)와 IBM Bob을 기능 및 가격 측면에서 비교하며, OpenAI API 기반 Q&A 챗봇을 제공한다.

### 핵심 목표
- 셀러가 경쟁사 대비 Bob의 이점을 즉시 파악하고 고객에게 설명할 수 있는 레퍼런스 페이지
- 경쟁사 공식 사이트를 자동 크롤링하여 버튼 하나로 최신 정보를 갱신
- Bob 관련 질문에 OpenAI API가 답변하는 챗봇 내장

### 기술 스택
- **프레임워크**: Next.js 14 (App Router) + TypeScript
- **스타일**: Tailwind CSS + IBM Carbon Design System (`@carbon/react`)
- **배포**: Cloudflare Pages (`@cloudflare/next-on-pages`, Edge Runtime)
- **AI**: OpenAI API (GPT-4o)
- **크롤링**: Cheerio + node-fetch (서버사이드 Edge 호환)
- **환경변수**: 로컬 `.env.local`, 배포 시 Cloudflare 환경변수

### 비교 대상 제품
| 제품 | 공식 사이트 |
|------|------------|
| GitHub Copilot | github.com/features/copilot |
| Claude Code | claude.ai/code |
| OpenAI Codex | platform.openai.com/docs/codex |
| Cursor | cursor.com |
| **IBM Bob** | (내부 자료 기반) |

### 폴더 구조
```
Plan/
  bob-seller-web-plan.md        ← 이 파일
bob-seller-web/
  app/
    page.tsx                    ← 메인 랜딩 (비교 대시보드)
    chat/
      page.tsx                  ← Q&A 챗봇 페이지
    api/
      crawl/route.ts            ← 크롤링 + AI 분석 API
      chat/route.ts             ← OpenAI 챗봇 API
      comparison-data/route.ts  ← 저장된 비교 데이터 반환
  components/
    ComparisonTable.tsx         ← 기능 비교 테이블
    PricingCard.tsx             ← 가격 비교 카드
    ChatPanel.tsx               ← 챗봇 UI
    UpdateBanner.tsx            ← 변경사항 알림 배너
    NavBar.tsx                  ← IBM Carbon 스타일 네비게이션
  lib/
    crawlers/
      copilot.ts                ← GitHub Copilot 크롤러
      claude-code.ts            ← Claude Code 크롤러
      codex.ts                  ← OpenAI Codex 크롤러
      cursor.ts                 ← Cursor 크롤러
    openai.ts                   ← OpenAI API 클라이언트
    data-store.ts               ← Cloudflare KV 또는 로컬 JSON 저장소
    bob-knowledge.ts            ← Bob 제품 정보 정적 데이터
  data/
    bob-static.json             ← Bob 기능/가격 정보 (수동 관리)
    comparison-cache.json       ← 크롤링 결과 캐시 (gitignore)
  .env.local.example            ← 환경변수 템플릿
  .gitignore
```

---

## Step 1 — 프로젝트 초기화 및 환경 설정

**Intent**
Next.js + TypeScript + Tailwind + IBM Carbon + Cloudflare 배포 환경을 올바르게 구성한다. 특히 Cloudflare Pages의 Edge Runtime 호환성을 처음부터 설정하여 나중에 배포 문제가 생기지 않도록 한다.

**Expected Outcomes**
- `bob-seller-web/` 프로젝트가 `npm run dev`로 로컬 실행 가능
- IBM Carbon Design System 컴포넌트가 렌더링됨
- `.env.local.example` 파일로 필요한 환경변수 문서화
- `.gitignore`에 `.env.local`, `comparison-cache.json` 포함
- `npm run build` 및 `npx wrangler pages dev` 빌드 성공

**Todo List**
1. `create-next-app`으로 프로젝트 생성 (App Router, TypeScript, Tailwind 포함)
2. `@carbon/react`, `@carbon/icons-react` 설치
3. `@cloudflare/next-on-pages` 설치 및 `next.config.ts` Edge Runtime 설정
4. Tailwind + Carbon CSS import 설정 (`app/globals.css`)
5. `.env.local.example` 작성 (`OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`)
6. `.gitignore` 설정 (`.env.local`, `comparison-cache.json`, `.wrangler/`)
7. IBM Carbon 테마(g100 dark 또는 white) 전역 적용

**Relevant Context**
- Cloudflare Pages + Next.js: `export const runtime = 'edge'`를 각 API Route에 선언해야 함
- Carbon Design System: `<Theme theme="g100">` 래퍼로 전역 테마 적용
- Bob 브랜드 색상: IBM Blue (#0f62fe), IBM Gray (#161616)

**Status**: [ ] pending

---

## Step 2 — Bob 정적 데이터 및 크롤러 기반 구조

**Intent**
IBM Bob의 기능/가격 데이터를 JSON으로 정의하고, 각 경쟁사 크롤러의 공통 인터페이스와 데이터 구조를 설계한다. 크롤러가 수집해야 할 데이터 필드를 표준화하여 이후 UI 컴포넌트가 일관되게 소비할 수 있도록 한다.

**Expected Outcomes**
- `data/bob-static.json` — Bob의 기능 목록, 가격 플랜, 지원 IDE, 보안 특징 포함
- `lib/crawlers/types.ts` — 모든 크롤러가 반환하는 공통 `ProductData` 타입 정의
- 크롤러 4개(`copilot.ts`, `claude-code.ts`, `codex.ts`, `cursor.ts`) 스텁(stub) 구현
- `lib/data-store.ts` — 크롤링 결과를 로컬 파일(`comparison-cache.json`) 또는 Cloudflare KV에 저장/로드하는 인터페이스

**Todo List**
1. `ProductData` 타입 정의: `name`, `version`, `features[]`, `pricing[]`, `supportedIDEs[]`, `lastUpdated`, `sourceUrl`
2. `data/bob-static.json` 작성 — Bob의 현재 기능 및 가격 정보 입력
3. 각 크롤러 파일 생성 및 `fetchProductData(): Promise<ProductData>` 인터페이스 구현
4. `lib/data-store.ts` 구현 — save/load/diff 함수 (이전 데이터와 신규 데이터 비교해 변경사항 반환)
5. `lib/bob-knowledge.ts` — 챗봇이 참조할 Bob 특징 텍스트 정리 (RAG용 컨텍스트)

**Relevant Context**
- `ProductData.pricing[]`은 `{ plan: string, price: string, unit: string, features: string[] }` 구조
- diff 결과는 `{ field: string, old: string, new: string }[]` 형태로 `UpdateBanner`에 전달됨
- Cloudflare KV 사용 시 `@cloudflare/workers-types` 필요; 로컬에서는 JSON 파일로 fallback

**Status**: [ ] pending

---

## Step 3 — 크롤링 API Route 및 OpenAI 구조화

**Intent**
버튼 클릭 시 호출되는 `/api/crawl` 엔드포인트를 구현한다. 각 경쟁사 사이트를 크롤링하고, 크롤링된 원시 HTML을 OpenAI API로 전달해 `ProductData` 형식의 구조화된 JSON을 추출한다. 이전 데이터와 비교해 변경사항을 감지한다.

**Expected Outcomes**
- `POST /api/crawl` 호출 시 4개 경쟁사 데이터 수집 완료
- OpenAI가 각 사이트의 HTML에서 기능/가격 정보를 `ProductData` JSON으로 추출
- 이전 캐시와 비교한 diff 결과 반환 (`{ product, changes[] }[]`)
- 크롤링 실패 시 해당 제품만 에러 표시, 나머지는 정상 진행 (부분 실패 허용)

**Todo List**
1. `app/api/crawl/route.ts` 생성, `export const runtime = 'edge'` 선언
2. 각 크롤러에서 공식 Pricing/Features 페이지 HTML fetch + Cheerio로 텍스트 추출
3. 추출된 텍스트를 OpenAI `gpt-4o` API에 전달, `ProductData` JSON 형식으로 구조화 요청 (function calling 또는 JSON mode 사용)
4. `data-store.ts`의 diff 함수로 변경사항 계산
5. 결과를 캐시에 저장하고 `{ products: ProductData[], diffs: Diff[] }` 응답 반환
6. `app/api/comparison-data/route.ts` — 캐시된 데이터 반환 (페이지 초기 로드용)

**Relevant Context**
- Edge Runtime에서 Cheerio 사용 가능 여부 확인 필요 (`cheerio`는 Node.js 의존성 있음 → `htmlparser2` 또는 `linkedom` 대체 고려)
- OpenAI JSON mode: `response_format: { type: "json_object" }` + 명확한 스키마 프롬프트
- 크롤링 대상 URL: Copilot(`github.com/features/copilot/plans`), Claude Code(`claude.ai/code`), Codex(`platform.openai.com/docs`), Cursor(`cursor.com/pricing`)

**Status**: [ ] pending

---

## Step 4 — OpenAI 챗봇 API Route

**Intent**
IBM Bob에 관한 셀러의 질문에 답변하는 챗봇 API를 구현한다. Bob의 정적 지식과 최신 크롤링 데이터를 컨텍스트로 제공하여, 경쟁사 대비 Bob의 이점을 정확하게 설명할 수 있도록 한다.

**Expected Outcomes**
- `POST /api/chat` — 사용자 메시지 + 대화 히스토리를 받아 OpenAI 스트리밍 응답 반환
- Bob 제품 지식(`bob-knowledge.ts`)과 최신 비교 데이터가 시스템 프롬프트에 주입됨
- 스트리밍 응답(`ReadableStream`)으로 타이핑 효과 구현

**Todo List**
1. `app/api/chat/route.ts` 생성, `export const runtime = 'edge'` 선언
2. 시스템 프롬프트 작성: Bob 셀러 어시스턴트 역할, Bob 지식 + 경쟁사 비교 데이터 주입
3. OpenAI `stream: true` 응답을 `ReadableStream`으로 클라이언트에 전달
4. `lib/openai.ts` — OpenAI 클라이언트 초기화 및 공통 헬퍼 함수

**Relevant Context**
- Edge Runtime에서 OpenAI SDK: `openai` 패키지 v4는 Edge 호환됨
- 시스템 프롬프트에는 Bob의 엔터프라이즈 보안, IBM 생태계 통합, 가격 경쟁력 등 핵심 셀링 포인트를 명시
- 대화 히스토리는 클라이언트에서 관리 (서버 세션 없음)

**Status**: [ ] pending

---

## Step 5 — 메인 비교 대시보드 UI

**Intent**
IBM Carbon Design System 스타일로 메인 페이지를 구현한다. 기능 비교 테이블, 가격 비교 카드, "최신 정보 갱신" 버튼, 변경사항 알림 배너를 포함한다.

**Expected Outcomes**
- 메인 페이지(`/`)에서 Bob vs 4개 경쟁사 기능/가격 비교 확인 가능
- "최신 정보 갱신" 버튼 클릭 → 로딩 인디케이터 → 변경사항 배너 표시
- IBM Carbon 스타일: 다크 테마(g100), IBM Blue 액센트, 공식 Carbon 컴포넌트 사용
- 반응형 레이아웃 (모바일/태블릿/데스크탑)

**Todo List**
1. `components/NavBar.tsx` — Carbon `Header` 컴포넌트, IBM Bob 로고, 네비게이션 링크
2. `components/ComparisonTable.tsx` — Carbon `DataTable`로 기능 비교 (체크마크/X 표시, Bob 열 하이라이트)
3. `components/PricingCard.tsx` — Carbon `Tile`로 각 제품 가격 플랜 카드
4. `components/UpdateBanner.tsx` — Carbon `InlineNotification`으로 변경사항 알림
5. `app/page.tsx` — 전체 레이아웃 조합, `/api/comparison-data` 초기 데이터 로드, 갱신 버튼 로직
6. 마지막 업데이트 날짜/시간 표시

**Relevant Context**
- Carbon 컴포넌트: `DataTable`, `Tile`, `Button`, `InlineNotification`, `Header`, `Loading`
- Bob 열은 배경색 강조(`#0f62fe` 연한 버전)로 시각적으로 구분
- 기능 비교 항목: IDE 지원, 보안/컴플라이언스, 엔터프라이즈 지원, 모델 커스터마이징, 온프레미스 배포, 가격

**Status**: [ ] pending

---

## Step 6 — 챗봇 UI 페이지

**Intent**
셀러가 Bob 관련 질문을 자유롭게 할 수 있는 챗봇 페이지를 구현한다. IBM Carbon 스타일을 유지하며 스트리밍 응답으로 자연스러운 대화 경험을 제공한다.

**Expected Outcomes**
- `/chat` 페이지에서 챗봇 UI 작동
- 메시지 전송 → 스트리밍으로 답변 타이핑 효과
- 대화 히스토리 유지 (새로고침 시 초기화)
- 예시 질문 버튼 제공 (셀러가 자주 쓸 질문 템플릿)

**Todo List**
1. `components/ChatPanel.tsx` — 메시지 목록, 입력창, 전송 버튼 (Carbon `TextInput`, `Button`)
2. `app/chat/page.tsx` — ChatPanel 렌더링, `/api/chat` 스트리밍 응답 처리
3. 예시 질문 버튼: "Bob의 보안 장점은?", "Copilot 대비 Bob의 가격은?", "엔터프라이즈 지원 차이는?" 등
4. 마크다운 렌더링 지원 (`react-markdown`으로 AI 응답 포맷팅)

**Relevant Context**
- 스트리밍: `fetch` + `ReadableStream` + `TextDecoder`로 청크 단위 처리
- Carbon 채팅 스타일: 사용자 메시지는 오른쪽, AI 응답은 왼쪽, IBM Blue 버블

**Status**: [ ] pending

---

## Step 7 — Cloudflare 배포 설정 및 최종 검증

**Intent**
Cloudflare Pages 배포를 위한 최종 설정을 완료하고, 전체 기능이 배포 환경에서 정상 동작하는지 검증한다.

**Expected Outcomes**
- `npx wrangler pages deploy` 또는 GitHub 연동 자동 배포 작동
- Cloudflare 환경변수 설정 가이드 문서화
- 로컬과 배포 환경 모두에서 크롤링, 챗봇, 비교 테이블 정상 작동
- `README.md`에 로컬 실행 및 배포 방법 문서화

**Todo List**
1. `next.config.ts`에 `@cloudflare/next-on-pages` 플러그인 최종 설정
2. `wrangler.toml` 작성 (프로젝트명, 호환성 플래그 `nodejs_compat`)
3. Cloudflare KV 네임스페이스 생성 및 `data-store.ts`와 연결 (크롤링 캐시 영구 저장)
4. GitHub Actions 또는 Cloudflare Pages Git 연동 자동 배포 설정
5. `README.md` 작성: 환경변수 설정, 로컬 실행, 배포 절차
6. 전체 기능 최종 테스트 체크리스트 실행

**Relevant Context**
- Cloudflare Pages Node.js 호환성: `wrangler.toml`에 `compatibility_flags = ["nodejs_compat"]` 필수
- KV 바인딩: `wrangler.toml`의 `[[kv_namespaces]]` 설정 + Cloudflare 대시보드에서 네임스페이스 생성
- 환경변수: Cloudflare Pages 대시보드 → Settings → Environment Variables에 `OPENAI_API_KEY` 추가

**Status**: [ ] pending

---

## 결정 사항 요약

| 항목 | 결정 |
|------|------|
| 프레임워크 | Next.js 14 App Router + TypeScript |
| 스타일 | Tailwind CSS + IBM Carbon Design System (g100 다크 테마) |
| 배포 | Cloudflare Pages + `@cloudflare/next-on-pages` |
| API Key 관리 | 로컬 `.env.local`, 배포 Cloudflare 환경변수 |
| 인증 | 없음 (퍼블릭) |
| 데이터 수집 | 공식 사이트 크롤링 + OpenAI 구조화 |
| 데이터 저장 | 로컬 JSON 캐시 / Cloudflare KV (배포) |
| 비교 대상 | GitHub Copilot, Claude Code, OpenAI Codex, Cursor |
| 업데이트 방식 | 사용자 수동 트리거 ("최신 정보 갱신" 버튼) |
