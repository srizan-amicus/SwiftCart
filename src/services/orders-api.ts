
import "server-only";

import { cookies } from "next/headers";

import type { OrderDetails } from "@/types/order";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

export async function getOrderById(
  orderId: number,
): Promise<OrderDetails> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Please sign in to continue.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/orders/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    if (response.status === 403 || response.status === 404) {
      throw new Error("Order not found or you are not authorized to access it.");
    }

    throw new Error("Unable to retrieve order details.");
  }

  return (await response.json()) as OrderDetails;
}
