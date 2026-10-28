import "server-only";

import { cookies } from "next/headers";
import { simulateDelay } from "@/lib/server/simulate-delay";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

export interface CustomerAddress {
  addressId: number;
  customerId: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

export interface OrderSummary {
  orderId: number;
  customerId: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export interface OrderHistoryResponse {
  orders: OrderSummary[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

async function fetchAuthenticated<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Authentication is required.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
  throw new Error(
    `Backend request failed: ${response.status} ${response.statusText} for ${path}.`,
  );
}

  return response.json() as Promise<T>;
}

export async function getAddresses(): Promise<CustomerAddress[]> {
  await simulateDelay(1200);
  const data = await fetchAuthenticated<CustomerAddress | CustomerAddress[]>(
    "/api/v1/addresses",
  );

  // Support either a single address or an address array.
  return Array.isArray(data) ? data : [data];
}

export async function getCart(): Promise<CartItem[]> {
  await simulateDelay(1200);
  return fetchAuthenticated<CartItem[]>("/api/v1/cart");
}

export async function getOrderHistory(
  page = 1,
  pageSize = 10,
): Promise<OrderHistoryResponse> {
  await simulateDelay(1200);
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return fetchAuthenticated<OrderHistoryResponse>(
    `/api/v1/orders/history?${params.toString()}`,
  );
}
