export interface PricingPlan {
  plan: string;
  price: string;
  unit: string;
  features: string[];
}

/** 크롤 대상 경쟁사 디스크립터. 파이프라인이 이 목록을 순회한다. */
export interface CrawlTarget {
  product: string; // 표시용 제품명 (Snapshot.product 와 동일)
  slug: string; // 파일 경로용 슬러그 (data/raw/<slug>, data/snapshots/<slug>)
  sourceUrls: string[]; // 가격/기능 등 여러 공식 페이지. 모두 크롤해 합쳐서 추출한다.
}

/**
 * 한 제품의 특정 시점 스냅샷. 불변 — 한 번 저장되면 덮어쓰지 않는다.
 * data/snapshots/<product>/<collectedAt>.json 으로 저장된다.
 */
export interface Snapshot {
  product: string;
  collectedAt: string; // ISO 날짜 (YYYY-MM-DD) — 수집 시점
  version: string;
  pricing: PricingPlan[];
  features: string[];
  models: string[]; // 지원 모델 (예: GPT-5, Claude Sonnet 4, IBM Granite)
  supportedIDEs: string[];
  sourceUrl: string;
}

export interface Diff {
  field: string;
  old: string;
  new: string;
}

/** 직전 스냅샷 대비 변경 1건. data/changes.json 에 append 된다. */
export interface ChangeRecord {
  product: string;
  detectedAt: string; // 변경 감지 시점 (ISO)
  from: string | null; // 직전 스냅샷의 collectedAt (최초 수집이면 null)
  to: string; // 신규 스냅샷의 collectedAt
  changes: Diff[]; // 구조화된 필드 변경
  summary: string; // OpenAI 생성 한국어 요약
}

/** 앱이 정적 import 하는 통합 시계열. 매 파이프라인 실행마다 재생성된다. */
export interface Timeline {
  updatedAt: string;
  products: Record<string, Snapshot[]>; // 제품명 → 시점순(오름차순) 스냅샷 배열
}
