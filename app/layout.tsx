import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "IBM Bob — AI 코드 어시스턴트 비교",
  description: "IBM Bob 테크 셀러를 위한 경쟁사 비교 및 Q&A 웹",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#161616] text-[#f4f4f4]">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
