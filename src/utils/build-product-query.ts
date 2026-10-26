import type {
  ProductQueryParams,
  ProductSortField,
  SortOrder,
} from "@/services/products-api";

function toPositiveInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function toNonNegativeNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function toSortField(value: string | null): ProductSortField | undefined {
  const normalized = value?.toLowerCase();

  if (
    normalized === "name" ||
    normalized === "price" ||
    normalized === "rating"
  ) {
    return normalized;
  }

  return undefined;
}

function toSortOrder(value: string | null): SortOrder | undefined {
  const normalized = value?.toLowerCase();

  if (normalized === "asc" || normalized === "desc") {
    return normalized;
  }

  return undefined;
}

export function buildProductQueryParams(
  params: URLSearchParams,
): ProductQueryParams {
  const minRating = toNonNegativeNumber(params.get("minRating"));
  const sortBy = toSortField(params.get("sortBy"));

  return {
    search: params.get("search")?.trim() || undefined,
    categoryId: toPositiveInteger(params.get("categoryId")),
    brandId: toPositiveInteger(params.get("brandId")),
    minPrice: toNonNegativeNumber(params.get("minPrice")),
    maxPrice: toNonNegativeNumber(params.get("maxPrice")),
    minRating:
      minRating !== undefined && minRating <= 5 ? minRating : undefined,
    sortBy,
    sortOrder: sortBy ? toSortOrder(params.get("sortOrder")) : undefined,
    page: toPositiveInteger(params.get("page")) ?? 1,
    pageSize: 12,
  };
}
