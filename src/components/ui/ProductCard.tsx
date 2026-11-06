"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import CartSubmitButton from "@/components/cart/CartSubmitButton";
import Toast from "@/components/common/Toast";
import { ButtonVariant } from "@/constants/button-variants";
import {
  ProductCardVariant,
  type ProductCardVariant as ProductCardVariantType,
} from "@/constants/product-variants";
import { addToCartFormAction } from "@/app/(store)/cart/action";
import type { CartActionResult } from "@/app/(store)/cart/action";
import type { Product } from "@/types/product";

import { IMAGE_BLUR_DATA_URL } from "@/constants/image";

interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariantType;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600";

const INITIAL_ACTION_STATE: CartActionResult = {
  success: false,
  message: "",
};

export default function ProductCard({
  product,
  variant = ProductCardVariant.Default,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [toastDismissed, setToastDismissed] = useState(false);

  const [actionState, formAction] = useActionState(
    async (_previousState: CartActionResult, formData: FormData) => {
      return addToCartFormAction(formData);
    },
    INITIAL_ACTION_STATE,
  );

  const isListing = variant === ProductCardVariant.Listing;
  const total = product.price * quantity;
  const isAdded = actionState.success;

  const toastMessage = toastDismissed
    ? ""
    : actionState.message
      ? actionState.success
        ? `${product.name} added to cart!`
        : actionState.message
      : "";

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
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
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
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            −
          </Button>

          <span className="min-w-6 text-center text-sm" aria-live="polite">
            {quantity}
          </span>

          <Button
            variant={ButtonVariant.QuantityAction}
            ariaLabel="Increase quantity"
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </Button>
        </div>

        <p className="mt-2 text-center text-sm font-bold">
          Total: ₹{total.toFixed(2)}
        </p>

        <form
          action={(formData) => {
            setToastDismissed(false);
            formAction(formData);
          }}
        >
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value={quantity} />

          <CartSubmitButton
            pendingText="Adding..."
            className="!mt-2 !h-10 !w-full !min-w-0 px-2 text-sm"
          >
            {isAdded ? "✓ Added" : "Add To Cart"}
          </CartSubmitButton>
        </form>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastDismissed(true)}
          variant={actionState.success ? "success" : "error"}
        />
      )}
    </article>
  );
}
