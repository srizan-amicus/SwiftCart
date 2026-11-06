import Link from "next/link";
import { redirect } from "next/navigation";

import { getOrderById } from "@/services/orders-api";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Order Confirmation",
  description:
    "Your SwiftCart order has been placed successfully. Review your order items, delivery address, payment details, and order summary.",
});

interface OrderPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

function formatCurrency(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { orderId: orderIdParam } = await searchParams;
  const orderId = Number(orderIdParam);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    redirect("/");
  }

  let order;

  try {
    order = await getOrderById(orderId);
  } catch {
    redirect("/");
  }

  if (order.orderId !== orderId) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Confirmation */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
          Thank you for your order!
        </h1>

        <p className="mt-2 text-gray-600">
          Your order has been placed successfully.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Order ID:{" "}
          <span className="font-semibold text-gray-900">#{order.orderId}</span>
        </p>

        <span className="mt-4 inline-flex rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
          {order.orderStatus}
        </span>
      </section>

      {/* Order Items */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Order Details</h2>

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
              </div>

              <p className="shrink-0 font-semibold text-gray-900">
                {formatCurrency(item.itemSubtotal)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping and Payment */}
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">Delivery Address</h2>

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

          <p className="mt-4 text-sm text-gray-500">
            Shipping:{" "}
            <span className="font-medium text-gray-900">
              {order.shipping.shippingMethod}
            </span>
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">Payment Details</h2>

          {order.payment ? (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900">
                  {order.payment.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-green-700">
                  {order.payment.paymentStatus}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Transaction Reference</p>
                <p className="mt-1 break-all font-medium text-gray-900">
                  {order.payment.transactionReference}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Payment details are not available.
            </p>
          )}
        </section>
      </div>

      {/* Price Summary */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Payment Summary</h2>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{formatCurrency(order.shippingCharge)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total Paid</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/products"
          className="rounded-lg bg-orange-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-700"
        >
          Continue Shopping
        </Link>

        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
