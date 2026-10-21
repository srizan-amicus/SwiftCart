
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";
import { fetchProductById } from "@/services/products-api";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  productId: string;
  isAdmin?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  rating: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600";

function getFormData(product: Product): ProductFormData {
  return {
    name: product.name,
    description: product.description ?? "",
    categoryId: String(product.categoryId ?? ""),
    brandId: String(product.brandId ?? ""),
    rating: String(product.rating ?? 0),
  };
}

export default function ProductDetails({
  productId,
  isAdmin=false,
}: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    rating: "0",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadProduct = useCallback(
    async (signal?: AbortSignal) => {
      const id = Number(productId);

      if (!Number.isInteger(id) || id <= 0) {
        await Promise.resolve();

        if (signal?.aborted) return;

        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const result = await fetchProductById(id, signal);

        if (signal?.aborted) return;

        setError(null);
        setProduct(result);
        setFormData(getFormData(result));
      } catch (err) {
        if (signal?.aborted) return;

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

  function handleFieldChange(field: keyof ProductFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setSaveError(null);
    setSaveSuccess(null);
  }

  function handleCancelEdit() {
    if (product) {
      setFormData(getFormData(product));
    }

    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin || !product || isSaving) return;

    const name = formData.name.trim();
    const categoryId = Number(formData.categoryId);
    const brandId = Number(formData.brandId);
    const rating = Number(formData.rating);
    const description = formData.description.trim();

    if (!name || name.length > 150) {
      setSaveError("Name is required and must not exceed 150 characters.");
      return;
    }

    if (
      !Number.isInteger(categoryId) ||
      categoryId < 1 ||
      !Number.isInteger(brandId) ||
      brandId < 1
    ) {
      setSaveError("Enter valid positive category and brand IDs.");
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setSaveError("Rating must be between 0 and 5.");
      return;
    }

    if (description.length > 500) {
      setSaveError("Description must not exceed 500 characters.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || null,
          categoryId,
          brandId,
          rating,
          imagePath: product.imagePath || null,
        }),
      });

      if (!response.ok) {
        const result: { message?: string } = await response
          .json()
          .catch(() => ({ message: undefined }));

        throw new Error(
          result.message ?? `Failed to update product (${response.status}).`,
        );
      }

      const updatedProduct = await fetchProductById(product.id);

      setProduct(updatedProduct);
      setFormData(getFormData(updatedProduct));
      setIsEditing(false);
      setSaveSuccess("Product updated successfully.");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Unable to update product.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!isAdmin || !product || isSaving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result: { message?: string } = await response
          .json()
          .catch(() => ({ message: undefined }));

        throw new Error(
          result.message ?? `Failed to delete product (${response.status}).`,
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
            <form onSubmit={handleSave} className="w-full space-y-5">
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Product
              </h1>

              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="product-name"
                  value={formData.name}
                  onChange={(event) =>
                    handleFieldChange("name", event.target.value)
                  }
                  maxLength={150}
                  required
                  disabled={isSaving}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="product-description"
                  value={formData.description}
                  onChange={(event) =>
                    handleFieldChange("description", event.target.value)
                  }
                  maxLength={500}
                  rows={4}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Category ID
                  </label>
                  <input
                    id="product-category"
                    type="number"
                    min={1}
                    step={1}
                    value={formData.categoryId}
                    onChange={(event) =>
                      handleFieldChange("categoryId", event.target.value)
                    }
                    required
                    disabled={isSaving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-brand"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Brand ID
                  </label>
                  <input
                    id="product-brand"
                    type="number"
                    min={1}
                    step={1}
                    value={formData.brandId}
                    onChange={(event) =>
                      handleFieldChange("brandId", event.target.value)
                    }
                    required
                    disabled={isSaving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-rating"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Rating (0–5)
                </label>
                <input
                  id="product-rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={formData.rating}
                  onChange={(event) =>
                    handleFieldChange("rating", event.target.value)
                  }
                  required
                  disabled={isSaving}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <p className="text-sm text-gray-500">
                Price: ₹{product.price.toFixed(2)} (not editable here)
              </p>

              {saveError && (
                <p role="alert" className="text-sm text-red-600">
                  {saveError}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant={ButtonVariant.Primary}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  variant={ButtonVariant.Outline}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              {product.category && (
                <p className="mb-2 text-sm text-gray-500">
                  {product.category}
                </p>
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

              <div className="mt-8 flex flex-wrap gap-3">
                {isAdmin && (
                  <>
                    <Button
                      disabled={isSaving}
                      onClick={() => {
                        setFormData(getFormData(product));
                        setSaveError(null);
                        setSaveSuccess(null);
                        setIsEditing(true);
                      }}
                      variant={ButtonVariant.Primary}
                    >
                      Edit Product
                    </Button>

                    <Button
                      disabled={isSaving}
                      onClick={handleDelete}
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
    </main>
  );
}
