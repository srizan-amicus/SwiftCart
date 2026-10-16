"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";
import useProducts from "@/hooks/useProducts";

export default function ProductListing() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryIdParam = searchParams.get("categoryId");

  const parsedCategoryId = Number(categoryIdParam);
  const categoryId =
    categoryIdParam &&
    Number.isInteger(parsedCategoryId) &&
    parsedCategoryId > 0
      ? parsedCategoryId
      : undefined;

  // Keep the page associated with the current search and category.
  const [pagination, setPagination] = useState({
    search,
    categoryId,
    page: 1,
  });

  const filtersChanged =
    pagination.search !== search || pagination.categoryId !== categoryId;

  // Use page 1 immediately when the URL filters change.
  const page = filtersChanged ? 1 : pagination.page;

  const { products, totalPages, totalRecords, loading, error, fetchProducts } =
    useProducts({
      search: search || undefined,
      categoryId,
      page,
      pageSize: 12,
    });

  function changePage(nextPage: number) {
    setPagination({
      search,
      categoryId,
      page: nextPage,
    });
  }

  return (
    <section className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {search ? `Search results for "${search}"` : "Browse our catalog"}
          </p>
        </div>

        {!loading && !error && (
          <span className="text-sm text-gray-500">{totalRecords} products</span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="h-44 rounded bg-gray-200" />
              <div className="mt-4 h-4 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-5 h-10 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className="rounded-lg border border-red-200 bg-white p-8 text-center"
          role="alert"
        >
          <p className="text-sm text-red-600">{error}</p>

          <Button
            variant={ButtonVariant.Outline}
            onClick={fetchProducts}
            className="mx-auto mt-4 !w-auto"
          >
            Try Again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-800">No products found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try another search or choose a different category.
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
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant={ButtonVariant.Outline}
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
                className="!w-auto"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <Button
                variant={ButtonVariant.Outline}
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
                className="!w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
