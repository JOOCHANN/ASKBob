"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#161616] border-b border-[#393939] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-[#0f62fe] font-bold text-lg tracking-tight">IBM</span>
          <span className="text-[#f4f4f4] font-semibold text-base">Bob</span>
          <span className="text-[#8d8d8d] text-xs ml-1 hidden sm:inline">Seller Companion</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 text-sm rounded transition-colors no-underline ${
              pathname === "/"
                ? "bg-[#0f62fe] text-white"
                : "text-[#c6c6c6] hover:bg-[#393939] hover:text-white"
            }`}
          >
            비교 대시보드
          </Link>
          <Link
            href="/chat"
            className={`px-3 py-1.5 text-sm rounded transition-colors no-underline ${
              pathname === "/chat"
                ? "bg-[#0f62fe] text-white"
                : "text-[#c6c6c6] hover:bg-[#393939] hover:text-white"
            }`}
          >
            Q&A 챗봇
          </Link>
        </nav>
      </div>
    </header>
  );
}
