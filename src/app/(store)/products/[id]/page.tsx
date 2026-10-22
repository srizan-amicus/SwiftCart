
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import ProductDetails from "./ProductDetails";
import { fetchProductByIdOnServer } from "@/services/products-api";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details on SwiftCart.",
};

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

  const cookieStore = await cookies();
  const role = cookieStore.get("userRole")?.value;
  const isAdmin = role?.toLowerCase() === "admin";

  return (
    <ProductDetails
      productId={id}
      initialProduct={product}
      isAdmin={isAdmin}
    />
  );
}
