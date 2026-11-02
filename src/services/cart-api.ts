import "server-only";

import { cookies } from "next/headers";

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

interface CartApiError {
  message: string;
}

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Please sign in to access your cart.");
  }

  return accessToken;
}

async function cartRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/cart${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body && { "Content-Type": "application/json" }),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Unable to process your cart request.";

    try {
      const errorData = (await response.json()) as CartApiError;
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Keep the default message if the response has no JSON body.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getCart(): Promise<CartItem[]> {
  return cartRequest<CartItem[]>("");
}

export async function addCartItem(
  productId: number,
  quantity: number,
): Promise<void> {
  await cartRequest<void>("/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(
  productId: number,
  quantity: number,
): Promise<void> {
  await cartRequest<void>(`/items/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(productId: number): Promise<void> {
  await cartRequest<void>(`/items/${productId}`, {
    method: "DELETE",
  });
}

export async function getCartItemCount(): Promise<number> {
  const response = await cartRequest<{ itemCount: number }>("/count");
  return response.itemCount;
}
