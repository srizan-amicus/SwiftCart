import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProductCard from "./ProductCard";
import { ProductCardVariant } from "@/constants/product-variants";
import { addToCartFormAction } from "@/app/(store)/cart/action";
import type { Product } from "@/types/product";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    priority,
    fill,
    placeholder,
    blurDataURL,
    ...props
  }: React.ComponentProps<"img"> & {
    priority?: boolean;
    fill?: boolean;
    placeholder?: string;
    blurDataURL?: string;
  }) => <img {...props} />,
}));

jest.mock("@/app/(store)/cart/action", () => ({
  addToCartFormAction: jest.fn(),
}));

const mockProduct: Product = {
  id: 1,
  name: "Wireless Headphones",
  description: "High-quality wireless headphones",
  price: 499.99,
  imageUrl: "/images/headphones.jpg",
  rating: 4.5,
};

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the product name", () => {
    render(<ProductCard product={mockProduct} />);

    expect(
      screen.getByRole("heading", { name: mockProduct.name }),
    ).toBeInTheDocument();
  });

  test("renders the product image with accessible alt text", () => {
    render(<ProductCard product={mockProduct} />);

    expect(
      screen.getByRole("img", { name: mockProduct.name }),
    ).toBeInTheDocument();
  });

  test("links to the correct product details page", () => {
    render(<ProductCard product={mockProduct} />);

    expect(
      screen.getByRole("link", {
        name: `View ${mockProduct.name} details`,
      }),
    ).toHaveAttribute("href", "/products/1");
  });

  test("displays the initial quantity and total price", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Total: ₹499.99")).toBeInTheDocument();
  });

  test("increases quantity and updates the total price", async () => {
    const user = userEvent.setup();

    render(<ProductCard product={mockProduct} />);

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Total: ₹999.98")).toBeInTheDocument();
  });

  test("does not allow quantity to decrease below one", async () => {
    const user = userEvent.setup();

    render(<ProductCard product={mockProduct} />);

    const decreaseButton = screen.getByRole("button", {
      name: "Decrease quantity",
    });

    expect(decreaseButton).toBeDisabled();

    await user.click(decreaseButton);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("displays the product price in listing variant", () => {
    render(
      <ProductCard
        product={mockProduct}
        variant={ProductCardVariant.Listing}
      />,
    );

    expect(screen.getByText("₹499.99")).toBeInTheDocument();
  });

  test("submits the correct product ID and quantity to the cart action", async () => {
    const user = userEvent.setup();

    jest.mocked(addToCartFormAction).mockResolvedValue({
      success: true,
      message: "Added to cart",
    });

    render(<ProductCard product={mockProduct} />);

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    await waitFor(() => {
      expect(addToCartFormAction).toHaveBeenCalled();
    });

    const submittedFormData = jest.mocked(addToCartFormAction).mock.calls[0][0];

    expect(submittedFormData.get("productId")).toBe("1");
    expect(submittedFormData.get("quantity")).toBe("2");
  });
});
