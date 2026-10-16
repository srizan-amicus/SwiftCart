import Link from "next/link";

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
  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-base font-bold text-gray-900">Categories</h2>

        <nav aria-label="Product categories">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?categoryId=${category.id}`}
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
