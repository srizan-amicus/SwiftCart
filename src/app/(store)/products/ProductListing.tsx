"use client";

import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/common/SearchBar";
import ProductFilters from "@/components/products/ProductFilters";
import { ButtonVariant } from "@/constants/button-variants";
import { useProductListing } from "@/hooks/useProductListing";
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
  const {
    productsData,
    isLoading,
    fetchError,
    searchDraft,
    setSearchDraft,
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
    updateUrl,
    changePage,
    isPending,
  } = useProductListing({ initialParams, initialData });

  const { products, page, pageSize, totalPages, totalRecords } = productsData;

  const firstProduct = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;

  const lastProduct = Math.min(page * pageSize, totalRecords);

  const isUpdating = isPending || isLoading;

  return (
    <section className="min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>

        <p className="mt-1 text-sm text-gray-500">
          {searchDraft.trim()
            ? `Search results for "${searchDraft.trim()}"`
            : "Browse our catalog"}
        </p>

        <div className="mt-4">
          <SearchBar
            value={searchDraft}
            onChange={setSearchDraft}
            onSearch={() =>
              updateUrl({
                search: searchDraft.trim() || undefined,
              })
            }
            placeholder="Search products..."
          />
        </div>
      </div>

      <ProductFilters
        brandId={brandId}
        setBrandId={setBrandId}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterError={filterError}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      <div
        className="mb-4 flex flex-wrap items-center justify-between gap-3"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500">
          {totalRecords === 0
            ? "No products to show"
            : `Showing ${firstProduct}–${lastProduct} of ${totalRecords} products`}
        </p>

        {isUpdating && (
          <p className="text-sm text-gray-500">Updating products...</p>
        )}
      </div>

      {fetchError ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
          role="alert"
        >
          <h2 className="font-semibold text-red-800">
            Unable to load products
          </h2>

          <p className="mt-2 text-sm text-red-700">{fetchError}</p>

          <Button
            variant={ButtonVariant.Outline}
            onClick={() => updateUrl({}, false)}
            className="!mt-4 !w-auto"
          >
            Retry
          </Button>
        </div>
      ) : products.length === 0 && isLoading ? (
        <div
          className="rounded-lg border border-gray-200 bg-white p-10 text-center"
          aria-live="polite"
        >
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-800">No products found</h2>

          <p className="mt-2 text-sm text-gray-500">
            Try a different search or adjust your filters.
          </p>

          <Button
            variant={ButtonVariant.Outline}
            onClick={resetFilters}
            className="!mt-4 !w-auto"
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            aria-busy={isUpdating}
          >
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
                disabled={page <= 1 || isUpdating}
                onClick={() => changePage(page - 1, totalPages)}
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
                    disabled={isUpdating}
                    onClick={() => changePage(pageNumber, totalPages)}
                    className="!w-auto"
                    ariaLabel={`Page ${pageNumber}`}
                  >
                    {pageNumber}
                  </Button>
                ),
              )}

              <Button
                variant={ButtonVariant.Outline}
                disabled={page >= totalPages || isUpdating}
                onClick={() => changePage(page + 1, totalPages)}
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
