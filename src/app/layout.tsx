import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAuthSession } from "@/lib/auth";

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

interface RootLayoutProps {
  children: React.ReactNode;
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <Navbar
          isLoggedIn={session.isLoggedIn}
          userName={session.name}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}