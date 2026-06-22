import type { Timeline, Snapshot } from "@/lib/crawlers/types";

const BOB = "IBM Bob";

function priceLine(s: Snapshot): string {
  return s.pricing.map((p) => `${p.plan} ${/^\d/.test(p.price) ? `$${p.price.replace(/\.00$/, "")}` : p.price}`).join(" · ");
}

export default function TimelineView({ timeline }: { timeline: Timeline }) {
  const products = Object.entries(timeline.products).sort(([a], [b]) => (a === BOB ? -1 : b === BOB ? 1 : 0));
  if (products.length === 0) {
    return <p className="text-sm text-[#8d8d8d]">아직 시계열 데이터가 없습니다.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map(([product, snaps]) => {
        const isBob = product === BOB;
        return (
          <div
            key={product}
            className={`rounded-xl border p-5 ${
              isBob ? "border-[#0f62fe]/40 bg-[#0f62fe]/[0.06]" : "border-[#2a2a2a] bg-[#1c1c1c]/60"
            }`}
          >
            <div className="mb-4 flex items-center gap-2">
              <h3 className="font-semibold text-[#f4f4f4]">{product}</h3>
              {isBob && <span className="rounded-full bg-[#0f62fe]/20 px-2 py-0.5 text-[11px] font-medium text-[#78a9ff]">기준</span>}
            </div>
            <ol className="relative space-y-4 border-l border-[#393939] pl-5">
              {[...snaps].reverse().map((s) => (
                <li key={s.collectedAt} className="relative">
                  <span className="absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-[#161616] bg-[#4589ff]" />
                  <div className="font-mono text-xs text-[#78a9ff]">{s.collectedAt}</div>
                  <div className="mt-0.5 text-[13px] text-[#c6c6c6]">{priceLine(s)}</div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
