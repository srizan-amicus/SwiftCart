import type { CartItem } from "@/services/cart-api";

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  isFormValid?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  isSubmitting?: boolean;
  hideTotals?: boolean;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  isFormValid = true,
  actionLabel = "Continue to Payment",
  onAction,
  isSubmitting = false,
  hideTotals = false,
}: OrderSummaryProps) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

      <div className="mt-5 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {item.productName}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Quantity: {item.quantity}
              </p>
            </div>

            <p className="shrink-0 text-sm font-medium text-gray-900">
              ₹{item.itemSubtotal.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="my-5 border-t border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Subtotal</span>

        <span className="font-semibold text-gray-900">
          ₹{subtotal.toFixed(2)}
        </span>
      </div>

      {hideTotals && (
        <p className="mt-4 text-xs leading-5 text-gray-500">
          Shipping charges and applicable taxes will be calculated during
          checkout.
        </p>
      )}

      <button
        type={onAction ? "button" : "submit"}
        onClick={onAction}
        disabled={!isFormValid || isSubmitting}
        className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Please wait..." : actionLabel}
      </button>
    </aside>
  );
}
