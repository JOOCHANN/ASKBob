import type { ReactNode } from "react";
import type { Snapshot } from "@/lib/crawlers/types";

const BOB = "IBM Bob";

function formatPrice(price: string): string {
  if (/^\d/.test(price)) return `$${price}`;
  return price; // Free, 문의, Custom 등
}

/** Bob을 맨 앞으로 정렬 */
function ordered(snaps: Snapshot[]): Snapshot[] {
  return [...snaps].sort((a, b) => (a.product === BOB ? -1 : b.product === BOB ? 1 : 0));
}

const rows: { label: string; render: (s: Snapshot) => ReactNode }[] = [
  {
    label: "가격",
    render: (s) => (
      <ul className="space-y-1">
        {s.pricing.map((p, i) => (
          <li key={i}>
            <span className="text-[#f4f4f4]">{p.plan}</span>{" "}
            <span className="text-[#8d8d8d]">
              {formatPrice(p.price)}
              {p.unit ? ` / ${p.unit}` : ""}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: "지원 모델",
    render: (s) =>
      s.models.length ? (
        <div className="flex flex-wrap gap-1">
          {s.models.map((m, i) => (
            <span key={i} className="rounded bg-[#393939] px-2 py-0.5 text-xs text-[#f4f4f4]">
              {m}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[#6f6f6f]">—</span>
      ),
  },
  {
    label: "IDE · 통합",
    render: (s) => <span className="text-[#c6c6c6]">{s.supportedIDEs.join(", ") || "—"}</span>,
  },
  {
    label: "핵심 기능",
    render: (s) => (
      <ul className="list-disc space-y-1 pl-4 text-[#c6c6c6]">
        {s.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    ),
  },
];

export default function ComparisonTable({ snapshots }: { snapshots: Snapshot[] }) {
  const products = ordered(snapshots);
  if (products.length === 0) {
    return <p className="text-[#8d8d8d] text-sm">아직 수집된 비교 데이터가 없습니다.</p>;
  }
  return (
    <div className="overflow-x-auto rounded border border-[#393939]">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#393939] bg-[#262626]">
            <th className="w-32 p-3 text-left font-medium text-[#8d8d8d]">항목</th>
            {products.map((s) => {
              const isBob = s.product === BOB;
              return (
                <th
                  key={s.product}
                  className={`p-3 text-left font-semibold ${isBob ? "bg-[#0f62fe]/15 text-[#78a9ff]" : "text-[#f4f4f4]"}`}
                >
                  {s.product}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[#393939] align-top last:border-b-0">
              <td className="p-3 font-medium text-[#8d8d8d]">{row.label}</td>
              {products.map((s) => (
                <td key={s.product} className={`p-3 ${s.product === BOB ? "bg-[#0f62fe]/10" : ""}`}>
                  {row.render(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
