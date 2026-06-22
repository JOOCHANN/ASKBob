# Step 3 — 크롤링 API Route 및 OpenAI 구조화

**Status**: ⏳ 대기

## Intent

"최신 정보 갱신" 버튼 클릭 시 호출되는 `/api/crawl` 엔드포인트를 구현한다.
각 경쟁사 공식 사이트를 크롤링하고, OpenAI API로 `ProductData` 형식의 구조화된 JSON을 추출한다.
이전 데이터와 비교해 변경사항을 감지한다.

## Expected Outcomes

- `POST /api/crawl` → 4개 경쟁사 데이터 수집 + diff 반환
- OpenAI가 HTML 텍스트에서 기능/가격 정보를 `ProductData` JSON으로 추출
- 크롤링 실패 시 해당 제품만 에러, 나머지 정상 진행 (부분 실패 허용)
- `GET /api/comparison-data` → 캐시된 데이터 반환 (페이지 초기 로드용)

## Todo List

- [ ] 각 크롤러에서 공식 Pricing/Features 페이지 HTML fetch + 텍스트 추출
- [ ] OpenAI `gpt-4o` JSON mode로 `ProductData` 구조화 (`response_format: { type: "json_object" }`)
- [ ] `app/api/crawl/route.ts` — 4개 크롤러 병렬 실행, diff 계산, 캐시 저장
- [ ] `app/api/comparison-data/route.ts` — 캐시 반환
- [ ] 부분 실패 처리 로직

## Relevant Context

- HTML 파싱: Node.js 환경에서 `linkedom` 또는 정규식으로 텍스트 추출 (Cheerio는 번들 크기 큼)
- 크롤링 대상 URL:
  - Copilot: `https://github.com/features/copilot/plans`
  - Claude Code: `https://claude.ai/code`
  - Codex: `https://platform.openai.com/docs/codex`
  - Cursor: `https://cursor.com/pricing`
- OpenAI JSON mode 프롬프트에 `ProductData` 스키마 명시 필요
- 캐시: 로컬 `data/comparison-cache.json` / Cloudflare KV (Step 7에서 연결)
- Step 2의 `data-store.ts` diff 함수 사용
