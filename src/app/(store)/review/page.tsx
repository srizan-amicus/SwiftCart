import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import PlaceOrderButton from "@/components/payment/PlaceOrderButton";
import { getOrderById } from "@/services/orders-api";

import type { DisplayPaymentMethod } from "@/types/payment";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Review Your Order",
  description:
    "Review your SwiftCart order items, shipping address, delivery method, payment method, and total amount before placing your order.",
});

const validPaymentMethods: DisplayPaymentMethod[] = [
  "Card",
  "UPI",
  "Cash on Delivery",
];

function formatCurrency(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

export default async function ReviewOrderPage() {
  const cookieStore = await cookies();

  const pendingOrderId = cookieStore.get("pendingOrderId")?.value;
  const selectedPaymentMethod = cookieStore.get("selectedPaymentMethod")?.value;

  if (!pendingOrderId || !selectedPaymentMethod) {
    redirect("/checkout");
  }

  const orderId = Number(pendingOrderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    redirect("/checkout");
  }

  if (
    !validPaymentMethods.includes(selectedPaymentMethod as DisplayPaymentMethod)
  ) {
    redirect("/payment");
  }

  let order;

  try {
    order = await getOrderById(orderId);
  } catch {
    redirect("/checkout");
  }

  if (order.orderId !== orderId) {
    redirect("/checkout");
  }

  // An already-paid order should not be reviewed for payment again.
  if (order.payment?.paymentStatus === "Success") {
    redirect("/orders");
  }

  const paymentMethod = selectedPaymentMethod as DisplayPaymentMethod;

  const shippingMethodLabel =
    order.shipping.shippingMethod.toLowerCase() === "same day"
      ? "Overnight"
      : order.shipping.shippingMethod;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutSteps activeStep={3} />

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Your Order</h1>

        <p className="mt-2 text-sm text-gray-500">
          Check your order details before confirming your purchase.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          {/* Products */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Items</h2>

            <div className="mt-5 divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Unit price: {formatCurrency(item.price)}
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold text-gray-900">
                    {formatCurrency(item.itemSubtotal)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping address */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Shipping Address
            </h2>

            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">
                {order.shipping.shippingName}
              </p>

              <p>{order.shipping.shippingAddress}</p>
              <p>
                {order.shipping.shippingCity}, {order.shipping.shippingState}
              </p>
              <p>{order.shipping.shippingPostalCode}</p>
            </div>
          </section>

          {/* Selected shipping and payment methods */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Shipping & Payment
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Shipping method</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {shippingMethodLabel}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment method</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {paymentMethod}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final order total */}
        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:sticky sm:top-6 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <p className="mt-1 text-sm text-gray-500">Order #{order.orderId}</p>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.shippingCharge)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.tax)}
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-gray-200" />

          <div className="flex justify-between gap-4 text-base font-bold text-gray-900">
            <span>Total Amount</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>

          <p className="mt-5 rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-800">
            Please verify your delivery address, shipping method and payment
            selection before placing your order.
          </p>

          <p className="mt-4 text-xs text-gray-500">
            Your order will be confirmed after successful payment processing.
          </p>

          {/* Place Order */}
          <div className="mt-6">
            <PlaceOrderButton />
          </div>
        </aside>
      </div>
    </main>
  );
}
