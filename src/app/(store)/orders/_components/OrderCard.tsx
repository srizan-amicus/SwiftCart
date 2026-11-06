import Image from "next/image";
import Link from "next/link";
import type { OrderSummary } from "@/services/dashboard-api";
import type { OrderItem } from "@/types/order";

interface OrderCardProps {
  order: OrderSummary;
  items: OrderItem[] | null;
  itemCount: number | null;
}

interface StatusStyle {
  label: string;
  className: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600";

function getStatusStyle(status: string): StatusStyle {
  switch (status.toLowerCase()) {
    case "processing":
      return {
        label: status,
        className: "border-orange-100 bg-orange-50 text-orange-700",
      };

    case "shipped":
      return {
        label: status,
        className: "border-blue-100 bg-blue-50 text-blue-700",
      };

    case "delivered":
      return {
        label: status,
        className: "border-green-100 bg-green-50 text-green-700",
      };

    case "cancelled":
      return {
        label: status,
        className: "border-red-100 bg-red-50 text-red-700",
      };

    default:
      return {
        label: status,
        className: "border-gray-200 bg-gray-100 text-gray-700",
      };
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function OrderCard({ order, items, itemCount }: OrderCardProps) {
  const statusStyle = getStatusStyle(order.orderStatus);
  const thumbnails = items?.slice(0, 3) ?? [];

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5">
        {/* Order information */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="font-bold text-gray-900">Order #{order.orderId}</p>

            <p className="mt-1 text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>

            <span
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-medium text-gray-500">Order total</p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Product thumbnails and item count */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex -space-x-3">
              {thumbnails.length > 0 ? (
                thumbnails.map((item, index) => (
                  <div
                    key={item.orderItemId}
                    className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-gray-50"
                    style={{ zIndex: thumbnails.length - index }}
                  >
                    <Image
                      src={FALLBACK_IMAGE}
                      alt={item.productName}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))
              ) : (
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <Image
                    src={FALLBACK_IMAGE}
                    alt="Product image unavailable"
                    width={56}
                    height={56}
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {itemCount === null
                  ? "Item details unavailable"
                  : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {items && items.length > 3
                  ? `And ${items.length - 3} more product${items.length - 3 === 1 ? "" : "s"}`
                  : "Order items"}
              </p>
            </div>
          </div>

          {/* View details */}
          <Link
            href={`/orders/${order.orderId}`}
            className="inline-flex items-center justify-center rounded-xl border border-orange-500 px-5 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </article>
  );
}
