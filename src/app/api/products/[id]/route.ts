import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isValidProductId(id: string): boolean {
  return /^[1-9]\d*$/.test(id);
}

function getProductIdError(id: string): NextResponse | null {
  if (!isValidProductId(id)) {
    return NextResponse.json(
      { message: "Invalid product ID." },
      { status: 400 },
    );
  }

  return null;
}

async function handleBackendResponse(
  response: Response,
  failureMessage: string,
): Promise<NextResponse> {
  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        message:
          response.status === 401
            ? "Please log in again."
            : response.status === 403
              ? "You are not authorized to perform this action."
              : response.status === 404
                ? "Product not found."
                : failureMessage,
        details: data,
      },
      { status: response.status },
    );
  }

  return NextResponse.json(data, { status: response.status });
}

// GET /api/products/:id
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idError = getProductIdError(id);

  if (idError) return idError;

  const response = await fetchBackend(request, `/api/v1/Products/${id}`);

  return handleBackendResponse(response, "Failed to fetch product details.");
}

// PUT /api/products/:id
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idError = getProductIdError(id);

  if (idError) return idError;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must contain valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const product = body as Record<string, unknown>;

  if (
    typeof product.name !== "string" ||
    !product.name.trim() ||
    product.name.trim().length > 150
  ) {
    return NextResponse.json(
      { message: "Name is required and must not exceed 150 characters." },
      { status: 400 },
    );
  }

  if (
    typeof product.categoryId !== "number" ||
    !Number.isInteger(product.categoryId) ||
    product.categoryId < 1 ||
    typeof product.brandId !== "number" ||
    !Number.isInteger(product.brandId) ||
    product.brandId < 1
  ) {
    return NextResponse.json(
      { message: "Valid categoryId and brandId are required." },
      { status: 400 },
    );
  }

  if (
    product.rating !== undefined &&
    (typeof product.rating !== "number" ||
      !Number.isFinite(product.rating) ||
      product.rating < 0 ||
      product.rating > 5)
  ) {
    return NextResponse.json(
      { message: "Rating must be between 0 and 5." },
      { status: 400 },
    );
  }

  if (
    product.description !== undefined &&
    product.description !== null &&
    (typeof product.description !== "string" ||
      product.description.length > 500)
  ) {
    return NextResponse.json(
      { message: "Description must not exceed 500 characters." },
      { status: 400 },
    );
  }

  if (
    product.imagePath !== undefined &&
    product.imagePath !== null &&
    typeof product.imagePath !== "string"
  ) {
    return NextResponse.json(
      { message: "ImagePath must be a string or null." },
      { status: 400 },
    );
  }

  try {
    const response = await fetchBackend(request, `/api/v1/Products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProductId: Number(id),
        Name: product.name.trim(),
        Description: product.description ?? null,
        CategoryId: product.categoryId,
        BrandId: product.brandId,
        Rating: product.rating ?? 0,
        ImagePath: product.imagePath ?? null,
      }),
    });

    return handleBackendResponse(response, "Failed to update product.");
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the backend API." },
      { status: 502 },
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idError = getProductIdError(id);

  if (idError) return idError;

  try {
    const response = await fetchBackend(request, `/api/v1/Products/${id}`, {
      method: "DELETE",
    });

    return handleBackendResponse(response, "Failed to delete product.");
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the backend API." },
      { status: 502 },
    );
  }
}
