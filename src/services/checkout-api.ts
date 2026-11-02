import "server-only";

import { cookies } from "next/headers";

import type { ShippingMethod } from "@/types/checkout";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

export interface CreateCheckoutRequest {
  addressId: number;
  shippingMethod: ShippingMethod;
  paymentMethod: "Mock";
}

export interface PriceChange {
  productId: number;
  productName: string;
  oldPrice: number;
  currentPrice: number;
}

export interface StockIssue {
  productId: number;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}

export interface CheckoutResponse {
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  priceChanges: PriceChange[];
  stockIssues: StockIssue[];
  orderId: number | null;
}

export async function createCheckout(
  request: CreateCheckoutRequest,
): Promise<CheckoutResponse> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Please sign in to continue.");
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Unable to create checkout.";

    try {
      const errorData = (await response.json()) as { message?: string };
      message = errorData.message || message;
    } catch {
      // Keep the default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as CheckoutResponse;
}
