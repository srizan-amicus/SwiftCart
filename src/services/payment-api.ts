import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

export interface CreatePaymentRequest {
  orderId: number;
  paymentMethod: "Mock";
}

export interface PaymentResponse {
  orderId: number;
  paymentStatus: string;
  transactionReference: string;
  amount: number;
}

export async function createPayment(
  request: CreatePaymentRequest,
): Promise<PaymentResponse> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Please sign in to continue.");
  }

  const response = await fetch(`${API_BASE_URL}/api/payments/mock`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Payment failed. Please try again.";

    try {
      const errorData = (await response.json()) as { message?: string };
      message = errorData.message || message;
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return (await response.json()) as PaymentResponse;
}
