"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  { id: 8, name: "Accessories" },
  { id: 3, name: "Books" },
  { id: 2, name: "Clothing" },
  { id: 1, name: "Electronics" },
  { id: 6, name: "Everyday Use" },
  { id: 4, name: "Home" },
  { id: 5, name: "Sports" },
  { id: 7, name: "Toys" },
];

export default function CategorySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (pathname === "/products" || /^\/products\/[^/]+$/.test(pathname)) {
  return null;
}
  const selectedCategory = searchParams.get("categoryId");

  function handleCategoryChange(categoryId: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("categoryId", String(categoryId));
    params.delete("page");

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(nextUrl, { scroll: false });
    });
  }

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 text-base font-bold text-gray-900">Categories</h2>

        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex cursor-pointer items-center gap-2 text-sm transition-colors ${
                selectedCategory === String(category.id)
                  ? "font-semibold text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              } ${isPending ? "opacity-70" : ""}`}
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === String(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                disabled={isPending}
                className="h-4 w-4 accent-orange-500"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
