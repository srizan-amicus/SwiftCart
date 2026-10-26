"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/useDebounce";
import {
  fetchProductsFromApi,
  type ProductPagedResponse,
  type ProductQueryParams,
  type ProductSortField,
  type SortOrder,
} from "@/services/products-api";
import { buildProductQueryParams } from "@/utils/build-product-query";
import { updateSearchParams } from "@/utils/update-search-params";
import { validateProductFilters } from "@/utils/product-filter-validation";

interface UseProductListingOptions {
  initialParams: ProductQueryParams;
  initialData: ProductPagedResponse;
}

export function useProductListing({
  initialParams,
  initialData,
}: UseProductListingOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const queryString = searchParams.toString();
  const currentSearch = searchParams.get("search") ?? "";

  const [productsData, setProductsData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [filterError, setFilterError] = useState("");

  const [searchDraft, setSearchDraft] = useState(initialParams.search ?? "");
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
  const [sortBy, setSortBy] = useState<ProductSortField | "">(
    initialParams.sortBy ?? "",
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialParams.sortOrder ?? "asc",
  );

  const debouncedSearch = useDebounce(searchDraft, 400);
  const hasSkippedInitialFetch = useRef(false);
  const previousQueryString = useRef(queryString);

  const updateUrl = useCallback(
    (changes: Record<string, string | undefined>, resetPage = true) => {
      const query = updateSearchParams(queryString, changes, resetPage);
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(nextUrl, { scroll: false });
      });
    },
    [pathname, queryString, router],
  );

  // Fetch products when the URL query changes.
  useEffect(() => {
    if (!hasSkippedInitialFetch.current) {
      hasSkippedInitialFetch.current = true;

      if (queryString === "") {
        return;
      }
    }

    const controller = new AbortController();

    async function loadProducts() {
      const query = buildProductQueryParams(new URLSearchParams(queryString));

      setIsLoading(true);
      setFetchError("");

      try {
        const result = await fetchProductsFromApi(query, controller.signal);

        setProductsData(result);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setFetchError("Unable to load products. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [queryString]);

  // Detect URL navigation and synchronize the filter inputs.
  useEffect(() => {
    if (previousQueryString.current === queryString) {
      return;
    }

    previousQueryString.current = queryString;

    setSearchDraft(searchParams.get("search") ?? "");
    setBrandId(searchParams.get("brandId") ?? "");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setMinRating(searchParams.get("minRating") ?? "");

    const rawSortBy = searchParams.get("sortBy");

    setSortBy(
      rawSortBy === "name" || rawSortBy === "price" || rawSortBy === "rating"
        ? rawSortBy
        : "",
    );

    setSortOrder(searchParams.get("sortOrder") === "desc" ? "desc" : "asc");
  }, [queryString, searchParams]);

  // Debounce search updates.
  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim();

    if (normalizedSearch === currentSearch) {
      return;
    }

    updateUrl({ search: normalizedSearch || undefined });
  }, [debouncedSearch, currentSearch, updateUrl]);

  const applyFilters = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const error = validateProductFilters({
        brandId,
        minPrice,
        maxPrice,
        minRating,
      });

      if (error) {
        setFilterError(error);
        return;
      }

      setFilterError("");

      updateUrl({
        brandId: brandId.trim() || undefined,
        minPrice: minPrice.trim() || undefined,
        maxPrice: maxPrice.trim() || undefined,
        minRating: minRating.trim() || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortBy ? sortOrder : undefined,
      });
    },
    [brandId, minPrice, maxPrice, minRating, sortBy, sortOrder, updateUrl],
  );

  const resetFilters = useCallback(() => {
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
  }, [updateUrl]);

  const changePage = useCallback(
    (nextPage: number, totalPages: number) => {
      if (
        !Number.isInteger(nextPage) ||
        nextPage < 1 ||
        nextPage > totalPages
      ) {
        return;
      }

      updateUrl({ page: String(nextPage) }, false);
    },
    [updateUrl],
  );

  return {
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
    changePage,
    updateUrl,
    isPending,
  };
}
