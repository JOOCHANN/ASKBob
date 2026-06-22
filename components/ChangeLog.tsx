import type { ChangeRecord } from "@/lib/crawlers/types";

export default function ChangeLog({ changes }: { changes: ChangeRecord[] }) {
  if (changes.length === 0) {
    return (
      <p className="rounded border border-[#393939] bg-[#262626] p-4 text-sm text-[#8d8d8d]">
        아직 감지된 변경이 없습니다. 주간 수집이 누적되면 가격·기능 변화가 여기에 기록됩니다.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {changes.map((c, i) => (
        <div key={i} className="rounded border border-[#393939] bg-[#262626] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm">
            <span className="font-semibold text-[#f4f4f4]">{c.product}</span>
            <span className="font-mono text-xs text-[#8d8d8d]">
              {c.from ?? "신규"} → {c.to}
            </span>
          </div>
          {c.summary && <p className="mb-2 text-sm text-[#c6c6c6]">{c.summary}</p>}
          <ul className="space-y-0.5 text-xs text-[#8d8d8d]">
            {c.changes.map((d, j) => (
              <li key={j}>
                <span className="text-[#78a9ff]">{d.field}</span>: {d.old || "∅"} → {d.new || "∅"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
