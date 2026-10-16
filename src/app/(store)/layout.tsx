import type { ReactNode } from "react";

import CategorySidebar from "@/components/layout/CategorySidebar";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
      <CategorySidebar />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
