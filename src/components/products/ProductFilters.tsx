"use client";

import type { FormEvent } from "react";

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
  return (
    <form
      onSubmit={applyFilters}
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 className="mb-4 font-semibold text-gray-900">
        Filter and sort products
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm text-gray-700">
          Brand ID
          <input
            type="number"
            min="1"
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
            placeholder="Any brand"
            className="mt-1 h-10 w-full rounded border border-gray-300 px-3"
          />
        </label>

        <label className="text-sm text-gray-700">
          Minimum price
          <input
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="No minimum"
            className="mt-1 h-10 w-full rounded border border-gray-300 px-3"
          />
        </label>

        <label className="text-sm text-gray-700">
          Maximum price
          <input
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="No maximum"
            className="mt-1 h-10 w-full rounded border border-gray-300 px-3"
          />
        </label>

        <label className="text-sm text-gray-700">
          Minimum rating
          <select
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
            className="mt-1 h-10 w-full rounded border border-gray-300 bg-white px-3"
          >
            <option value="">Any rating</option>
            <option value="1">1+ stars</option>
            <option value="2">2+ stars</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="5">5 stars</option>
          </select>
        </label>

        <label className="text-sm text-gray-700">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "" || isProductSortField(value)) {
                setSortBy(value);
              }
            }}
            className="mt-1 h-10 w-full rounded border border-gray-300 bg-white px-3"
          >
            <option value="">Default order</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        {sortBy && (
          <label className="text-sm text-gray-700">
            Sort order
            <select
              value={sortOrder}
              onChange={(event) => {
                const value = event.target.value;

                if (isSortOrder(value)) {
                  setSortOrder(value);
                }
              }}
              className="mt-1 h-10 w-full rounded border border-gray-300 bg-white px-3"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        )}
      </div>

      {filterError && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {filterError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit" variant={ButtonVariant.Primary}>
          Apply filters
        </Button>

        <Button
          type="button"
          variant={ButtonVariant.Outline}
          onClick={resetFilters}
        >
          Clear filters
        </Button>
      </div>
    </form>
  );
}
