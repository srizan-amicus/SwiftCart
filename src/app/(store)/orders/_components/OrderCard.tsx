"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { OrderSummary } from "@/services/dashboard-api";
import type { OrderDetails } from "@/types/order";
import { reorderOrderAction } from "../action";

interface OrderCardProps {
  order: OrderSummary;
  details: OrderDetails | null;
  itemCount: number | null;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusStyles(status: string) {
  switch (status.toLowerCase()) {
    case "processing":
      return "bg-orange-100 text-orange-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrderCard({
  order,
  details,
  itemCount,
}: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const isDelivered = order.orderStatus.toLowerCase() === "delivered";
  const items = details?.items ?? [];

  function handleReorder() {
    setReorderError(null);

    startTransition(async () => {
      const result = await reorderOrderAction(order.orderId);

      if (!result.success) {
        setReorderError(
          result.message ??
            "Unable to reorder this purchase. Please try again.",
        );
        return;
      }

      router.push("/cart");
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Order summary */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              #{order.orderId}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>

            <div className="sm:text-right">
              <p className="text-xs text-gray-500">Order total</p>
              <p className="font-bold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Product thumbnails and item count */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {items.length > 0 ? (
            items.slice(0, 3).map((item) => (
              <div
                key={item.orderItemId}
                className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
              >
                <Image
                  src={FALLBACK_IMAGE}
                  alt={item.productName}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              📦
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">
              {itemCount === null
                ? "Order items"
                : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            </p>

            {items.length > 3 && (
              <p className="mt-1 text-xs text-gray-500">
                And {items.length - 3} more products
              </p>
            )}

            {details === null && (
              <p className="mt-1 text-xs text-gray-500">
                Item details are currently unavailable.
              </p>
            )}
          </div>
        </div>

        {/* Expand/collapse control */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            aria-controls={`order-details-${order.orderId}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700"
          >
            {isExpanded ? "HIDE DETAILS" : "VIEW DETAILS"}

            <svg
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded order details */}
      {isExpanded && (
        <div
          id={`order-details-${order.orderId}`}
          className="border-t border-gray-200 bg-gray-50 p-5 sm:p-6"
        >
          {details ? (
            <div className="space-y-7">
              {/* Products */}
              <section>
                <h3 className="font-bold text-gray-900">Products</h3>

                <div className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-4">
                  {details.items.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.itemSubtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Delivery and payment */}
              <div className="grid gap-6 sm:grid-cols-2">
                <section>
                  <h3 className="font-bold text-gray-900">Delivery Address</h3>

                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">
                      {details.shipping.shippingName}
                    </p>
                    <p>{details.shipping.shippingAddress}</p>
                    <p>
                      {details.shipping.shippingCity},{" "}
                      {details.shipping.shippingState}
                    </p>
                    <p>{details.shipping.shippingPostalCode}</p>
                    <p className="pt-2">
                      Shipping method:{" "}
                      <span className="font-medium text-gray-900">
                        {details.shipping.shippingMethod}
                      </span>
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-gray-900">Payment Details</h3>

                  {details.payment ? (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Method</span>
                        <span className="text-right font-medium text-gray-900">
                          {details.payment.paymentMethod}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Status</span>
                        <span className="text-right font-medium text-gray-900">
                          {details.payment.paymentStatus}
                        </span>
                      </div>

                      <div>
                        <p className="text-gray-500">Transaction Reference</p>
                        <p className="mt-1 break-all font-medium text-gray-900">
                          {details.payment.transactionReference}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">
                      Payment details are not available.
                    </p>
                  )}
                </section>
              </div>

              {/* Price summary */}
              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-bold text-gray-900">Payment Summary</h3>

                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(details.subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(details.shippingCharge)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(details.tax)}</span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-gray-200 pt-3 font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(details.totalAmount)}</span>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              We couldn&apos;t retrieve the details for this order. Please try
              again later.
            </p>
          )}

          {/* Reorder */}
          {isDelivered && (
            <div className="mt-6 border-t border-gray-200 pt-5">
              {reorderError && (
                <p role="alert" className="mb-3 text-sm text-red-600">
                  {reorderError}
                </p>
              )}

              <button
                type="button"
                onClick={handleReorder}
                disabled={isPending}
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Adding items to cart..." : "REORDER"}
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
