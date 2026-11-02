import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.number().int().positive("Invalid product."),
  quantity: z.number().int().positive("Quantity must be at least 1."),
});

export const updateCartQuantitySchema = z.object({
  productId: z.number().int().positive("Invalid product."),
  quantity: z.number().int().positive("Quantity must be at least 1."),
});

export const removeCartItemSchema = z.object({
  productId: z.number().int().positive("Invalid product."),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
