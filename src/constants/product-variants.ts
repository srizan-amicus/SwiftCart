export const ProductCardVariant = {
  Default: "default",
  Listing: "listing",
} as const;

export type ProductCardVariant =
  (typeof ProductCardVariant)[keyof typeof ProductCardVariant];
