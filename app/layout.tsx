import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnapExplain — AI Image Explainer powered by MiMo",
  description:
    "Upload or paste any image and get instant AI-powered analysis. Explain screenshots, read handwritten notes, analyze charts, translate text, review code, and more — powered by Xiaomi MiMo multimodal AI.",
  keywords: [
    "AI image analysis",
    "image explainer",
    "MiMo AI",
    "multimodal AI",
    "OCR",
    "chart analysis",
    "code review AI",
  ],
  openGraph: {
    title: "SnapExplain — AI Image Explainer",
    description: "AI-powered image analysis in seconds. Powered by MiMo V2.5.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
