# IBM Bob Seller Web — 개발 플랜 인덱스

## 프로젝트 개요

IBM Bob 테크 셀러를 위한 웹 애플리케이션.
경쟁사(GitHub Copilot, Claude Code, OpenAI Codex, Cursor)와 기능/가격 비교 + OpenAI 챗봇 제공.

## 결정 사항

| 항목 | 결정 |
|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일 | Tailwind CSS + IBM Carbon Design System |
| 배포 | Cloudflare Pages (GitHub 연동 자동배포, 어댑터 없음) |
| API Key | 로컬 `.env.local` / 배포 Cloudflare 환경변수 |
| 인증 | 없음 (퍼블릭) |
| 데이터 수집 | 공식 사이트 크롤링 + OpenAI 구조화 |
| 데이터 저장 | 로컬 JSON 캐시 / Cloudflare KV (배포) |
| 업데이트 방식 | 사용자 수동 트리거 ("최신 정보 갱신" 버튼) |

## 앱 폴더 구조

```
bob-seller-web/
  app/
    page.tsx                      ← 메인 대시보드
    chat/page.tsx                 ← 챗봇 페이지
    api/
      crawl/route.ts              ← 크롤링 + AI 분석
      chat/route.ts               ← 챗봇 API
      comparison-data/route.ts    ← 캐시 데이터 반환
  components/
    NavBar.tsx
    ComparisonTable.tsx
    PricingCard.tsx
    ChatPanel.tsx
    UpdateBanner.tsx
  lib/
    crawlers/types.ts
    crawlers/copilot.ts
    crawlers/claude-code.ts
    crawlers/codex.ts
    crawlers/cursor.ts
    openai.ts
    data-store.ts
    bob-knowledge.ts
  data/
    bob-static.json               ← Bob 정적 데이터 (수동 관리)
    comparison-cache.json         ← 크롤링 캐시 (gitignore)
  .env.local.example
```

---

## Step별 플랜 파일

| Step | 파일 | 내용 | 상태 |
|------|------|------|------|
| Step 1 | [step1-init.md](step1-init.md) | 프로젝트 초기화 및 환경 설정 | ⏳ 진행중 |
| Step 2 | [step2-data.md](step2-data.md) | Bob 정적 데이터 및 크롤러 구조 | ⏳ 대기 |
| Step 3 | [step3-crawl-api.md](step3-crawl-api.md) | 크롤링 API + OpenAI 구조화 | ⏳ 대기 |
| Step 4 | [step4-chat-api.md](step4-chat-api.md) | 챗봇 API Route | ⏳ 대기 |
| Step 5 | [step5-dashboard-ui.md](step5-dashboard-ui.md) | 메인 비교 대시보드 UI | ⏳ 대기 |
| Step 6 | [step6-chat-ui.md](step6-chat-ui.md) | 챗봇 UI 페이지 | ⏳ 대기 |
| Step 7 | [step7-deploy.md](step7-deploy.md) | Cloudflare 배포 및 최종 검증 | ⏳ 대기 |
