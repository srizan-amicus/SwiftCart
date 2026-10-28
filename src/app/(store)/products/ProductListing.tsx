
"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

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
  const router = useRouter();

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

  const firstProduct =
    totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;

  const lastProduct = Math.min(page * pageSize, totalRecords);
  const isUpdating = isPending || isLoading;

  return (
    <section className="min-w-0 bg-gray-50 px-4 py-5 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1430px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className="text-gray-500 transition-colors hover:text-orange-600"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400">
              /
            </li>
            <li aria-current="page" className="font-medium text-gray-900">
              Products
            </li>
          </ol>
        </nav>

        {/* Page heading */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Product Listing
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {searchDraft.trim()
                ? `Search results for "${searchDraft.trim()}"`
                : "Browse and find products you like"}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <p className="hidden text-sm text-gray-500 sm:block">
              Showing {totalRecords} results
            </p>

            <Button
              variant={ButtonVariant.Primary}
              onClick={() => router.refresh()}
              className="!h-11 !w-auto !min-w-[150px] !rounded-lg"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        {/* Sidebar and product grid */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden min-w-0 md:sticky md:top-5 md:block md:self-start">
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
          </aside>

          {/* Products area */}
          <div className="min-w-0">
            <div className="mb-5">
              <SearchBar
                value={searchDraft}
                onChange={setSearchDraft}
                onSearch={() =>
                  updateUrl({
                    search: searchDraft.trim() || undefined,
                  })
                }
                placeholder="Search by product name or keyword"
              />
            </div>

            {/* Mobile filters */}
            <div className="mb-5 md:hidden">
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
            </div>

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
                <p className="text-sm text-gray-500">
                  Updating products...
                </p>
              )}
            </div>

            {fetchError ? (
              <div
                className="rounded-xl border border-red-200 bg-white p-8 text-center"
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
                className="rounded-xl border border-gray-200 bg-white p-10 text-center"
                aria-live="polite"
              >
                <p className="text-sm text-gray-500">
                  Loading products...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                <h2 className="font-semibold text-gray-800">
                  No products found
                </h2>

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
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
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

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((pageNumber) => (
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
                    ))}

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
          </div>
        </div>
      </div>
    </section>
  );
}
