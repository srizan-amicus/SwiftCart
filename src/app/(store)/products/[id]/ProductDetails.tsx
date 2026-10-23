"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Breadcrumb from "@/components/common/Breadcrumb";
import Toast from "@/components/common/Toast";
import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useProductActions } from "@/hooks/useProductActions";
import ProductEditForm from "./ProductEditForm";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  productId: string;
  initialProduct: Product;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600";

export default function ProductDetails({
  productId,
  initialProduct,
}: ProductDetailsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUserRole() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          setIsAdmin(false);
          return;
        }

        const data: unknown = await response.json();

        if (
          typeof data === "object" &&
          data !== null &&
          "isAdmin" in data &&
          typeof data.isAdmin === "boolean"
        ) {
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setIsAdmin(false);
        console.error("Unable to load the current user's role.");
      }
    }

    void loadUserRole();

    return () => controller.abort();
  }, []);

  const { product, loading, error, updateProduct } = useProductDetails(
    productId,
    initialProduct,
  );

  const {
    isSaving,
    saveError,
    saveSuccess,
    saveProduct,
    deleteProduct,
    clearMessages,
  } = useProductActions({
    product,
    isAdmin,
    onUpdated: updateProduct,
  });

  function handleCancelEdit() {
    setIsEditing(false);
    clearMessages();
  }

  function handleAddToCart() {
    if (!product || isAdding || quantity < 1) {
      return;
    }

    setIsAdding(true);
    setIsAdded(false);

    // UI-only for now: no cart data is saved.
    setIsAdded(true);
    setToastMessage(`${product.name} added to cart!`);
    setIsAdding(false);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div
          className="animate-pulse space-y-4"
          aria-label="Loading product details"
        >
          <div className="h-6 w-40 rounded bg-gray-200" />

          <div className="grid gap-8 md:grid-cols-2">
            <div className="h-80 rounded-lg bg-gray-200" />

            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/3 rounded bg-gray-200" />
              <div className="h-20 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p role="alert" className="mb-4 text-red-600">
          {error ?? "Product not found."}
        </p>

        <Button href="/products" variant={ButtonVariant.Outline}>
          Back to Products
        </Button>
      </main>
    );
  }

  const rating = Math.min(5, Math.max(0, product.rating ?? 0));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      {saveSuccess && (
        <p role="status" className="mb-4 text-sm text-green-700">
          {saveSuccess}
        </p>
      )}

      {saveError && !isEditing && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {saveError}
        </p>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex min-h-80 items-center justify-center rounded-xl bg-white p-6">
          <Image
            src={product.imageUrl || FALLBACK_IMAGE}
            alt={product.name}
            width={600}
            height={600}
            unoptimized
            priority
            className="max-h-[450px] w-full object-contain"
          />
        </div>

        <section className="flex flex-col items-start">
          {isEditing && isAdmin ? (
            <ProductEditForm
              key={product.id}
              product={product}
              isSaving={isSaving}
              saveError={saveError}
              onSave={saveProduct}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              {product.category && (
                <p className="mb-2 text-sm text-gray-500">{product.category}</p>
              )}

              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <span
                  aria-label={`Rating ${rating.toFixed(1)} out of 5`}
                  className="text-lg tracking-wide text-yellow-500"
                >
                  {"★".repeat(Math.round(rating))}
                  {"☆".repeat(5 - Math.round(rating))}
                </span>

                <span className="text-sm text-gray-600">
                  {rating.toFixed(1)} / 5
                </span>
              </div>

              <p className="mt-6 text-2xl font-bold text-orange-600">
                ₹{product.price.toFixed(2)}
              </p>

              <div className="mt-6 w-full border-t border-gray-200 pt-6">
                <h2 className="mb-2 text-lg font-semibold">Description</h2>

                <p className="leading-7 text-gray-600">
                  {product.description || "No description available."}
                </p>
              </div>

              {product.brand && (
                <p className="mt-4 text-sm text-gray-600">
                  Brand: <span className="font-medium">{product.brand}</span>
                </p>
              )}

              {!isAdmin && (
                <>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="font-medium text-gray-700">Quantity</span>

                    <div className="flex items-center gap-3">
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

                      <span className="min-w-6 text-center" aria-live="polite">
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
                  </div>

                  <Button
                    variant={ButtonVariant.Primary}
                    className="mt-4"
                    onClick={handleAddToCart}
                    disabled={isAdding || quantity < 1}
                  >
                    {isAdding
                      ? "Adding..."
                      : isAdded
                        ? "✓ Added"
                        : "Add To Cart"}
                  </Button>
                </>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {isAdmin && (
                  <>
                    <Button
                      disabled={isSaving}
                      onClick={() => {
                        clearMessages();
                        setIsEditing(true);
                      }}
                      variant={ButtonVariant.Primary}
                    >
                      Edit Product
                    </Button>

                    <Button
                      disabled={isSaving}
                      onClick={deleteProduct}
                      variant={ButtonVariant.Danger}
                    >
                      {isSaving ? "Please wait..." : "Delete Product"}
                    </Button>
                  </>
                )}

                <Button href="/products" variant={ButtonVariant.Outline}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </section>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </main>
  );
}
