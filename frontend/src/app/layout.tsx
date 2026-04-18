import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Providers from "./providers";

// Premium Geometric Font
const lexend = Lexend({ 
  subsets: ["latin"],
  weight: ['300', '400', '600'],
  variable: '--font-lexend',
  display: 'swap',
});

// Essential Telegram Mini App Viewport Settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0f172a', // Dark slate for premium feel
};

export const metadata: Metadata = {
  title: "Nafas Wellness",
  description: "The Pulse of UAE Wellness • AI Coach + SocialFi on TON",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nafas",
  },
  other: {
    "telegram:mini-app": "true",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lexend.variable}>
      <body className="font-sans antialiased premium-bg overflow-x-hidden select-none min-h-[100dvh]">
        
        {/* Global Atmospheric Auras (Realistic Cloud Depth) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="aura-blur w-[500px] h-[500px] bg-white/40 -top-20 -left-20 animate-pulse" />
          <div className="aura-blur w-[400px] h-[400px] bg-blue-200/30 top-1/2 -right-20" />
          <div className="aura-blur w-[600px] h-[600px] bg-emerald-100/20 -bottom-20 left-1/2 -translate-x-1/2" />
        </div>

        <Providers>
          {/* Main Content Area */}
          <main className="relative z-10 min-h-[100dvh]">
            {children}
          </main>

          {/* Global Floating Bottom Navigation */}
          <BottomNav />
        </Providers>

      </body>
    </html>
  );
}
