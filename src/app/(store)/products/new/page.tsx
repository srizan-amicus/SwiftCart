"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface CreateProductResponse {
  id: number;
  name: string;
  price: number;
}

export default function NewProductPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = event.currentTarget;

  setError("");
  setSuccess("");
  setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const product = {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      categoryId: Number(formData.get("categoryId")),
      brandId: Number(formData.get("brandId")),
      rating: Number(formData.get("rating")),
      price: Number(formData.get("price")),
      imagePath: null,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Unable to create the product.";

        throw new Error(message);
      }

      const createdProduct = data as CreateProductResponse;

      setSuccess(`Product "${createdProduct.name}" created successfully.`);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter the product details below.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Product name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={150}
            required
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={500}
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category ID
            </label>
            <input
              id="categoryId"
              name="categoryId"
              type="number"
              min={1}
              step={1}
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label
              htmlFor="brandId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Brand ID
            </label>
            <input
              id="brandId"
              name="brandId"
              type="number"
              min={1}
              step={1}
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Price (₹)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Rating (0–5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step="0.1"
              defaultValue={0}
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating Product..." : "Create Product"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/products")}
          className="w-full text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Back to Products
        </button>
      </form>
    </section>
  );
}
