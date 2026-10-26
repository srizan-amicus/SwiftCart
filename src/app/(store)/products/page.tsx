import type { Metadata } from "next";
import { Suspense } from "react";
import ProductListing from "./ProductListing";
import { fetchProductsOnServer } from "@/services/products-api";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse products and discover your favorites on SwiftCart.",
};

// Revalidate the static listing page every 60 seconds.
export const revalidate = 60;

export default async function ProductsPage() {
  const initialParams = {
    page: 1,
    pageSize: 12,
  };

  const initialData = await fetchProductsOnServer(initialParams);

  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductListing initialData={initialData} initialParams={initialParams} />
    </Suspense>
  );
}
