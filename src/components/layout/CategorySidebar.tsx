
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId");

  function getCategoryUrl(categoryId: number) {
    const params = new URLSearchParams(searchParams.toString());

    // Toggle off the selected category, or select a different one.
    if (activeCategoryId === String(categoryId)) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", String(categoryId));
    }

    // Changing a filter should reset pagination.
    params.delete("page");

    const queryString = params.toString();
    return queryString ? `/products?${queryString}` : "/products";
  }

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-base font-bold text-gray-900">
          Categories
        </h2>

        <nav aria-label="Product categories">
          <ul className="space-y-1">
            {categories.map((category) => {
              const isActive = activeCategoryId === String(category.id);

              return (
                <li key={category.id}>
                  <Link
                    href={getCategoryUrl(category.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-orange-50 font-semibold text-orange-600"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
