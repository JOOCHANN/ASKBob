import type { ReactNode } from "react";
import type { Snapshot } from "@/lib/crawlers/types";

const BOB = "IBM Bob";

function formatPrice(price: string): string {
  if (/^\d/.test(price)) return `$${price.replace(/\.00$/, "")}`;
  return price; // Free, 문의, Custom 등
}

function ordered(snaps: Snapshot[]): Snapshot[] {
  return [...snaps].sort((a, b) => (a.product === BOB ? -1 : b.product === BOB ? 1 : 0));
}

function Pill({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs ${
        accent ? "bg-[#0f62fe]/20 text-[#78a9ff]" : "bg-[#333] text-[#c6c6c6]"
      }`}
    >
      {children}
    </span>
  );
}

const rows: { label: string; render: (s: Snapshot, isBob: boolean) => ReactNode }[] = [
  {
    label: "가격",
    render: (s) => (
      <div className="space-y-1.5">
        {s.pricing.map((p, i) => (
          <div key={i} className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] text-[#c6c6c6]">{p.plan}</span>
            <span className="font-semibold text-[#f4f4f4]">{formatPrice(p.price)}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "지원 모델",
    render: (s, isBob) =>
      s.models.length ? (
        <div className="flex flex-wrap gap-1.5">
          {s.models.map((m, i) => (
            <Pill key={i} accent={isBob}>
              {m}
            </Pill>
          ))}
        </div>
      ) : (
        <span className="text-[#6f6f6f]">—</span>
      ),
  },
  {
    label: "IDE · 통합",
    render: (s) =>
      s.supportedIDEs.length ? (
        <div className="flex flex-wrap gap-1.5">
          {s.supportedIDEs.map((d, i) => (
            <Pill key={i}>{d}</Pill>
          ))}
        </div>
      ) : (
        <span className="text-[#6f6f6f]">—</span>
      ),
  },
  {
    label: "핵심 기능",
    render: (s) => (
      <ul className="space-y-1.5">
        {s.features.map((f, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-[#c6c6c6]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#4589ff]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

function Avatar({ name, isBob }: { name: string; isBob: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${
        isBob ? "bg-gradient-to-br from-[#4589ff] to-[#0f62fe] shadow-[0_0_12px_rgba(15,98,254,0.5)]" : "bg-[#393939]"
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}

export default function ComparisonTable({ snapshots }: { snapshots: Snapshot[] }) {
  const products = ordered(snapshots);
  if (products.length === 0) {
    return <p className="text-sm text-[#8d8d8d]">아직 수집된 비교 데이터가 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#2a2a2a] bg-[#1c1c1c]/60 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <table className="w-full min-w-[860px] border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-36 bg-[#1c1c1c] p-4" />
            {products.map((s) => {
              const isBob = s.product === BOB;
              return (
                <th
                  key={s.product}
                  className={`border-l border-[#2a2a2a] p-4 text-left align-bottom ${
                    isBob ? "bg-[#0f62fe]/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.product} isBob={isBob} />
                    <div>
                      <div className="font-semibold text-[#f4f4f4]">{s.product}</div>
                      {isBob && <div className="text-[11px] font-medium text-[#78a9ff]">기준 제품</div>}
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[#2a2a2a] align-top">
              <td className="sticky left-0 z-10 bg-[#1c1c1c] p-4 text-sm font-medium text-[#8d8d8d]">{row.label}</td>
              {products.map((s) => {
                const isBob = s.product === BOB;
                return (
                  <td key={s.product} className={`border-l border-[#2a2a2a] p-4 ${isBob ? "bg-[#0f62fe]/[0.07]" : ""}`}>
                    {row.render(s, isBob)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
