import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";

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

export default function PopularCategories() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={ButtonVariant.Outline}
              href={`/products?categoryId=${category.id}`}
              className="min-h-12 rounded-md px-2 text-center text-[10px] font-semibold text-orange-600 sm:text-[11px] md:min-h-14"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
