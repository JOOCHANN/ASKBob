# IBM Bob Seller Web

IBM Bob 테크 셀러를 위한 **AI 코드 어시스턴트 비교·추적** 웹.

정적 비교 페이지가 아니라, 경쟁사의 가격·기능·지원 모델이 **시간에 따라 어떻게 변하는지**를
주간 자동 수집으로 추적하는 "살아있는 데이터" 기반이다.

🌐 **Live**: https://askbob.green261535.workers.dev/

---

## 주요 기능

- **경쟁사 비교** — GitHub Copilot · Claude Code · OpenAI Codex · Cursor vs IBM Bob 최신 스냅샷 비교
- **시계열 추적** — 제품별 가격/기능 변천 타임라인 (예: Cursor $20 → $25)
- **변경 인텔리전스** — 직전 스냅샷과 자동 diff + AI 한국어 요약 (체인지로그)
- **Q&A 챗봇** — OpenAI 기반 챗봇으로 Bob 관련 질문에 즉시 답변

---

## 아키텍처 — 수집과 표시 분리

Cloudflare Workers는 Playwright/파일쓰기가 불가하므로, **수집은 GitHub Actions(Node)**,
**표시는 Next.js**가 담당한다. 원칙: *"모든 것은 시점의 스냅샷이며 절대 덮어쓰지 않는다."*

```
[GitHub Actions 주간 cron]  scripts/pipeline.ts
  crawl(Playwright) → data/raw/<slug>/<date>.html       (원본, 불변)
  extract(OpenAI)   → data/snapshots/<slug>/<date>.json (스냅샷, 불변)
  diff + insight    → data/changes.json                 (변경 이력, append)
  통합 재생성        → data/timeline.json                  (앱용 통합본)
  git commit & push → Cloudflare 자동배포
        ↓
[Next.js on Cloudflare]  data/*.json 정적 import → 비교/타임라인/체인지로그 + /api/chat
```

데이터는 모두 **Git 커밋 JSON**으로 보관되어 버전 관리가 곧 이력이며, 원본(`data/raw`)에서 언제든 재처리 가능하다.

---

## 환경변수

| 변수명 | 용도 | 등록 위치 |
|--------|------|-----------|
| `OPENAI_API_KEY` | 챗봇 (런타임) | Cloudflare 환경변수 |
| `OPENAI_API_KEY` | 추출·인사이트 (수집) | GitHub Actions Secrets |

---

## 개발 플랜

단계별 플랜은 [`Plan/README.md`](Plan/README.md) 참조.

| Step | 내용 | 상태 |
|------|------|------|
| 1 | 프로젝트 초기화 및 환경 설정 | ✅ |
| 2 | 데이터 모델 & 4계층 저장 레이아웃 | ✅ |
| 3 | 수집 파이프라인 (Playwright + OpenAI + diff + 인사이트) | ⏳ |
| 4 | 챗봇 API | ⏳ |
| 5 | 대시보드 UI (비교/타임라인/체인지로그) | ⏳ |
| 6 | 챗봇 UI | ⏳ |
| 7 | GitHub Actions 주간 cron + 배포 검증 | ⏳ |
