"use client";

import "./globals.css";

import ErrorContent from "@/components/common/ErrorContent";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <ErrorContent reset={reset} />
      </body>
    </html>
  );
}
