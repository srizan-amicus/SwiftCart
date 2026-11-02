import "server-only";

import { cookies } from "next/headers";

import type { Address, CreateAddressRequest } from "@/types/checkout";

interface AddressApiError {
  message?: string;
}

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Please sign in to manage your addresses.");
  }

  return accessToken;
}

async function addressRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/addresses${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body && { "Content-Type": "application/json" }),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Unable to process your address request.";

    try {
      const errorData = (await response.json()) as AddressApiError;
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

export async function getAddresses(): Promise<Address[]> {
  return addressRequest<Address[]>("");
}

export async function createAddress(
  address: Omit<CreateAddressRequest, "customerId">,
): Promise<{ addressId: number; message: string }> {
  const requestBody: CreateAddressRequest = {
    ...address,
    customerId: 0,
  };

  return addressRequest<{ addressId: number; message: string }>("", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}
