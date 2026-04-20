import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Providers from "./providers";

// Essential for Telegram Mini Apps
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Nafas Wellness",
  description: "The Pulse of UAE Wellness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased premium-bg overflow-x-hidden select-none" 
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        
        {/* Global Atmospheric Auras - Fixed Depth */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-white/20 blur-[100px] -top-20 -left-20 animate-pulse rounded-full" />
          <div className="absolute w-[400px] h-[400px] bg-blue-200/20 blur-[100px] top-1/2 -right-20 rounded-full" />
        </div>

        <Providers>
          <main className="relative z-10 min-h-[100dvh]">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
