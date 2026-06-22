# Step 1 — 프로젝트 초기화 및 환경 설정

**Status**: 🔄 진행중

## Intent

Next.js + TypeScript + Tailwind + IBM Carbon 환경을 구성한다.
Cloudflare Pages는 어댑터 없이 GitHub 연동 자동배포 방식으로 사용한다 (Next.js 버전 제약 없음).

## Expected Outcomes

- `bob-seller-web/` 프로젝트가 `npm run dev`로 로컬 실행 가능
- IBM Carbon Design System 컴포넌트 렌더링 확인
- `.env.local.example`로 환경변수 문서화
- `npm run build` 성공

## Todo List

- [x] `create-next-app`으로 프로젝트 생성 (App Router, TypeScript, Tailwind)
- [x] `@carbon/react`, `@carbon/icons-react` 설치
- [ ] `@cloudflare/next-on-pages` 제거, Next.js 최신 버전 복원
- [ ] Tailwind + Carbon CSS import 설정 (`app/globals.css`)
- [ ] `.env.local.example` 작성 (`OPENAI_API_KEY`)
- [ ] IBM Carbon 테마 전역 적용 (`app/layout.tsx`)
- [ ] 기본 NavBar 컴포넌트 구현
- [ ] `npm run build` 성공 확인

## Relevant Context

- Carbon 테마: `<Theme theme="g100">` (다크) 또는 `"white"` (라이트) — 전역 래퍼 적용
- IBM 브랜드 색상: Blue `#0f62fe`, Dark BG `#161616`
- Cloudflare Pages 빌드 설정:
  - Root directory: `bob-seller-web`
  - Build command: `npm run build`
  - Build output: `.next`
  - Node.js version: `18` (환경변수 `NODE_VERSION=18`)
- `eslint-config-next` 버전은 `next` 버전과 일치해야 함
