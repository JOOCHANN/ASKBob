# Step 7 — GitHub Actions 주간 cron + Cloudflare 배포·검증

**Status**: ⏳ 대기

## Intent

수집 파이프라인을 주간 자동 실행하고, 결과 커밋이 Cloudflare 자동배포를 트리거하도록 연결한다.
구 KV 캐시 의존을 제거하고 전체 흐름을 검증한다.

## Expected Outcomes

- `.github/workflows/crawl.yml` — 주간 cron + 수동 트리거(`workflow_dispatch`)
- 파이프라인 실행 → `data/` 변경 시 자동 commit & push → Cloudflare 재배포
- 챗봇용 `OPENAI_API_KEY`만 Cloudflare 환경변수로
- 비교/타임라인/체인지로그/챗봇 배포 환경 정상 작동

## Todo List

- [ ] `.github/workflows/crawl.yml` — `schedule`(weekly) + `workflow_dispatch`, Playwright 설치, `npm run pipeline`, `data/` 변경 자동 커밋
- [ ] GitHub Secrets에 `OPENAI_API_KEY` 등록 (파이프라인용)
- [ ] Cloudflare 환경변수 `OPENAI_API_KEY` 등록 (챗봇용)
- [ ] 구 KV 흔적 정리 확인 (`COMPARISON_CACHE` 바인딩 없음)
- [ ] `workflow_dispatch` 수동 실행 → 커밋 생성 → 자동배포 확인
- [ ] 배포 후 전체 기능 테스트

## Relevant Context

### crawl.yml 골자
```yaml
on:
  schedule:
    - cron: "0 0 * * 1"   # 매주 월요일 00:00 UTC
  workflow_dispatch:
jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run pipeline
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - name: commit data
        run: |
          git config user.name "askbob-bot"
          git config user.email "bot@askbob"
          git add data/
          git diff --cached --quiet || git commit -m "chore: weekly snapshot $(date +%F)"
          git push
```

### Cloudflare
- 빌드: `npm run build` (opennextjs-cloudflare), 출력 `.open-next`
- `wrangler.jsonc`에 KV 바인딩 없음 — 앱은 `data/*.json` 정적 import 만 사용
- `data/` 커밋 → GitHub 연동 자동배포로 새 통합본 번들
