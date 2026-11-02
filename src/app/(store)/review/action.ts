
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { getOrderById } from "@/services/orders-api";
import { createPayment } from "@/services/payment-api";
import { getCart, removeCartItem } from "@/services/cart-api";

const PENDING_ORDER_COOKIE = "pendingOrderId";
const PENDING_ADDRESS_COOKIE = "pendingAddressId";
const SELECTED_PAYMENT_COOKIE = "selectedPaymentMethod";

export async function confirmOrder(): Promise<number> {
  const cookieStore = await cookies();

  const pendingOrderId = Number(
    cookieStore.get(PENDING_ORDER_COOKIE)?.value,
  );

  if (!Number.isInteger(pendingOrderId) || pendingOrderId <= 0) {
    throw new Error("Your checkout session has expired. Please try again.");
  }

  // Verify that the order belongs to the authenticated customer.
  const order = await getOrderById(pendingOrderId);

  // Avoid processing payment again for an already-paid order.
  if (order.payment?.paymentStatus === "Success") {
    clearPendingCheckoutCookies(cookieStore);
    return pendingOrderId;
  }

  // Process payment.
  const payment = await createPayment({
    orderId: pendingOrderId,
    paymentMethod: "Mock",
  });

  if (payment.paymentStatus !== "Success") {
    throw new Error("Payment could not be completed. Please try again.");
  }

  // Payment succeeded. Now remove all purchased items from the cart.
  try {
    const cartItems = await getCart();

    for (const item of cartItems) {
      await removeCartItem(item.productId);
    }
  } catch (error) {
    // Do not report the order as failed after payment has succeeded.
    console.error("Order placed, but cart cleanup failed:", error);
  }

  // Clear temporary checkout cookies.
  clearPendingCheckoutCookies(cookieStore);

  // Refresh cached cart and order-related pages.
  revalidatePath("/cart");
  revalidatePath("/order");
  revalidatePath("/");

  return payment.orderId;
}

function clearPendingCheckoutCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  cookieStore.set(PENDING_ORDER_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });

  cookieStore.set(PENDING_ADDRESS_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });

  cookieStore.set(SELECTED_PAYMENT_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
}
