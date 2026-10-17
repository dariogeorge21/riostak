import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RIOSTAK — Towards Flourishing",
  description:
    "RIOSTAK is an interdisciplinary institute advancing the science and art of human flourishing through empirical research, courses, and open educational resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${newsreader.variable}`}
    >
      <body className="bg-background font-sans text-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
