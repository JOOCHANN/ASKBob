# Step 1 — 프로젝트 초기화 및 환경 설정

**Status**: ✅ 완료

## Intent

Next.js + TypeScript + Tailwind + IBM Carbon 환경을 구성한다.
Cloudflare Workers는 `opennextjs-cloudflare` 어댑터 + GitHub 연동 자동배포로 사용한다.

## Expected Outcomes

- `npm run dev`로 로컬 실행 가능
- IBM Carbon Design System 컴포넌트 렌더링 확인
- `.env.local.example`로 환경변수 문서화
- `npm run build` (opennextjs-cloudflare) 성공

## Todo List

- [x] `create-next-app` 프로젝트 생성 (App Router, TypeScript, Tailwind)
- [x] `@carbon/react`, `@carbon/icons-react` 설치
- [x] Tailwind + Carbon CSS import 설정 (`app/globals.css`)
- [x] NavBar 컴포넌트 구현
- [x] `wrangler.jsonc` + `open-next.config.ts` 배포 설정
- [x] `npm run build` 성공 확인

## Relevant Context

- IBM 브랜드 색상: Blue `#0f62fe`, Dark BG `#161616`, Border `#393939`, Text `#f4f4f4`
- Cloudflare Workers 빌드: `next build && opennextjs-cloudflare build`
- `eslint-config-next` 버전은 `next` 버전과 일치
