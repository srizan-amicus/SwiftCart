
"use server";

import { cookies } from "next/headers";

import { createAddress } from "@/services/addresses-api";
import type { CheckoutFormData } from "@/types/checkout";

interface ContinueCheckoutInput {
  addressId: number | null;
  formData: CheckoutFormData;
}

const PENDING_ADDRESS_COOKIE = "pendingAddressId";
const PENDING_ORDER_COOKIE = "pendingOrderId";

export async function continueCheckout({
  addressId,
  formData,
}: ContinueCheckoutInput): Promise<number> {
  let resolvedAddressId = addressId;

  // Create a new address only when necessary.
  if (resolvedAddressId === null) {
    const address = await createAddress({
      addressId: 0,
      addressLine1: formData.streetAddress,
      addressLine2: formData.apartment,
      city: formData.city,
      state: formData.state,
      postalCode: formData.zip,
      country: formData.country,
      isDefault: false,
    });

    resolvedAddressId = address.addressId;
  }

  if (!Number.isInteger(resolvedAddressId) || resolvedAddressId <= 0) {
    throw new Error("Unable to save the delivery address.");
  }

  const cookieStore = await cookies();

  // Save the selected address for the next checkout step.
  cookieStore.set(PENDING_ADDRESS_COOKIE, String(resolvedAddressId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60,
  });

  // Remove any previous pending order.
  cookieStore.set(PENDING_ORDER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return resolvedAddressId;
}
