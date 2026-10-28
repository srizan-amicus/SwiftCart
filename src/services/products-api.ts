import type { Product } from "@/types/product";

export type ProductSortField = "name" | "price" | "rating";
export type SortOrder = "asc" | "desc";

export interface ProductQueryParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: ProductSortField | "";
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

interface ProductApiResponse {
  productId: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  price: number;
  rating: number;
  imagePath?: string | null;
}

interface ProductApiPagedResponse {
  products: ProductApiResponse[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ProductPagedResponse {
  products: Product[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

const QUERY_KEYS: Record<keyof ProductQueryParams, string> = {
  search: "Search",
  categoryId: "CategoryId",
  brandId: "BrandId",
  minPrice: "MinPrice",
  maxPrice: "MaxPrice",
  minRating: "MinRating",
  sortBy: "SortBy",
  sortOrder: "SortOrder",
  page: "Page",
  pageSize: "PageSize",
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function buildQueryString(params: ProductQueryParams): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    query.set(QUERY_KEYS[key as keyof ProductQueryParams], String(value));
  }

  return query.toString();
}

function mapApiProduct(
  product: ProductApiResponse,
  imageBaseUrl?: string,
): Product {
  const imagePath = product.imagePath?.trim() || "";
  const normalizedImagePath = imagePath.replace(/^\/+/, "");
  const normalizedBaseUrl = imageBaseUrl ? normalizeBaseUrl(imageBaseUrl) : "";

  return {
    id: product.productId,
    name: product.name,
    description: product.description,
    price: product.price,
    imagePath,
    imageUrl: normalizedImagePath
      ? normalizedBaseUrl
        ? `${normalizedBaseUrl}/${normalizedImagePath}`
        : `/${normalizedImagePath}`
      : "",
    category: product.categoryName,
    categoryId: product.categoryId,
    brand: product.brandName,
    brandId: product.brandId,
    rating: product.rating,
  };
}

function mapPagedResponse(
  data: ProductApiPagedResponse,
  imageBaseUrl?: string,
): ProductPagedResponse {
  return {
    products: data.products.map((product) =>
      mapApiProduct(product, imageBaseUrl),
    ),
    page: data.page,
    pageSize: data.pageSize,
    totalRecords: data.totalRecords,
    totalPages: data.totalPages,
  };
}

async function fetchProductResponse(
  url: string,
  errorMessage: string,
  signal?: AbortSignal,
  cache: RequestCache = "no-store",
): Promise<Response> {
  const response = await fetch(url, { signal, cache });

  if (!response.ok) {
    throw new Error(`${errorMessage} (${response.status}).`);
  }

  return response;
}

function getQuerySuffix(params: ProductQueryParams): string {
  const queryString = buildQueryString(params);
  return queryString ? `?${queryString}` : "";
}

// Browser-side fetching through the Next.js API route.
export async function fetchProductsFromApi(
  params: ProductQueryParams = {},
  signal?: AbortSignal,
): Promise<ProductPagedResponse> {
  const response = await fetchProductResponse(
    `/api/products${getQuerySuffix(params)}`,
    "Failed to fetch products",
    signal,
  );

  const data: ProductApiPagedResponse = await response.json();

  return mapPagedResponse(data, process.env.NEXT_PUBLIC_API_BASE_URL);
}

// Server-side fetching directly from the .NET API.
export async function fetchProductsOnServer(
  params: ProductQueryParams = {},
): Promise<ProductPagedResponse> {
  const baseUrl = process.env.DOTNET_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("DOTNET_API_BASE_URL is not configured.");
  }

  const response = await fetchProductResponse(
    `${normalizeBaseUrl(baseUrl)}/api/v1/products/search${getQuerySuffix(params)}`,
    "Failed to fetch products",
    undefined,
    "force-cache",
  );

  const data: ProductApiPagedResponse = await response.json();

  return mapPagedResponse(data, baseUrl);
}

export async function fetchProductByIdOnServer(id: number): Promise<Product> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product ID.");
  }

  const baseUrl = process.env.DOTNET_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("DOTNET_API_BASE_URL is not configured.");
  }

  const response = await fetchProductResponse(
    `${normalizeBaseUrl(baseUrl)}/api/v1/products/${id}`,
    "Failed to fetch product details",
    undefined,
    "force-cache",
  );

  const product: ProductApiResponse = await response.json();

  return mapApiProduct(product, baseUrl);
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product ID.");
  }

  const response = await fetchProductResponse(
    `/api/products/${id}`,
    "Failed to fetch product details",
    signal,
  );

  const product: ProductApiResponse = await response.json();

  return mapApiProduct(product, process.env.NEXT_PUBLIC_API_BASE_URL);
}
