
import type { Metadata } from "next";
import { cookies } from "next/headers";
import ProductDetails from "./ProductDetails";

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

  const cookieStore = await cookies();
  const role = cookieStore.get("userRole")?.value;

  const isAdmin = role?.toLowerCase() === "admin";

  return <ProductDetails productId={id} isAdmin={isAdmin} />;
}
