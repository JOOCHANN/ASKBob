import { getLatestSnapshots, loadTimeline, loadChanges } from "@/lib/data-store";
import ComparisonTable from "@/components/ComparisonTable";
import TimelineView from "@/components/TimelineView";
import ChangeLog from "@/components/ChangeLog";

export default function Home() {
  const snapshots = getLatestSnapshots();
  const timeline = loadTimeline();
  const changes = loadChanges();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#f4f4f4] mb-2">AI 코드 어시스턴트 비교</h1>
        <p className="text-[#8d8d8d] text-sm">
          IBM Bob vs GitHub Copilot · Claude Code · OpenAI Codex · Cursor
          <span className="ml-2 text-[#6f6f6f]">최종 수집 {timeline.updatedAt}</span>
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-[#f4f4f4]">최신 비교</h2>
        <ComparisonTable snapshots={snapshots} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-[#f4f4f4]">제품별 타임라인</h2>
        <TimelineView timeline={timeline} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#f4f4f4]">변경 이력</h2>
        <ChangeLog changes={changes} />
      </section>
    </div>
  );
}
