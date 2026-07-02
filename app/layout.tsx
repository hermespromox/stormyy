import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stormyy — Fusion brainstorming for ambitious teams",
  description:
    "A clean brainstorming tool powered by OpenRouter Fusion for strategic product, startup, and acquisition ideas.",
  openGraph: {
    title: "Stormyy",
    description: "Multi-model brainstorming for ambitious teams.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
