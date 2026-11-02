
"use server";

import { cookies } from "next/headers";

import { createCheckout } from "@/services/checkout-api";
import type { CheckoutResponse } from "@/services/checkout-api";
import type { DisplayPaymentMethod } from "@/types/payment";
import type { ShippingMethod } from "@/types/checkout";

interface ContinueToReviewInput {
  shippingMethod: ShippingMethod;
  displayPaymentMethod: DisplayPaymentMethod;
}

const PENDING_ADDRESS_COOKIE = "pendingAddressId";
const PENDING_ORDER_COOKIE = "pendingOrderId";
const SELECTED_PAYMENT_COOKIE = "selectedPaymentMethod";

const validShippingMethods: ShippingMethod[] = [
  "Standard",
  "Express",
  "Same Day",
];

const validPaymentMethods: DisplayPaymentMethod[] = [
  "Card",
  "UPI",
  "Cash on Delivery",
];

export async function continueToReview({
  shippingMethod,
  displayPaymentMethod,
}: ContinueToReviewInput): Promise<CheckoutResponse> {
  if (!validShippingMethods.includes(shippingMethod)) {
    throw new Error("Please select a valid shipping method.");
  }

  if (!validPaymentMethods.includes(displayPaymentMethod)) {
    throw new Error("Please select a valid payment method.");
  }

  const cookieStore = await cookies();

  const addressIdValue = cookieStore.get(PENDING_ADDRESS_COOKIE)?.value;
  const addressId = Number(addressIdValue);

  if (!Number.isInteger(addressId) || addressId <= 0) {
    throw new Error("Your delivery address is missing. Please try again.");
  }

  // Create the order using the selected shipping method.
  // The backend currently supports only Mock payment.
  const checkout = await createCheckout({
    addressId,
    shippingMethod,
    paymentMethod: "Mock",
  });

  // Do not proceed if the backend reports price or stock issues.
  if (
    checkout.priceChanges.length > 0 ||
    checkout.stockIssues.length > 0
  ) {
    return checkout;
  }

  if (checkout.orderId === null) {
    throw new Error("Unable to create your order. Please try again.");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 30 * 60,
  };

  // Save the order and UI payment selection for the review page.
  cookieStore.set(
    PENDING_ORDER_COOKIE,
    String(checkout.orderId),
    cookieOptions,
  );

  cookieStore.set(
    SELECTED_PAYMENT_COOKIE,
    displayPaymentMethod,
    cookieOptions,
  );

  return checkout;
}
