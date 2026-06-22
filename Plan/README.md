# IBM Bob Seller Web — 개발 플랜 인덱스

## 프로젝트 개요

IBM Bob 테크 셀러를 위한 웹 애플리케이션.
경쟁사(GitHub Copilot, Claude Code, OpenAI Codex, Cursor)와 기능/가격을 비교하고 Bob Q&A 챗봇을 제공한다.

기존엔 크롤할 때마다 단일 캐시를 **덮어쓰는** 구조였으나, 가격·기능의 **시간에 따른 변화**를 추적하기 위해
**불변 시계열 스냅샷 파이프라인**으로 재설계했다. 원칙: **"모든 것은 시점의 스냅샷이며 절대 덮어쓰지 않는다."**

## 결정 사항

| 항목 | 결정 |
|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일 | Tailwind CSS + IBM Carbon Design System |
| 배포 | Cloudflare Workers (opennextjs-cloudflare, GitHub 연동 자동배포) |
| 정체성 | Bob 중심 셀러 도구 (중립 트래커 아님) + 챗봇 |
| 데이터 수집 | GitHub Actions 주간 cron + Playwright 크롤 + OpenAI 추출 |
| 데이터 저장 | **Git 커밋 JSON 파일** (append, 불변, 원본 재처리 가능) |
| LLM | OpenAI (추출 · 인사이트 · 챗봇) |
| 업데이트 방식 | 주간 자동 (Actions) — 앱과 파이프라인 분리 |
| 인증 | 없음 (퍼블릭) |

## 아키텍처 — 파이프라인과 웹앱 분리

Cloudflare Workers는 Playwright 실행·런타임 파일쓰기가 불가하므로 **수집(GitHub Actions Node)**과
**표시(Next.js)**를 분리한다.

```
[GitHub Actions 주간 cron]  scripts/pipeline.ts
  crawl(Playwright) → data/raw/<slug>/<date>.html        (Layer 1 RAW, 불변)
  extract(OpenAI)   → 구조화 JSON
  normalize         → data/snapshots/<slug>/<date>.json   (Layer 2+3, 불변)
  diff vs 직전 스냅샷 → data/changes.json append            (Layer 4 변경 이력)
  insight(OpenAI)   → 한국어 변경 요약
  통합 재생성        → data/timeline.json                    (앱용 시계열 통합본)
  git commit & push → Cloudflare 자동배포 트리거
        ↓
[Next.js on Cloudflare]
  data/timeline.json + data/changes.json 정적 import
  → 비교 대시보드(최신 스냅샷) / 타임라인 / 체인지로그
  → /api/chat (Bob Q&A, OpenAI)
```

## 데이터 레이아웃 (`data/`)

```
data/
  raw/<slug>/<YYYY-MM-DD>.html         # Layer 1: 크롤 원본, 절대 덮어쓰지 않음
  snapshots/<slug>/<YYYY-MM-DD>.json   # Layer 2+3: 추출+정규화 스냅샷, 불변
  timeline.json                        # 앱용 통합 시계열 (매 실행 재생성)
  changes.json                         # Layer 4: diff + AI 요약 누적 (append)
  bob-static.json                      # Bob 수동 데이터 → Bob 스냅샷 소스
```

타입은 [lib/crawlers/types.ts](../lib/crawlers/types.ts)의 `Snapshot` / `ChangeRecord` / `Timeline` / `CrawlTarget`.

## 앱 폴더 구조

```
ASKBob/
  app/
    page.tsx                      ← 비교 대시보드 + 타임라인 + 체인지로그
    chat/page.tsx                 ← 챗봇 페이지
    api/chat/route.ts             ← 챗봇 API (OpenAI)
  components/
    NavBar.tsx · ComparisonTable.tsx · PricingCard.tsx
    TimelineView.tsx · ChangeLog.tsx · ChatPanel.tsx
  lib/
    crawlers/types.ts             ← 공유 타입
    crawlers/{copilot,claude-code,codex,cursor}.ts  ← CrawlTarget 디스크립터
    data-store.ts                 ← 통합본 read (loadTimeline/getLatestSnapshots/loadChanges)
    bob-knowledge.ts              ← 챗봇 시스템 프롬프트
  scripts/                        ← 수집 파이프라인 (Actions 실행)
    crawl.ts · extract.ts · pipeline.ts · lib/diff.ts
  data/                           ← 위 데이터 레이아웃
  .github/workflows/crawl.yml     ← 주간 cron
  Plan/                           ← 개발 플랜 문서
```

---

## Step별 플랜 파일

| Step | 파일 | 내용 | 상태 |
|------|------|------|------|
| Step 1 | [step1-init.md](step1-init.md) | 프로젝트 초기화 및 환경 설정 | ✅ 완료 |
| Step 2 | [step2-data.md](step2-data.md) | 데이터 모델 & 4계층 저장 레이아웃 | ✅ 완료 |
| Step 3 | [step3-crawl-api.md](step3-crawl-api.md) | 수집 파이프라인 (Playwright+OpenAI, diff, 인사이트, timeline) | ⏳ 대기 |
| Step 4 | [step4-chat-api.md](step4-chat-api.md) | 챗봇 API Route (OpenAI) | ⏳ 대기 |
| Step 5 | [step5-dashboard-ui.md](step5-dashboard-ui.md) | 대시보드 UI (비교/타임라인/체인지로그) | ⏳ 대기 |
| Step 6 | [step6-chat-ui.md](step6-chat-ui.md) | 챗봇 UI 페이지 | ⏳ 대기 |
| Step 7 | [step7-deploy.md](step7-deploy.md) | GitHub Actions 주간 cron + Cloudflare 배포·검증 | ⏳ 대기 |
