# IBM Bob Seller Web

IBM Bob 테크 셀러를 위한 웹 애플리케이션.

AI 코드 어시스턴트 경쟁사(GitHub Copilot, Claude Code, OpenAI Codex, Cursor)와 IBM Bob을 기능 및 가격 측면에서 비교하며, OpenAI API 기반 Q&A 챗봇을 제공한다.

---

## 목적

- 셀러가 경쟁사 대비 Bob의 이점을 즉시 파악하고 고객에게 설명할 수 있는 레퍼런스 페이지
- 경쟁사 공식 사이트를 자동 크롤링하여 버튼 하나로 최신 정보를 갱신
- Bob 관련 질문에 OpenAI API가 답변하는 챗봇 내장

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 스타일 | Tailwind CSS + IBM Carbon Design System (`@carbon/react`) |
| 배포 | Cloudflare Pages (`@cloudflare/next-on-pages`, Edge Runtime) |
| AI | OpenAI API (GPT-4o) |
| 크롤링 | node-fetch + linkedom (Edge 호환) |
| 환경변수 | 로컬 `.env.local`, 배포 시 Cloudflare 환경변수 |

---

## 비교 대상 제품

| 제품 | 공식 사이트 |
|------|------------|
| GitHub Copilot | https://github.com/features/copilot |
| Claude Code | https://claude.ai/code |
| OpenAI Codex | https://platform.openai.com/docs |
| Cursor | https://cursor.com/pricing |
| **IBM Bob** | 내부 자료 기반 |

---

## 주요 기능

### 1. 경쟁사 비교 대시보드 (`/`)
- 기능 비교 테이블: IDE 지원, 보안/컴플라이언스, 엔터프라이즈 지원, 모델 커스터마이징, 온프레미스 배포, 가격
- 가격 비교 카드: 각 제품의 플랜별 가격 표시
- IBM Bob 열 시각적 강조
- 마지막 업데이트 날짜 표시

### 2. 최신 정보 자동 갱신
- "최신 정보 갱신" 버튼 클릭 시 4개 경쟁사 공식 사이트 자동 크롤링
- OpenAI GPT-4o로 크롤링 데이터 구조화
- 이전 데이터와 비교하여 변경사항 감지 및 알림 배너 표시
- 결과는 Cloudflare KV(배포) 또는 로컬 JSON 캐시(개발)에 저장

### 3. Q&A 챗봇 (`/chat`)
- IBM Bob 관련 질문에 OpenAI 스트리밍 응답
- Bob 제품 지식 + 최신 경쟁사 비교 데이터가 시스템 프롬프트에 주입
- 예시 질문 버튼 제공 (셀러 자주 사용 질문 템플릿)
- 마크다운 렌더링 지원

---

## 폴더 구조

```
ASKBob/
├── Plan/
│   └── bob-seller-web-plan.md      # 상세 개발 플랜 (Step별 정의)
├── bob-seller-web/
│   ├── app/
│   │   ├── page.tsx                # 메인 랜딩 (비교 대시보드)
│   │   ├── chat/
│   │   │   └── page.tsx            # Q&A 챗봇 페이지
│   │   └── api/
│   │       ├── crawl/route.ts      # 크롤링 + AI 분석 API
│   │       ├── chat/route.ts       # OpenAI 챗봇 API
│   │       └── comparison-data/route.ts  # 저장된 비교 데이터 반환
│   ├── components/
│   │   ├── ComparisonTable.tsx     # 기능 비교 테이블
│   │   ├── PricingCard.tsx         # 가격 비교 카드
│   │   ├── ChatPanel.tsx           # 챗봇 UI
│   │   ├── UpdateBanner.tsx        # 변경사항 알림 배너
│   │   └── NavBar.tsx              # IBM Carbon 스타일 네비게이션
│   ├── lib/
│   │   ├── crawlers/
│   │   │   ├── types.ts            # 공통 ProductData 타입
│   │   │   ├── copilot.ts          # GitHub Copilot 크롤러
│   │   │   ├── claude-code.ts      # Claude Code 크롤러
│   │   │   ├── codex.ts            # OpenAI Codex 크롤러
│   │   │   └── cursor.ts           # Cursor 크롤러
│   │   ├── openai.ts               # OpenAI API 클라이언트
│   │   ├── data-store.ts           # KV / 로컬 JSON 저장소
│   │   └── bob-knowledge.ts        # 챗봇용 Bob 제품 지식 텍스트
│   ├── data/
│   │   ├── bob-static.json         # Bob 기능/가격 정보 (수동 관리)
│   │   └── comparison-cache.json   # 크롤링 결과 캐시 (gitignore)
│   ├── .env.local.example          # 환경변수 템플릿
│   ├── wrangler.toml               # Cloudflare Pages 설정
│   └── next.config.ts              # Next.js + Cloudflare 설정
└── README.md                       # 이 파일
```

---

## 개발 환경 설정

### 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn
- OpenAI API Key

### 로컬 실행

```bash
# 1. 저장소 클론
git clone https://github.com/JOOCHANN/ASKBob.git
cd ASKBob/bob-seller-web

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 OPENAI_API_KEY 값 입력

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 환경변수 목록

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API Key | ✅ |
| `NEXT_PUBLIC_APP_URL` | 배포된 앱 URL | 배포 시 |

---

## Cloudflare Pages 배포

### 1. Cloudflare 환경변수 설정
Cloudflare Pages 대시보드 → Settings → Environment Variables에 아래 변수 추가:
- `OPENAI_API_KEY`: OpenAI API Key

### 2. GitHub 연동 자동 배포
1. Cloudflare Pages 대시보드 → Create a project → Connect to Git
2. `JOOCHANN/ASKBob` 저장소 선택
3. Build settings:
   - **Framework preset**: Next.js
   - **Build command**: `cd bob-seller-web && npm run build`
   - **Build output directory**: `bob-seller-web/.vercel/output/static`
4. `main` 브랜치에 push 시 자동 배포

### 3. Cloudflare KV 설정 (크롤링 캐시)
```bash
# KV 네임스페이스 생성
npx wrangler kv:namespace create "COMPARISON_CACHE"
# 출력된 id를 wrangler.toml의 [[kv_namespaces]] id에 입력
```

---

## 개발 플랜 (Step별 진행 현황)

상세 플랜은 [`Plan/bob-seller-web-plan.md`](Plan/bob-seller-web-plan.md) 참조.

| Step | 내용 | 상태 |
|------|------|------|
| Step 1 | 프로젝트 초기화 및 환경 설정 | ⏳ 대기 |
| Step 2 | Bob 정적 데이터 및 크롤러 기반 구조 | ⏳ 대기 |
| Step 3 | 크롤링 API Route 및 OpenAI 구조화 | ⏳ 대기 |
| Step 4 | OpenAI 챗봇 API Route | ⏳ 대기 |
| Step 5 | 메인 비교 대시보드 UI | ⏳ 대기 |
| Step 6 | 챗봇 UI 페이지 | ⏳ 대기 |
| Step 7 | Cloudflare 배포 설정 및 최종 검증 | ⏳ 대기 |

---

## 주의사항

- `.env.local` 파일은 절대 GitHub에 커밋하지 말 것 (`.gitignore`에 포함됨)
- `comparison-cache.json`은 gitignore 처리됨 (로컬 캐시 파일)
- 크롤링은 각 공식 사이트의 이용약관 범위 내에서 수행됨

---

## 라이선스

IBM Internal Use Only
