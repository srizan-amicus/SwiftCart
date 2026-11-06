import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ProductDetails from "./ProductDetails";
import {
  fetchProductsOnServer,
  fetchProductByIdOnServer,
} from "@/services/products-api";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details on SwiftCart.",
};

export async function generateStaticParams() {
  const result = await fetchProductsOnServer({
    page: 1,
    pageSize: 100,
  });

  return result.products.map((product) => ({
    id: String(product.id),
  }));
}

function ProductDetailsSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="min-h-80 rounded-2xl bg-gray-100" />

        <div className="space-y-5 py-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-5 w-1/3 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-100" />
          <div className="h-10 w-1/2 rounded bg-gray-200" />
          <div className="h-12 w-40 rounded-lg bg-gray-200" />
        </div>
      </div>
    </main>
  );
}

async function ProductDetailsContent({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  let product;

  try {
    product = await fetchProductByIdOnServer(productId);
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found.") {
      notFound();
    }

    throw error;
  }

  return <ProductDetails productId={id} initialProduct={product} />;
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
