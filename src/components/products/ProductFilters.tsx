"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";
import type { ProductSortField, SortOrder } from "@/services/products-api";

interface ProductFiltersProps {
  brandId: string;
  setBrandId: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  minRating: string;
  setMinRating: (value: string) => void;
  sortBy: ProductSortField | "";
  setSortBy: (value: ProductSortField | "") => void;
  sortOrder: SortOrder;
  setSortOrder: (value: SortOrder) => void;
  filterError: string;
  applyFilters: (event: FormEvent<HTMLFormElement>) => void;
  resetFilters: () => void;
}

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

const priceRanges = [
  { label: "Under ₹10,000", min: "", max: "10000" },
  { label: "₹10,000 – ₹50,000", min: "10000", max: "50000" },
  { label: "Above ₹50,000", min: "50000", max: "" },
];

function isProductSortField(value: string): value is ProductSortField {
  return value === "name" || value === "price" || value === "rating";
}

function isSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

export default function ProductFilters({
  brandId,
  setBrandId,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filterError,
  applyFilters,
  resetFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const selectedCategory = searchParams.get("categoryId") ?? "";

  const selectedPriceRange = priceRanges.find(
    (range) => range.min === minPrice && range.max === maxPrice,
  );

  function handleCategoryChange(categoryId: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("categoryId", String(categoryId));
    params.delete("page");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function handlePriceRangeChange(min: string, max: string) {
    setMinPrice(min);
    setMaxPrice(max);
  }

  function handleClearFilters() {
    setBrandId("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSortBy("");
    setSortOrder("asc");
    resetFilters();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("categoryId");
    params.delete("brandId");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("minRating");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("page");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 3);

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="mb-5 border-b border-gray-100 pb-4">
        <h2 className="text-base font-bold text-gray-900">Filters</h2>
        <p className="mt-1 text-xs text-gray-400">Refine your results</p>
      </div>

      <section className="border-b border-gray-100 pb-6">
        <h3 className="mb-3 text-sm font-bold text-gray-800">Category</h3>

        <div className="space-y-2">
          {visibleCategories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
            >
              <input
                type="radio"
                name="product-category"
                checked={selectedCategory === String(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="h-4 w-4 accent-orange-500"
              />
              {category.name}
            </label>
          ))}
        </div>

        <Button
          type="button"
          variant={ButtonVariant.Compact}
          onClick={() => setShowAllCategories((current) => !current)}
          className="!min-h-0 !w-auto !rounded-none !px-0 !py-0 text-xs"
        >
          {showAllCategories ? "View less" : "View more"}
        </Button>
      </section>

      <section className="border-b border-gray-100 py-6">
        <h3 className="mb-3 text-sm font-bold text-gray-800">Brand</h3>

        <label className="block text-xs text-gray-500" htmlFor="filter-brand">
          Brand ID
        </label>
        <input
          id="filter-brand"
          type="number"
          min="1"
          value={brandId}
          onChange={(event) => setBrandId(event.target.value)}
          placeholder="Enter brand ID"
          className="mt-2 h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />

        <Button
          type="button"
          variant={ButtonVariant.Compact}
          onClick={() => setShowAllBrands((current) => !current)}
          className="!min-h-0 !w-auto !rounded-none !px-0 !py-0 text-xs"
        >
          {showAllBrands ? "Hide options" : "View more"}
        </Button>

        {showAllBrands && (
          <p className="mt-2 text-xs text-gray-500">
            Enter a brand ID to filter products by brand.
          </p>
        )}
      </section>

      <section className="border-b border-gray-100 py-6">
        <h3 className="mb-3 text-sm font-bold text-gray-800">Price Range</h3>

        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
            >
              <input
                type="radio"
                name="price-range"
                checked={selectedPriceRange?.label === range.label}
                onChange={() => handlePriceRangeChange(range.min, range.max)}
                className="h-4 w-4 accent-orange-500"
              />
              {range.label}
            </label>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <label className="text-xs text-gray-500">
            Minimum
            <input
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="₹ Min"
              className="mt-1 h-9 w-full rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-orange-500"
            />
          </label>

          <label className="text-xs text-gray-500">
            Maximum
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="₹ Max"
              className="mt-1 h-9 w-full rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-orange-500"
            />
          </label>
        </div>
      </section>

      <section className="border-b border-gray-100 py-6">
        <h3 className="mb-3 text-sm font-bold text-gray-800">Rating</h3>

        <div className="space-y-2">
          {[
            { value: "", label: "Any rating" },
            { value: "4", label: "★★★★☆ 4+ stars" },
            { value: "3", label: "★★★☆☆ 3+ stars" },
            { value: "2", label: "★★☆☆☆ 2+ stars" },
            { value: "1", label: "★☆☆☆☆ 1+ star" },
          ].map((rating) => (
            <label
              key={rating.value || "any"}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
            >
              <input
                type="radio"
                name="product-rating"
                checked={minRating === rating.value}
                onChange={() => setMinRating(rating.value)}
                className="h-4 w-4 accent-orange-500"
              />
              <span>{rating.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 py-6">
        <h3 className="text-sm font-bold text-gray-800">Sort Products</h3>

        <label className="block text-xs text-gray-500">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "" || isProductSortField(value)) {
                setSortBy(value);
              }
            }}
            className="mt-1 h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
          >
            <option value="">Default order</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        {sortBy && (
          <label className="block text-xs text-gray-500">
            Sort order
            <select
              value={sortOrder}
              onChange={(event) => {
                const value = event.target.value;
                if (isSortOrder(value)) {
                  setSortOrder(value);
                }
              }}
              className="mt-1 h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        )}
      </section>

      {filterError && (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {filterError}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          variant={ButtonVariant.Primary}
          className="!w-full"
        >
          Apply Filters
        </Button>

        <Button
          type="button"
          variant={ButtonVariant.Outline}
          onClick={handleClearFilters}
          className="!w-full"
        >
          Clear Filters
        </Button>
      </div>
    </form>
  );
}
