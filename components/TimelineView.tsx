import type { Timeline, Snapshot } from "@/lib/crawlers/types";

function priceLine(s: Snapshot): string {
  return s.pricing.map((p) => `${p.plan} ${/^\d/.test(p.price) ? `$${p.price}` : p.price}`).join(" · ");
}

export default function TimelineView({ timeline }: { timeline: Timeline }) {
  const products = Object.entries(timeline.products);
  if (products.length === 0) {
    return <p className="text-[#8d8d8d] text-sm">아직 시계열 데이터가 없습니다.</p>;
  }
  return (
    <div className="space-y-5">
      {products.map(([product, snaps]) => (
        <div key={product} className="rounded border border-[#393939] bg-[#262626] p-4">
          <h3 className="mb-3 font-semibold text-[#f4f4f4]">{product}</h3>
          <ol className="space-y-2">
            {[...snaps].reverse().map((s) => (
              <li key={s.collectedAt} className="flex gap-3 text-sm">
                <span className="w-24 shrink-0 font-mono text-[#78a9ff]">{s.collectedAt}</span>
                <span className="text-[#c6c6c6]">{priceLine(s)}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
