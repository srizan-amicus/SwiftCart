import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

export const revalidate = 60;

export async function generateStaticParams() {
  const result = await fetchProductsOnServer({
    page: 1,
    pageSize: 100,
  });

  return result.products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
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

 return (
  <ProductDetails
    productId={id}
    initialProduct={product}
  />
);
}
