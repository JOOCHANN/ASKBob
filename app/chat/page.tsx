export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f4f4f4] mb-2">Q&A 챗봇</h1>
        <p className="text-[#8d8d8d] text-sm">
          IBM Bob에 대해 무엇이든 물어보세요.
        </p>
      </div>

      <div className="bg-[#262626] border border-[#393939] rounded p-8 text-center">
        <div className="inline-block w-3 h-3 rounded-full bg-[#0f62fe] mb-4" />
        <h2 className="text-[#f4f4f4] text-lg font-semibold mb-2">
          챗봇 구현 중
        </h2>
        <p className="text-[#8d8d8d] text-sm">
          Step 6에서 OpenAI 연동 챗봇이 이 자리에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
