import type { Metadata } from "next";

import ProductListing from "./ProductListing";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse products and discover your favorites on SwiftCart.",
};

export default function ProductsPage() {
  return <ProductListing />;
}
