import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duxbury Weather · Live Forecast",
  description: "Live weather for Duxbury, Massachusetts (Open-Meteo) with Supabase logging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_rgba(2,6,23,1)_60%)]">
          {children}
        </div>
      </body>
    </html>
  );
}
