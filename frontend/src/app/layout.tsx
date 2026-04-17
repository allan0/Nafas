import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Nafas Wellness",
  description: "Breathe Better, Live Better - Powered by TON & AI",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#A5D8F8] via-[#7CC6E8] to-[#A8E6B8] text-slate-800 overflow-hidden relative">
        {/* Floating Clouds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="cloud w-32 h-20 top-12 left-10" style={{animationDelay: "0s"}}></div>
          <div className="cloud w-24 h-16 top-28 right-20" style={{animationDelay: "8s"}}></div>
          <div className="cloud w-40 h-24 top-40 left-1/3" style={{animationDelay: "15s"}}></div>
          <div className="cloud w-28 h-18 top-60 right-1/4" style={{animationDelay: "22s"}}></div>
        </div>

        <Providers>
          <main className="pb-20 min-h-screen relative z-10">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
