
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";
import type { Product } from "@/types/product";

interface ProductEditFormProps {
  product: Product;
  isSaving: boolean;
  saveError: string | null;
  onSave: (data: {
    name: string;
    description: string | null;
    categoryId: number;
    brandId: number;
    rating: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductEditForm({
  product,
  isSaving,
  saveError,
  onSave,
  onCancel,
}: ProductEditFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(
    product.description ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    String(product.categoryId ?? ""),
  );
  const [brandId, setBrandId] = useState(
    String(product.brandId ?? ""),
  );
  const [rating, setRating] = useState(
    String(product.rating ?? 0),
  );
  const [validationError, setValidationError] = useState<string | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedCategoryId = Number(categoryId);
    const parsedBrandId = Number(brandId);
    const parsedRating = Number(rating);

    if (!trimmedName || trimmedName.length > 150) {
      setValidationError(
        "Name is required and must not exceed 150 characters.",
      );
      return;
    }

    if (
      !Number.isInteger(parsedCategoryId) ||
      parsedCategoryId < 1 ||
      !Number.isInteger(parsedBrandId) ||
      parsedBrandId < 1
    ) {
      setValidationError("Enter valid positive category and brand IDs.");
      return;
    }

    if (
      rating.trim() === "" ||
      !Number.isFinite(parsedRating) ||
      parsedRating < 0 ||
      parsedRating > 5
    ) {
      setValidationError("Rating must be between 0 and 5.");
      return;
    }

    if (trimmedDescription.length > 500) {
      setValidationError(
        "Description must not exceed 500 characters.",
      );
      return;
    }

    setValidationError(null);

    try {
      await onSave({
        name: trimmedName,
        description: trimmedDescription || null,
        categoryId: parsedCategoryId,
        brandId: parsedBrandId,
        rating: parsedRating,
      });
    } catch {
      // The action hook already stores and displays the API error.
    }
  }

  function clearValidationError() {
    setValidationError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>

      <div>
        <label
          htmlFor="product-name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="product-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearValidationError();
          }}
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
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            clearValidationError();
          }}
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
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              clearValidationError();
            }}
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
            value={brandId}
            onChange={(event) => {
              setBrandId(event.target.value);
              clearValidationError();
            }}
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
          value={rating}
          onChange={(event) => {
            setRating(event.target.value);
            clearValidationError();
          }}
          required
          disabled={isSaving}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <p className="text-sm text-gray-500">
        Price: ₹{product.price.toFixed(2)} (not editable here)
      </p>

      {(validationError || saveError) && (
        <p role="alert" className="text-sm text-red-600">
          {validationError ?? saveError}
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
          onClick={onCancel}
          variant={ButtonVariant.Outline}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
