
import type { Metadata } from "next";

import ProductListing from "./ProductListing";
import {
  fetchProductsOnServer,
  type ProductQueryParams,
} from "@/services/products-api";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse products and discover your favorites on SwiftCart.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getPositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function getNonNegativeNumber(
  value: string | undefined,
): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const urlParams = await searchParams;

  const search = getSingleParam(urlParams.search)?.trim();
  const categoryId = getPositiveInteger(
    getSingleParam(urlParams.categoryId),
  );
  const brandId = getPositiveInteger(getSingleParam(urlParams.brandId));
  const minPrice = getNonNegativeNumber(
    getSingleParam(urlParams.minPrice),
  );
  const maxPrice = getNonNegativeNumber(
    getSingleParam(urlParams.maxPrice),
  );
  const minRating = getNonNegativeNumber(
    getSingleParam(urlParams.minRating),
  );

  const requestedPage =
    getPositiveInteger(getSingleParam(urlParams.page)) ?? 1;

  const sortBy = getSingleParam(urlParams.sortBy);
  const sortOrder = getSingleParam(urlParams.sortOrder);

  const params: ProductQueryParams = {
    search: search || undefined,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating:
      minRating !== undefined && minRating <= 5 ? minRating : undefined,
    sortBy:
      sortBy && ["name", "price", "rating"].includes(sortBy.toLowerCase())
        ? sortBy.toLowerCase()
        : undefined,
    sortOrder:
      sortOrder && ["asc", "desc"].includes(sortOrder.toLowerCase())
        ? sortOrder.toLowerCase()
        : undefined,
    page: requestedPage,
    pageSize: 12,
  };

  const result = await fetchProductsOnServer(params);

  return (
    <ProductListing
      initialData={result}
      initialParams={params}
    />
  );
}
