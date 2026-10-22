
"use client";

import { useEffect, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/common/SearchBar";
import { ButtonVariant } from "@/constants/button-variants";
import type {
  ProductPagedResponse,
  ProductQueryParams,
} from "@/services/products-api";

interface ProductListingProps {
  initialData: ProductPagedResponse;
  initialParams: ProductQueryParams;
}

export default function ProductListing({
  initialData,
  initialParams,
}: ProductListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";

  const [searchDraft, setSearchDraft] = useState(
    initialParams.search ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    initialParams.categoryId?.toString() ?? "",
  );
  const [brandId, setBrandId] = useState(
    initialParams.brandId?.toString() ?? "",
  );
  const [minPrice, setMinPrice] = useState(
    initialParams.minPrice?.toString() ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    initialParams.maxPrice?.toString() ?? "",
  );
  const [minRating, setMinRating] = useState(
    initialParams.minRating?.toString() ?? "",
  );
  const [sortBy, setSortBy] = useState(initialParams.sortBy ?? "");
  const [sortOrder, setSortOrder] = useState(
    initialParams.sortOrder ?? "asc",
  );
  const [filterError, setFilterError] = useState("");

  const { products, page, pageSize, totalPages, totalRecords } =
    initialData;

  // Keep the search field synchronized with browser navigation and URL changes.
  useEffect(() => {
    setSearchDraft(currentSearch);
  }, [currentSearch]);

  // Debounce search: update the URL only after the user pauses typing.
  useEffect(() => {
    const normalizedSearch = searchDraft.trim();

    if (normalizedSearch === currentSearch) {
      return;
    }

    const timeoutId = setTimeout(() => {
      updateUrl({ search: normalizedSearch || undefined });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchDraft, currentSearch]);

  // Refresh filter controls when the server returns data for a new URL.
  useEffect(() => {
    setCategoryId(initialParams.categoryId?.toString() ?? "");
    setBrandId(initialParams.brandId?.toString() ?? "");
    setMinPrice(initialParams.minPrice?.toString() ?? "");
    setMaxPrice(initialParams.maxPrice?.toString() ?? "");
    setMinRating(initialParams.minRating?.toString() ?? "");
    setSortBy(initialParams.sortBy ?? "");
    setSortOrder(initialParams.sortOrder ?? "asc");
  }, [
    initialParams.categoryId,
    initialParams.brandId,
    initialParams.minPrice,
    initialParams.maxPrice,
    initialParams.minRating,
    initialParams.sortBy,
    initialParams.sortOrder,
  ]);

  function updateUrl(
    changes: Record<string, string | undefined>,
    resetPage = true,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (resetPage && !("page" in changes)) {
      params.delete("page");
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.push(nextUrl, { scroll: false });
    });
  }

function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilterError("");

    const min = minPrice.trim() === "" ? undefined : Number(minPrice);
    const max = maxPrice.trim() === "" ? undefined : Number(maxPrice);
    const rating =
      minRating.trim() === "" ? undefined : Number(minRating);

    if (
      (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
      (max !== undefined && (!Number.isFinite(max) || max < 0))
    ) {
      setFilterError("Prices must be valid non-negative numbers.");
      return;
    }

    if (min !== undefined && max !== undefined && min > max) {
      setFilterError("Minimum price cannot exceed maximum price.");
      return;
    }

    if (
      rating !== undefined &&
      (!Number.isFinite(rating) || rating < 0 || rating > 5)
    ) {
      setFilterError("Rating must be between 0 and 5.");
      return;
    }

    if (categoryId && (!Number.isInteger(Number(categoryId)) || Number(categoryId) < 1)) {
      setFilterError("Category ID must be a positive integer.");
      return;
    }

    if (brandId && (!Number.isInteger(Number(brandId)) || Number(brandId) < 1)) {
      setFilterError("Brand ID must be a positive integer.");
      return;
    }

    updateUrl({
      categoryId: categoryId || undefined,
      brandId: brandId || undefined,
      minPrice: min === undefined ? undefined : String(min),
      maxPrice: max === undefined ? undefined : String(max),
      minRating: rating === undefined ? undefined : String(rating),
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
    });
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    updateUrl({ page: String(nextPage) }, false);
  }

  function resetFilters() {
    setCategoryId("");
    setBrandId("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSortBy("");
    setSortOrder("asc");
    setFilterError("");

    updateUrl({
      categoryId: undefined,
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  }

  const firstProduct =
    totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastProduct = Math.min(page * pageSize, totalRecords);

  return (
    <section className="min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>

        <p className="mt-1 text-sm text-gray-500">
          {currentSearch
            ? `Search results for "${currentSearch}"`
            : "Browse our catalog"}
        </p>

        <div className="mt-4">
          <SearchBar
            value={searchDraft}
            onChange={setSearchDraft}
            onSearch={() =>
              updateUrl({ search: searchDraft.trim() || undefined })
            }
            placeholder="Search products..."
          />
        </div>
      </div>

      <form
        onSubmit={applyFilters}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
      >
        <h2 className="mb-4 font-semibold text-gray-900">
          Filter and sort products
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm text-gray-700">
            Category ID
            <input
              type="number"
              min="1"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              placeholder="Any category"
              className="mt-1 h-10 w-full rounded border border-gray-300 px-3"
            />
          </label>

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
              onChange={(event) => setSortBy(event.target.value)}
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
                onChange={(event) => setSortOrder(event.target.value)}
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

      <div
        className="mb-4 flex flex-wrap items-center justify-between gap-3"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500">
          {totalRecords === 0
            ? "No products to show"
            : `Showing ${firstProduct}–${lastProduct} of ${totalRecords} products`}
        </p>

        {isPending && (
          <p className="text-sm text-gray-500">Updating products...</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-800">No products found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try a different search or adjust your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="listing"
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Product pagination"
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              <Button
                variant={ButtonVariant.Outline}
                disabled={page <= 1 || isPending}
                onClick={() => changePage(page - 1)}
                className="!w-auto"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={
                      pageNumber === page
                        ? ButtonVariant.Primary
                        : ButtonVariant.Outline
                    }
                    disabled={isPending}
                    onClick={() => changePage(pageNumber)}
                    className="!w-auto"
                    ariaLabel={`Page ${pageNumber}`}
                  >
                    {pageNumber}
                  </Button>
                ),
              )}

              <Button
                variant={ButtonVariant.Outline}
                disabled={page >= totalPages || isPending}
                onClick={() => changePage(page + 1)}
                className="!w-auto"
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
