/**
 * @jest-environment node
 */

import { GET } from "./route";
import { getCartItemCount } from "@/services/cart-api";

jest.mock("@/services/cart-api", () => ({
  getCartItemCount: jest.fn(),
}));

describe("Cart Count Route Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the cart item count successfully", async () => {
    jest.mocked(getCartItemCount).mockResolvedValue(3);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ itemCount: 3 });

    expect(response.headers.get("Cache-Control")).toBe("private, no-store");

    expect(getCartItemCount).toHaveBeenCalledTimes(1);
  });

  test("returns 500 when fetching the cart count fails", async () => {
    jest
      .mocked(getCartItemCount)
      .mockRejectedValue(new Error("Cart service unavailable"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        message: "Unable to fetch cart count.",
      });

      expect(getCartItemCount).toHaveBeenCalledTimes(1);
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
