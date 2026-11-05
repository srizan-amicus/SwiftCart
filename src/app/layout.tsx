
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import NavbarContainer from "@/components/layout/NavbarContainer";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SwiftCart — Shop Smarter",
    template: "%s | SwiftCart",
  },
  description:
    "Discover products, explore categories, and shop your favorites with SwiftCart.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <Suspense
          fallback={
            <div className="h-16 border-b border-gray-200 bg-white" />
          }
        >
          <NavbarContainer />
        </Suspense>

        {children}

        <Footer />
      </body>
    </html>
  );
}
