# Step 6 — 챗봇 UI 페이지

**Status**: ⏳ 대기

## Intent

셀러가 Bob 관련 질문을 자유롭게 할 수 있는 챗봇 페이지를 구현한다.
IBM Carbon 스타일을 유지하며 스트리밍 응답으로 자연스러운 대화 경험을 제공한다.

## Expected Outcomes

- `/chat`에서 챗봇 정상 작동
- 메시지 전송 → 스트리밍 타이핑 효과
- 대화 히스토리 유지 (새로고침 시 초기화)
- 예시 질문 버튼 제공

## Todo List

- [ ] `components/ChatPanel.tsx` — 메시지 목록, 입력창, 전송 버튼
- [ ] `app/chat/page.tsx` — ChatPanel + 스트리밍 응답 처리
- [ ] 예시 질문 버튼
- [ ] AI 응답 마크다운 렌더링 (`react-markdown`)

## Relevant Context

- 스트리밍: `fetch` + `ReadableStream` + `TextDecoder` 청크 단위 읽기
- 사용자 메시지 오른쪽 / AI 응답 왼쪽
- 예시 질문: "Bob의 보안 장점은?", "Copilot 대비 가격 경쟁력은?", "Cursor와의 가장 큰 차이는?"
- Step 4의 `/api/chat` 사용
