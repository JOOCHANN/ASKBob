export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#f4f4f4] mb-2">
          AI 코드 어시스턴트 비교
        </h1>
        <p className="text-[#8d8d8d] text-sm">
          IBM Bob vs GitHub Copilot · Claude Code · OpenAI Codex · Cursor
        </p>
      </div>

      {/* 준비 중 안내 */}
      <div className="bg-[#262626] border border-[#393939] rounded p-8 text-center">
        <div className="inline-block w-3 h-3 rounded-full bg-[#0f62fe] mb-4" />
        <h2 className="text-[#f4f4f4] text-lg font-semibold mb-2">
          비교 대시보드 구현 중
        </h2>
        <p className="text-[#8d8d8d] text-sm">
          Step 5에서 기능 비교 테이블과 가격 비교 카드가 이 자리에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
