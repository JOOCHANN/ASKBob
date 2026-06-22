# IBM Bob Seller Web

IBM Bob 테크 셀러를 위한 AI 코드 어시스턴트 경쟁사 비교 웹.

🌐 **Live**: https://askbob.green261535.workers.dev/

---

## 주요 기능

- **경쟁사 비교** — GitHub Copilot, Claude Code, OpenAI Codex, Cursor vs IBM Bob 기능/가격 비교
- **자동 갱신** — 버튼 클릭 한 번으로 경쟁사 공식 사이트 크롤링 후 최신 데이터 업데이트
- **Q&A 챗봇** — OpenAI 기반 챗봇으로 Bob 관련 질문에 즉시 답변

---

## 환경변수

| 변수명 | 설명 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API Key |

---

## 개발 플랜

단계별 플랜은 [`Plan/README.md`](Plan/README.md) 참조.

| Step | 내용 | 상태 |
|------|------|------|
| 1 | 프로젝트 초기화 및 Cloudflare 배포 설정 | ✅ |
| 2 | Bob 정적 데이터 및 크롤러 구조 | ⏳ |
| 3 | 크롤링 API + OpenAI 구조화 | ⏳ |
| 4 | 챗봇 API | ⏳ |
| 5 | 비교 대시보드 UI | ⏳ |
| 6 | 챗봇 UI | ⏳ |
| 7 | 최종 검증 | ⏳ |
