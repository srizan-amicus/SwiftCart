
"use server";

import { revalidatePath } from "next/cache";

import {
  addToCartSchema,
  updateCartQuantitySchema,
  removeCartItemSchema,
} from "@/lib/validations/cart-schema";

import {
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "@/services/cart-api";

export interface CartActionResult {
  success: boolean;
  message: string;
}

function getPositiveInteger(value: FormDataEntryValue | null): number {
  if (typeof value !== "string" || value.trim() === "") {
    return NaN;
  }

  return Number(value);
}

function revalidateCartPaths() {
  revalidatePath("/cart");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

async function performAddToCart(
  productId: number,
  quantity: number,
): Promise<CartActionResult> {
  const validation = addToCartSchema.safeParse({ productId, quantity });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message ?? "Invalid cart details.",
    };
  }

  try {
    await addCartItem(validation.data.productId, validation.data.quantity);
    revalidateCartPaths();

    return {
      success: true,
      message: "Item added to cart successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to add item to cart.",
    };
  }
}

async function performUpdateCartQuantity(
  productId: number,
  quantity: number,
): Promise<CartActionResult> {
  const validation = updateCartQuantitySchema.safeParse({
    productId,
    quantity,
  });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message ?? "Invalid cart details.",
    };
  }

  try {
    await updateCartItem(validation.data.productId, validation.data.quantity);
    revalidateCartPaths();

    return {
      success: true,
      message: "Cart quantity updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update cart quantity.",
    };
  }
}

async function performRemoveCartItem(
  productId: number,
): Promise<CartActionResult> {
  const validation = removeCartItemSchema.safeParse({ productId });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message ?? "Invalid product.",
    };
  }

  try {
    await removeCartItem(validation.data.productId);
    revalidateCartPaths();

    return {
      success: true,
      message: "Item removed from cart.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to remove item from cart.",
    };
  }
}

export async function addToCartFormAction(
  formData: FormData,
): Promise<CartActionResult> {
  return performAddToCart(
    getPositiveInteger(formData.get("productId")),
    getPositiveInteger(formData.get("quantity")),
  );
}

export async function updateCartQuantityFormAction(
  formData: FormData,
): Promise<CartActionResult> {
  return performUpdateCartQuantity(
    getPositiveInteger(formData.get("productId")),
    getPositiveInteger(formData.get("quantity")),
  );
}

export async function removeCartItemFormAction(
  formData: FormData,
): Promise<CartActionResult> {
  return performRemoveCartItem(
    getPositiveInteger(formData.get("productId")),
  );
}
