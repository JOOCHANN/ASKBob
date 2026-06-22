import type { ChangeRecord } from "@/lib/crawlers/types";

export default function ChangeLog({ changes }: { changes: ChangeRecord[] }) {
  if (changes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#393939] bg-[#1c1c1c]/40 px-6 py-14 text-center">
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-[#6f6f6f]">⏱</span>
        <p className="text-sm text-[#8d8d8d]">아직 감지된 변경이 없습니다.</p>
        <p className="mt-1 text-xs text-[#6f6f6f]">주간 수집이 누적되면 가격·기능 변화가 여기에 기록됩니다.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {changes.map((c, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1c1c1c]/60 pl-1"
        >
          <div className="border-l-2 border-[#4589ff] py-4 pl-4 pr-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold text-[#f4f4f4]">{c.product}</span>
              <span className="rounded-full bg-[#262626] px-2 py-0.5 font-mono text-[11px] text-[#8d8d8d]">
                {c.from ?? "신규"} → {c.to}
              </span>
            </div>
            {c.summary && <p className="mb-3 text-sm leading-relaxed text-[#c6c6c6]">{c.summary}</p>}
            <ul className="flex flex-wrap gap-2">
              {c.changes.map((d, j) => (
                <li key={j} className="rounded-md bg-[#262626] px-2 py-1 text-xs text-[#8d8d8d]">
                  <span className="text-[#78a9ff]">{d.field}</span>
                  <span className="mx-1.5 text-[#525252]">{d.old || "∅"} →</span>
                  <span className="text-[#f4f4f4]">{d.new || "∅"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
