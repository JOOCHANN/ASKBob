"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "비교 대시보드" },
  { href: "/chat", label: "Q&A 챗봇" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#161616]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 no-underline">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#4589ff] to-[#0f62fe] text-xs font-bold text-white shadow-[0_0_12px_rgba(15,98,254,0.5)]">
            B
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight text-[#f4f4f4]">IBM Bob</span>
            <span className="hidden text-xs text-[#6f6f6f] sm:inline">AI Tracker</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm no-underline transition-all ${
                  active
                    ? "bg-[#0f62fe] text-white shadow-[0_0_12px_rgba(15,98,254,0.35)]"
                    : "text-[#c6c6c6] hover:bg-[#262626] hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
