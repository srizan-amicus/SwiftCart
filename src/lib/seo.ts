import type { Metadata } from "next";
import type { Product } from "@/types/product";

interface PageMetadataOptions {
  title: string;
  description: string;
}

export function createPageMetadata({
  title,
  description,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
  };
}

export function createProductMetadata(
  product: Pick<Product, "name" | "description">,
): Metadata {
  return createPageMetadata({
    title: product.name,
    description:
      product.description?.trim() ||
      `Explore ${product.name} on SwiftCart. Discover product details and pricing.`,
  });
}

export function createNotFoundMetadata(): Metadata {
  return createPageMetadata({
    title: "Product Not Found",
    description: "The requested product could not be found.",
  });
}
