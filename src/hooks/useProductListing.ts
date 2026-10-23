"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  ProductQueryParams,
  ProductSortField,
  SortOrder,
} from "@/services/products-api";
import { validateProductFilters } from "@/utils/product-filter-validation";

interface UseProductListingOptions {
  initialParams: ProductQueryParams;
}

export function useProductListing({ initialParams }: UseProductListingOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";

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
  const [filterError, setFilterError] = useState("");

  const updateUrl = useCallback(
    (changes: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(changes).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (resetPage && !Object.hasOwn(changes, "page")) {
        params.delete("page");
      }

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(nextUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // Debounce search updates so navigation does not happen on every keystroke.
  useEffect(() => {
    const normalizedSearch = searchDraft.trim();

    if (normalizedSearch === currentSearch) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateUrl({ search: normalizedSearch || undefined });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchDraft, currentSearch, updateUrl]);

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
