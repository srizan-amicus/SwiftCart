"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchProductsFromApi,
  type ProductPagedResponse,
  type ProductQueryParams,
} from "@/services/products-api";

export default function useProducts(params: ProductQueryParams = {}) {
  const {
    search,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    sortOrder,
    page,
    pageSize,
  } = params;

  const [data, setData] = useState<ProductPagedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = useCallback(
    async (signal: AbortSignal) => {
      return fetchProductsFromApi(
        {
          search,
          categoryId,
          brandId,
          minPrice,
          maxPrice,
          minRating,
          sortBy,
          sortOrder,
          page,
          pageSize,
        },
        signal,
      );
    },
    [
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      sortOrder,
      page,
      pageSize,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchProducts(controller.signal);

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, [fetchProducts, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  return {
    products: data?.products ?? [],
    totalRecords: data?.totalRecords ?? 0,
    totalPages: data?.totalPages ?? 0,
    loading,
    error,
    fetchProducts: retry,
  };
}
