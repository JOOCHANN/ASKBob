import Link from "next/link";
import { getLatestSnapshots, loadTimeline, loadChanges } from "@/lib/data-store";
import ComparisonTable from "@/components/ComparisonTable";
import TimelineView from "@/components/TimelineView";
import ChangeLog from "@/components/ChangeLog";
import DashboardTabs from "@/components/DashboardTabs";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#1c1c1c]/60 px-4 py-3">
      <div className="text-xl font-semibold text-[#f4f4f4]">{value}</div>
      <div className="text-xs text-[#8d8d8d]">{label}</div>
    </div>
  );
}

export default function Home() {
  const snapshots = getLatestSnapshots();
  const timeline = loadTimeline();
  const changes = loadChanges();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <header className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#1c1c1c]/60 px-3 py-1 text-xs text-[#c6c6c6]">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#42be65]" />
          최종 수집 {timeline.updatedAt} · 주간 자동 추적
        </div>
        <h1 className="bg-gradient-to-r from-[#f4f4f4] to-[#a6c8ff] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          AI 코드 어시스턴트 비교
        </h1>
        <p className="mt-3 max-w-2xl text-[#8d8d8d]">
          IBM Bob을 기준으로 GitHub Copilot · Claude Code · OpenAI Codex · Cursor의 가격·모델·IDE·기능을
          시점별로 추적하고 변화를 자동 감지합니다.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Stat value={`${snapshots.length}`} label="추적 중인 제품" />
          <Stat value="4" label="비교 항목" />
          <Stat value={`${changes.length}`} label="감지된 변경" />
          <Link
            href="/chat"
            className="ml-auto rounded-lg bg-gradient-to-br from-[#4589ff] to-[#0f62fe] px-4 py-2.5 text-sm font-medium text-white no-underline shadow-[0_4px_16px_rgba(15,98,254,0.4)] transition-transform hover:scale-[1.03]"
          >
            Bob에게 물어보기 →
          </Link>
        </div>
      </header>

      <DashboardTabs
        items={[
          { label: "최신 비교", content: <ComparisonTable snapshots={snapshots} /> },
          { label: "타임라인", content: <TimelineView timeline={timeline} /> },
          { label: "변경 이력", content: <ChangeLog changes={changes} />, badge: changes.length },
        ]}
      />
    </div>
  );
}
