"use client";

import { useState, type ReactNode } from "react";

export interface TabItem {
  label: string;
  content: ReactNode;
  badge?: number;
}

export default function DashboardTabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="mb-6 inline-flex rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-1">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.label}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                isActive ? "bg-[#0f62fe] text-white shadow-[0_2px_10px_rgba(15,98,254,0.35)]" : "text-[#8d8d8d] hover:text-[#f4f4f4]"
              }`}
            >
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-[#393939] text-[#c6c6c6]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div key={active} className="animate-in">
        {items[active].content}
      </div>
    </div>
  );
}
