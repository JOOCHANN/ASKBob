# Step 4 — OpenAI 챗봇 API Route

**Status**: ⏳ 대기

## Intent

IBM Bob 관련 셀러 질문에 답변하는 챗봇 API를 구현한다.
Bob의 정적 지식과 최신 크롤링 데이터를 컨텍스트로 주입하여 경쟁사 대비 Bob의 이점을 정확히 설명한다.

## Expected Outcomes

- `POST /api/chat` → OpenAI 스트리밍 응답 반환
- Bob 지식 + 최신 비교 데이터가 시스템 프롬프트에 포함
- `ReadableStream`으로 타이핑 효과 구현

## Todo List

- [ ] `lib/openai.ts` — OpenAI 클라이언트 초기화
- [ ] `app/api/chat/route.ts` — 스트리밍 응답 구현
- [ ] 시스템 프롬프트 작성 (Bob 셀러 어시스턴트 역할 + Bob 지식 주입)
- [ ] 대화 히스토리 수신 처리 (클라이언트에서 관리)

## Relevant Context

- OpenAI SDK v4는 Node.js 런타임에서 스트리밍 지원
- 스트리밍: `openai.chat.completions.create({ stream: true })` → `ReadableStream` 변환
- 시스템 프롬프트 핵심 내용:
  - Bob 셀러 어시스턴트 역할 정의
  - Bob의 엔터프라이즈 보안, IBM 생태계 통합, 가격 경쟁력
  - `bob-knowledge.ts`의 텍스트 + 최신 크롤링 데이터 (Step 2, 3 결과)
- 대화 히스토리는 서버에 저장하지 않음 (클라이언트 state로 관리)
