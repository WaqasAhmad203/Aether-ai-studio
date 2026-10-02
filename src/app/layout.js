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

export const metadata = {
  title: "Aether AI Studio — Developer Intelligence",
  description: "Next-generation developer AI studio with reasoning breakdown, live code workspace, prompt presets, and Gemini intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="h-full bg-[#090a0f] text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
