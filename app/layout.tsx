import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stormyy — Fusion brainstorming for ambitious teams",
  description: "Multi-model AI brainstorming for startup, product, and strategy decisions.",
  openGraph: {
    title: "Stormyy",
    description: "Turn rough startup questions into sharper strategic options.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
