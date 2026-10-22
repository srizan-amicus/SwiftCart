
"use client";

import { useState } from "react";
import { fetchProductById } from "@/services/products-api";
import type { Product } from "@/types/product";

interface ProductUpdateData {
  name: string;
  description: string | null;
  categoryId: number;
  brandId: number;
  rating: number;
}

interface UseProductActionsProps {
  product: Product | null;
  isAdmin: boolean;
  onUpdated: (product: Product) => void;
}

export function useProductActions({
  product,
  isAdmin,
  onUpdated,
}: UseProductActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  function clearMessages() {
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function saveProduct(data: ProductUpdateData) {
    if (!isAdmin || !product || isSaving) return;

    try {
      setIsSaving(true);
      clearMessages();

      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imagePath: product.imagePath || null,
        }),
      });

      if (!response.ok) {
        const result: { message?: string } = await response
          .json()
          .catch(() => ({ message: undefined }));

        throw new Error(
          result.message ??
            `Failed to update product (${response.status}).`,
        );
      }

      const updatedProduct = await fetchProductById(product.id);

      onUpdated(updatedProduct);
      setSaveSuccess("Product updated successfully.");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Unable to update product.",
      );
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProduct() {
    if (!isAdmin || !product || isSaving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setIsSaving(true);
      clearMessages();

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result: { message?: string } = await response
          .json()
          .catch(() => ({ message: undefined }));

        throw new Error(
          result.message ??
            `Failed to delete product (${response.status}).`,
        );
      }

      window.location.assign("/products");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Unable to delete product.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveError,
    saveSuccess,
    saveProduct,
    deleteProduct,
    clearMessages,
  };
}
