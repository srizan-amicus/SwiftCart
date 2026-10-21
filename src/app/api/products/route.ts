import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

const ALLOWED_SORT_FIELDS = ["name", "price", "rating"];
const ALLOWED_SORT_ORDERS = ["asc", "desc"];

interface CreateProductRequest {
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  rating?: number;
  imagePath?: string | null;
  price: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateQueryParams(searchParams: URLSearchParams): string | null {
  const positiveIntegerParams = ["Page", "PageSize"];
  const nonNegativeNumberParams = ["MinPrice", "MaxPrice", "MinRating"];

  for (const param of positiveIntegerParams) {
    const value = searchParams.get(param);

    if (value !== null) {
      const number = Number(value);

      if (!Number.isInteger(number) || number < 1) {
        return `${param} must be a positive integer.`;
      }
    }
  }

  for (const param of nonNegativeNumberParams) {
    const value = searchParams.get(param);

    if (value !== null) {
      const number = Number(value);

      if (!Number.isFinite(number) || number < 0) {
        return `${param} must be a non-negative number.`;
      }
    }
  }

  const minPrice = searchParams.get("MinPrice");
  const maxPrice = searchParams.get("MaxPrice");

  if (
    minPrice !== null &&
    maxPrice !== null &&
    Number(minPrice) > Number(maxPrice)
  ) {
    return "MinPrice cannot be greater than MaxPrice.";
  }

  const minRating = searchParams.get("MinRating");

  if (minRating !== null && Number(minRating) > 5) {
    return "MinRating must be between 0 and 5.";
  }

  const sortBy = searchParams.get("SortBy");

  if (sortBy !== null && !ALLOWED_SORT_FIELDS.includes(sortBy.toLowerCase())) {
    return `SortBy must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}.`;
  }

  const sortOrder = searchParams.get("SortOrder");

  if (
    sortOrder !== null &&
    !ALLOWED_SORT_ORDERS.includes(sortOrder.toLowerCase())
  ) {
    return "SortOrder must be 'asc' or 'desc'.";
  }

  return null;
}

function validateCreateProduct(body: unknown): {
  data?: CreateProductRequest;
  error?: string;
} {
  if (!isRecord(body)) {
    return { error: "Request body must be a JSON object." };
  }

  const { name, description, categoryId, brandId, rating, imagePath, price } =
    body;

  if (typeof name !== "string" || !name.trim() || name.trim().length > 150) {
    return { error: "Name is required and must not exceed 150 characters." };
  }

  if (
    description !== undefined &&
    description !== null &&
    (typeof description !== "string" || description.length > 500)
  ) {
    return { error: "Description must not exceed 500 characters." };
  }

  if (!Number.isInteger(categoryId) || Number(categoryId) < 1) {
    return { error: "CategoryId must be a positive integer." };
  }

  if (!Number.isInteger(brandId) || Number(brandId) < 1) {
    return { error: "BrandId must be a positive integer." };
  }

  if (
    rating !== undefined &&
    (typeof rating !== "number" ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5)
  ) {
    return { error: "Rating must be a number between 0 and 5." };
  }

  if (
    imagePath !== undefined &&
    imagePath !== null &&
    typeof imagePath !== "string"
  ) {
    return { error: "ImagePath must be a string or null." };
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return { error: "Price must be a number greater than zero." };
  }

  return {
    data: {
      name: name.trim(),
      description: description as string | undefined,
      categoryId: Number(categoryId),
      brandId: Number(brandId),
      rating: rating === undefined ? 0 : Number(rating),
      imagePath: imagePath as string | null | undefined,
      price,
    },
  };
}

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured." },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const validationError = validateQueryParams(searchParams);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const queryString = searchParams.toString();
    const querySuffix = queryString ? `?${queryString}` : "";

    const response = await fetch(
      `${API_BASE_URL}/api/v1/products/search${querySuffix}`,
      {
        cache: "no-store",
        signal: request.signal,
      },
    );

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            response.status === 404
              ? "Products endpoint not found."
              : "Failed to fetch products from the backend.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the backend API." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must contain valid JSON." },
      { status: 400 },
    );
  }

  const validation = validateCreateProduct(body);

  if (!validation.data) {
    return NextResponse.json(
      { message: validation.error ?? "Invalid product data." },
      { status: 400 },
    );
  }

  const product = validation.data;

  try {
    // 1. Create the product in the .NET API.
    const productResponse = await fetchBackend(request, "/api/v1/Products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: product.name,
        Description: product.description ?? null,
        CategoryId: product.categoryId,
        BrandId: product.brandId,
        Rating: product.rating ?? 0,
        ImagePath: product.imagePath ?? null,
      }),
    });

    const productResponseBody: unknown = await productResponse
      .json()
      .catch(() => null);

    if (!productResponse.ok) {
      return NextResponse.json(
        {
          message:
            productResponse.status === 401
              ? "Please log in again."
              : productResponse.status === 403
                ? "You are not authorized to create products."
                : "Failed to create the product.",
          details: productResponseBody,
        },
        { status: productResponse.status },
      );
    }

    if (
      !isRecord(productResponseBody) ||
      !(
        "ProductId" in productResponseBody || "productId" in productResponseBody
      )
    ) {
      return NextResponse.json(
        {
          message:
            "The product may have been created, but the backend did not return its ID.",
        },
        { status: 502 },
      );
    }

    const productId =
      productResponseBody.ProductId ?? productResponseBody.productId;

    if (typeof productId !== "number" || !Number.isInteger(productId)) {
      return NextResponse.json(
        {
          message:
            "The product may have been created, but the backend returned an invalid product ID.",
        },
        { status: 502 },
      );
    }

    // 2. Create the initial price using the returned product ID.
    const priceResponse = await fetchBackend(request, "/api/ProductPrices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        price: product.price,
      }),
    });

    const priceResponseBody: unknown = await priceResponse
      .json()
      .catch(() => null);

    if (!priceResponse.ok) {
      return NextResponse.json(
        {
          message:
            "The product was created, but its price could not be saved. Please resolve the price issue before retrying product creation.",
          productId,
          priceStatus: priceResponse.status,
          details: priceResponseBody,
        },
        { status: 502 },
      );
    }

    // 3. Return the created product in the frontend's expected shape.
    return NextResponse.json(
      {
        id: productId,
        name: product.name,
        description: product.description ?? "",
        categoryId: product.categoryId,
        brandId: product.brandId,
        rating: product.rating ?? 0,
        imageUrl: product.imagePath ?? "",
        price: product.price,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the backend API." },
      { status: 502 },
    );
  }
}
