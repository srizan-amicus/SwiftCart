"use client";

import ErrorContent from "@/components/common/ErrorContent";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StoreErrorPage({ reset }: ErrorProps) {
  return <ErrorContent reset={reset} />;
}
