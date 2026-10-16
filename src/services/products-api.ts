import type { Product } from "@/types/product";

export interface ProductQueryParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: string;
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
  imagePath?: string;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

function buildQueryString(params: ProductQueryParams): string {
  const query = new URLSearchParams();

  const keyMap: Record<string, string> = {
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

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    query.set(keyMap[key] ?? key, String(value));
  }

  return query.toString();
}

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("API URL is not configured. Check your .env.local file.");
  }

  return API_BASE_URL;
}

function mapApiProduct(product: ProductApiResponse): Product {
  const imagePath = product.imagePath?.trim();

  return {
    id: product.productId,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: imagePath
      ? `${getApiBaseUrl()}/${imagePath.replace(/^\/+/, "")}`
      : "",
    category: product.categoryName,
    categoryId: product.categoryId,
    brand: product.brandName,
    brandId: product.brandId,
    rating: product.rating,
  };
}

export async function fetchProductsFromApi(
  params: ProductQueryParams = {},
  signal?: AbortSignal,
): Promise<ProductPagedResponse> {
  const queryString = buildQueryString(params);
  const querySuffix = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/products/search${querySuffix}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status}).`);
  }

  const data: ProductApiPagedResponse = await response.json();

  return {
    products: data.products.map(mapApiProduct),
    page: data.page,
    pageSize: data.pageSize,
    totalRecords: data.totalRecords,
    totalPages: data.totalPages,
  };
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/Products/${id}`, {
    signal,
  });

  if (response.status === 404) {
    throw new Error("Product not found.");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product details (${response.status}).`);
  }

  const product: ProductApiResponse = await response.json();

  return mapApiProduct(product);
}
