import bobStatic from "@/data/bob-static.json";

export function getBobKnowledge(): string {
  return `
# IBM Bob (watsonx Code Assistant) 제품 정보

## 핵심 셀링 포인트

### 1. 엔터프라이즈 보안 및 컴플라이언스
- SOC2 Type II, ISO 27001 인증
- GDPR, HIPAA 컴플라이언스 지원
- 코드 출처 추적으로 IP 보호 (GitHub Copilot, Cursor 등은 미지원)
- 온프레미스 배포 가능 — 코드가 외부로 나가지 않음

### 2. IBM 엔터프라이즈 생태계 통합
- IBM watsonx 플랫폼 완전 통합
- IBM Cloud, Red Hat OpenShift 네이티브 지원
- 기존 IBM 고객의 경우 추가 비용 없이 확장 가능

### 3. 커스터마이징
- 기업 내부 코드베이스로 모델 파인튜닝 가능
- 사내 코딩 표준 및 패턴 학습
- GitHub Copilot, Cursor는 커스텀 모델 불가

### 4. 전담 엔터프라이즈 지원
- SLA 보장된 전담 기술 지원
- 24/7 엔터프라이즈 지원 가능
- 경쟁사 대비 금융, 의료, 공공 분야 레퍼런스 다수

## 지원 IDE
${bobStatic.supportedIDEs.join(", ")}

## 주요 기능
${bobStatic.features.map((f) => `- ${f}`).join("\n")}

## 가격 정책
${bobStatic.pricing.map((p) => `- ${p.plan}: ${p.price === "0" ? "무료" : p.price} (${p.features.join(", ")})`).join("\n")}

## 경쟁사 대비 핵심 차별점
| 항목 | IBM Bob | GitHub Copilot | Claude Code | Cursor |
|------|---------|---------------|-------------|--------|
| 온프레미스 배포 | ✅ | ❌ | ❌ | ❌ |
| 커스텀 모델 | ✅ | ❌ | ❌ | ❌ |
| SOC2/ISO 인증 | ✅ | ✅ | ✅ | ❌ |
| IP 보호 (코드 출처) | ✅ | 부분 | ❌ | ❌ |
| 전담 엔터프라이즈 지원 | ✅ | 제한적 | ❌ | ❌ |
| IBM 생태계 통합 | ✅ | ❌ | ❌ | ❌ |
`.trim();
}
