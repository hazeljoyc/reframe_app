import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LayoutClient } from "@/components/LayoutClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Reframe: Clarity in Motion",
  description: "A cinematic clarity experience that turns uncertainty into next steps.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Reframe: Clarity in Motion",
    description: "A cinematic clarity experience that turns uncertainty into next steps.",
    images: ["/reframe-icon.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reframe: Clarity in Motion",
    description: "A cinematic clarity experience that turns uncertainty into next steps.",
    images: ["/reframe-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
