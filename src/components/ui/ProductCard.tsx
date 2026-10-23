"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Toast from "@/components/common/Toast";
import { ButtonVariant } from "@/constants/button-variants";
import {
  ProductCardVariant,
  type ProductCardVariant as ProductCardVariantType,
} from "@/constants/product-variants";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariantType;
  onAddToCart?: (
    productId: number,
    quantity: number,
  ) => Promise<{ success: boolean }>;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600";

export default function ProductCard({
  product,
  variant = ProductCardVariant.Default,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isListing = variant === ProductCardVariant.Listing;

  const total = product.price * quantity;

  async function handleAddToCart() {
    if (isAdding || quantity < 1) return;

    setIsAdding(true);
    setIsAdded(false);

    try {
      // Call the cart handler when one is provided.
      if (onAddToCart) {
        const result = await onAddToCart(product.id, quantity);

        if (!result.success) {
          setToastMessage("Unable to add item to cart.");
          return;
        }
      }

      setIsAdded(true);
      setToastMessage(`${product.name} added to cart!`);
    } catch {
      setToastMessage("Unable to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article
      className={
        isListing
          ? "flex h-full flex-col border border-gray-300 bg-white p-2"
          : "flex h-full flex-col rounded-lg border border-gray-200 bg-white p-3"
      }
    >
      <div
        className={
          isListing
            ? "relative flex h-40 items-center justify-center overflow-hidden rounded-md bg-gray-50 p-3"
            : "relative flex h-48 items-center justify-center overflow-hidden bg-white"
        }
      >
        <Link
          href={`/products/${product.id}`}
          aria-label={`View ${product.name} details`}
          className="flex h-full w-full items-center justify-center"
        >
          <Image
            src={product.imageUrl || FALLBACK_IMAGE}
            alt={product.name}
            width={400}
            height={400}
            unoptimized
            className="h-full w-full object-contain"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-2">
        <h2
          className={
            isListing
              ? "flex min-h-12 items-start justify-center text-center font-semibold leading-6 text-gray-800"
              : "text-center font-semibold text-gray-800"
          }
        >
          <Link
            href={`/products/${product.id}`}
            className="transition-colors hover:text-orange-600"
          >
            {product.name}
          </Link>
        </h2>

        {isListing && (
          <p className="mt-2 text-center text-sm font-bold text-orange-600">
            ₹{product.price.toFixed(2)}
          </p>
        )}

        <div className="flex items-center justify-center gap-1">
          <span
            className="text-sm tracking-wide text-yellow-500"
            aria-label={`Rating ${product.rating ?? 0} out of 5`}
          >
            {"★".repeat(
              Math.min(5, Math.max(0, Math.round(product.rating ?? 0))),
            )}
            {"☆".repeat(
              5 - Math.min(5, Math.max(0, Math.round(product.rating ?? 0))),
            )}
          </span>

          <span className="text-xs font-semibold text-gray-600">
            {(product.rating ?? 0).toFixed(1)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          <Button
            variant={ButtonVariant.QuantityAction}
            ariaLabel="Decrease quantity"
            disabled={quantity <= 1 || isAdding}
            onClick={() =>
              setQuantity((current) => Math.max(1, current - 1))
            }
          >
            −
          </Button>

          <span className="min-w-6 text-center text-sm" aria-live="polite">
            {quantity}
          </span>

          <Button
            variant={ButtonVariant.QuantityAction}
            ariaLabel="Increase quantity"
            disabled={isAdding}
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </Button>
        </div>

        <p className="mt-2 text-center text-sm font-bold">
          Total: ₹{total.toFixed(2)}
        </p>

        <Button
          variant={ButtonVariant.Primary}
          className="!mt-2 !h-10 !w-full !min-w-0 px-2 text-sm"
          onClick={handleAddToCart}
          disabled={isAdding || quantity < 1}
        >
          {isAdding ? "Adding..." : isAdded ? "✓ Added" : "Add To Cart"}
        </Button>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </article>
  );
}