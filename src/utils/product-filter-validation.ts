export interface ProductFilterValues {
  brandId: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
}

export function validateProductFilters(
  filters: ProductFilterValues,
): string | null {
  const { brandId, minPrice, maxPrice, minRating } = filters;

  if (brandId.trim() !== "") {
    const parsedBrandId = Number(brandId);

    if (!Number.isInteger(parsedBrandId) || parsedBrandId <= 0) {
      return "Brand ID must be a positive integer.";
    }
  }

  if (minPrice.trim() !== "") {
    const parsedMinPrice = Number(minPrice);

    if (!Number.isFinite(parsedMinPrice) || parsedMinPrice < 0) {
      return "Minimum price must be a valid non-negative number.";
    }
  }

  if (maxPrice.trim() !== "") {
    const parsedMaxPrice = Number(maxPrice);

    if (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0) {
      return "Maximum price must be a valid non-negative number.";
    }
  }

  if (minPrice.trim() !== "" && maxPrice.trim() !== "") {
    if (Number(minPrice) > Number(maxPrice)) {
      return "Minimum price cannot exceed maximum price.";
    }
  }

  if (minRating.trim() !== "") {
    const parsedRating = Number(minRating);

    if (
      !Number.isFinite(parsedRating) ||
      parsedRating < 0 ||
      parsedRating > 5
    ) {
      return "Minimum rating must be between 0 and 5.";
    }
  }

  return null;
}