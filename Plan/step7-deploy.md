# Step 7 — Cloudflare 배포 설정 및 최종 검증

**Status**: ⏳ 대기

## Intent

Cloudflare Pages에 GitHub 연동 자동배포를 설정하고 전체 기능을 검증한다.
Cloudflare KV로 크롤링 캐시를 영구 저장한다.

## Expected Outcomes

- GitHub `main` 브랜치 push → Cloudflare Pages 자동 빌드/배포
- Cloudflare 환경변수 설정 가이드 문서화
- 크롤링, 챗봇, 비교 테이블 배포 환경에서 정상 작동
- README.md 배포 절차 업데이트

## Todo List

- [ ] Cloudflare Pages 대시보드에서 GitHub 저장소 연결
- [ ] 빌드 설정 입력 (아래 Relevant Context 참조)
- [ ] Cloudflare 환경변수 `OPENAI_API_KEY` 등록
- [ ] Cloudflare KV 네임스페이스 생성 + `data-store.ts` 연결
- [ ] 배포 후 전체 기능 테스트

## Relevant Context

### Cloudflare Pages 빌드 설정
| 항목 | 값 |
|------|-----|
| Framework preset | Next.js |
| Root directory | `bob-seller-web` |
| Build command | `npm run build` |
| Build output directory | `.next` |
| NODE_VERSION (환경변수) | `18` |

### Cloudflare KV 설정
```bash
npx wrangler kv:namespace create "COMPARISON_CACHE"
# 출력된 id를 wrangler.toml [[kv_namespaces]] id에 입력
```

### wrangler.toml 예시
```toml
name = "bob-seller-web"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "COMPARISON_CACHE"
id = "<여기에_KV_네임스페이스_ID_입력>"
```

### 환경변수 등록 위치
Cloudflare Pages 대시보드 → Settings → Environment Variables
- `OPENAI_API_KEY`: OpenAI API Key
