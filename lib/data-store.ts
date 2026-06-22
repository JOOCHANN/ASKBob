import type { ProductData, Diff, ProductDiff } from "./crawlers/types";

const CACHE_KEY = "comparison-cache";

// Cloudflare KV 바인딩 타입 (배포 환경)
declare global {
  // eslint-disable-next-line no-var
  var COMPARISON_CACHE: { get(key: string): Promise<string | null>; put(key: string, value: string): Promise<void> } | undefined;
}

export async function saveProducts(products: ProductData[]): Promise<void> {
  const data = JSON.stringify({ products, updatedAt: new Date().toISOString() });
  if (typeof COMPARISON_CACHE !== "undefined") {
    await COMPARISON_CACHE.put(CACHE_KEY, data);
  }
  // 로컬 환경에서는 API route가 메모리 캐시 역할
}

export async function loadProducts(): Promise<{ products: ProductData[]; updatedAt: string } | null> {
  if (typeof COMPARISON_CACHE !== "undefined") {
    const raw = await COMPARISON_CACHE.get(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  }
  return null;
}

export function diffProducts(prev: ProductData[], next: ProductData[]): ProductDiff[] {
  const result: ProductDiff[] = [];

  for (const nextProduct of next) {
    const prevProduct = prev.find((p) => p.name === nextProduct.name);
    if (!prevProduct) continue;

    const changes: Diff[] = [];

    if (prevProduct.version !== nextProduct.version) {
      changes.push({ field: "version", old: prevProduct.version, new: nextProduct.version });
    }

    const addedFeatures = nextProduct.features.filter((f) => !prevProduct.features.includes(f));
    const removedFeatures = prevProduct.features.filter((f) => !nextProduct.features.includes(f));

    if (addedFeatures.length > 0) {
      changes.push({ field: "features.added", old: "", new: addedFeatures.join(", ") });
    }
    if (removedFeatures.length > 0) {
      changes.push({ field: "features.removed", old: removedFeatures.join(", "), new: "" });
    }

    const prevPrices = prevProduct.pricing.map((p) => `${p.plan}:${p.price}`).join("|");
    const nextPrices = nextProduct.pricing.map((p) => `${p.plan}:${p.price}`).join("|");
    if (prevPrices !== nextPrices) {
      changes.push({ field: "pricing", old: prevPrices, new: nextPrices });
    }

    if (changes.length > 0) {
      result.push({ product: nextProduct.name, changes });
    }
  }

  return result;
}
