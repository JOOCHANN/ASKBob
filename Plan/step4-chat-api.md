# Step 4 — OpenAI 챗봇 API Route

**Status**: ⏳ 대기

## Intent

IBM Bob 관련 셀러 질문에 답변하는 챗봇 API를 구현한다.
Bob의 정적 지식과 **최신 스냅샷 비교 데이터**를 컨텍스트로 주입하여 경쟁사 대비 Bob의 이점을 정확히 설명한다.

## Expected Outcomes

- `POST /api/chat` → OpenAI 스트리밍 응답 반환
- `bob-knowledge.ts` + `getLatestSnapshots()` 결과가 시스템 프롬프트에 포함
- `ReadableStream`으로 타이핑 효과

## Todo List

- [ ] `lib/openai.ts` — OpenAI 클라이언트 초기화 (앱 런타임용, `OPENAI_API_KEY`)
- [ ] `app/api/chat/route.ts` — 스트리밍 응답 구현
- [ ] 시스템 프롬프트: Bob 셀러 어시스턴트 역할 + `getBobKnowledge()` + 최신 경쟁사 스냅샷 주입
- [ ] 대화 히스토리 수신 처리 (클라이언트 state로 관리, 서버 저장 안 함)

## Relevant Context

- 스트리밍: `openai.chat.completions.create({ stream: true })` → `ReadableStream` 변환
- 최신 경쟁사 데이터는 [lib/data-store.ts](../lib/data-store.ts)의 `getLatestSnapshots()`로 주입
- Cloudflare Workers 런타임에서 동작해야 하므로 Node 전용 API 사용 금지 (fetch 기반 OpenAI 호출)
