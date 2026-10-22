
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProductById } from "@/services/products-api";
import type { Product } from "@/types/product";

export function useProductDetails(productId: string,
   initialProduct?: Product,
) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //wrapping the fetching logic in usecallback to avoid unnec rerender
  const loadProduct = useCallback(
    async (signal?: AbortSignal) => {
      const id = Number(productId);

      if (!Number.isInteger(id) || id <= 0) {
        await Promise.resolve();

        if (signal?.aborted) return;

        setProduct(null);
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const result = await fetchProductById(id, signal);

        if (signal?.aborted) return;

        setProduct(result);
        setError(null);
      } catch (err) {
        if (signal?.aborted) return;

        setProduct(null);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product details.",                
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [productId],
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        return loadProduct(controller.signal);  
      }
    });

    return () => controller.abort();
  }, [loadProduct]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProduct(updatedProduct);
    setError(null);
  }, []);

  return {
    product,
    loading,
    error,
    updateProduct,
  };
}
