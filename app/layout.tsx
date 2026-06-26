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
  title: "AIFirst | Article 4 AI Literacy Compliance",
  description:
    "Audit-ready AI literacy evidence, AI use register, and compliance packs for Irish SMEs under Article 4 of the EU AI Act.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IE">
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className}`}>
        {children}
      </body>
    </html>
  );
}
