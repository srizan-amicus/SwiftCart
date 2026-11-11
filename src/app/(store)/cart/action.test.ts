import { addToCartFormAction } from "./action";
import { addCartItem } from "@/services/cart-api";
import { revalidatePath } from "next/cache";

jest.mock("@/services/cart-api", () => ({
  addCartItem: jest.fn(),
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Cart Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adds an item to the cart with valid form data", async () => {
    jest
      .mocked(addCartItem)
      .mockResolvedValue(undefined as Awaited<ReturnType<typeof addCartItem>>);

    const formData = new FormData();
    formData.set("productId", "1");
    formData.set("quantity", "2");

    const result = await addToCartFormAction(formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Item added to cart successfully.");

    expect(addCartItem).toHaveBeenCalledWith(1, 2);

    expect(revalidatePath).toHaveBeenCalledTimes(3);
    expect(revalidatePath).toHaveBeenCalledWith("/cart");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  test("rejects invalid product ID", async () => {
    const formData = new FormData();
    formData.set("productId", "0");
    formData.set("quantity", "2");

    const result = await addToCartFormAction(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();

    expect(addCartItem).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test("returns an error when adding an item to the cart fails", async () => {
    jest
      .mocked(addCartItem)
      .mockRejectedValue(new Error("Cart service unavailable"));

    const formData = new FormData();
    formData.set("productId", "1");
    formData.set("quantity", "2");

    const result = await addToCartFormAction(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Cart service unavailable");
    expect(addCartItem).toHaveBeenCalledWith(1, 2);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
