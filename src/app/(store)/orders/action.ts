"use server";

import { revalidatePath } from "next/cache";

import { getOrderById, reorderOrder } from "@/services/orders-api";

interface ReorderActionResult {
  success: boolean;
  message?: string;
}

export async function reorderOrderAction(
  orderId: number,
): Promise<ReorderActionResult> {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return {
      success: false,
      message: "Invalid order ID.",
    };
  }

  try {
    // Re-fetch the order so the status check uses current server data.
    const order = await getOrderById(orderId);

    if (order.orderId !== orderId) {
      return {
        success: false,
        message: "Order not found.",
      };
    }

    if (order.orderStatus.toLowerCase() !== "delivered") {
      return {
        success: false,
        message: "Only delivered orders can be reordered.",
      };
    }

    await reorderOrder(orderId);

    revalidatePath("/cart");
    revalidatePath("/orders");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to reorder this order. Please try again.",
    };
  }
}