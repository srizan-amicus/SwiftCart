import { Suspense } from "react";
import Link from "next/link";

import { getOrderHistory } from "@/services/dashboard-api";
import { getOrderById } from "@/services/orders-api";
import type { OrderItem } from "@/types/order";

import OrderCard from "./_components/OrderCard";

export const metadata = {
  title: "My Orders | SwiftCart",
  description: "View your SwiftCart order history and track your purchases.",
};

const PAGE_SIZE = 8;

const STATUS_TABS = [
  { label: "All Orders", value: "" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
    search?: string;
  }>;
}

interface OrdersContentProps {
  searchParams: OrdersPageProps["searchParams"];
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="mt-4 h-3 w-56 rounded bg-gray-100" />
          <div className="mt-6 h-16 rounded-xl bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

async function OrdersContent({ searchParams }: OrdersContentProps) {
  const params = await searchParams;

  const allowedStatuses = STATUS_TABS.map((tab) => tab.value);
  const status = allowedStatuses.includes(params.status ?? "")
    ? params.status || undefined
    : undefined;

  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const search = params.search?.trim() ?? "";

  const history = await getOrderHistory(page, PAGE_SIZE, status);

  // The history endpoint doesn't return order items, so fetch details
  // for the current page's orders to calculate item counts and thumbnails.
  const ordersWithDetails = await Promise.all(
    history.orders.map(async (order) => {
      try {
        const details = await getOrderById(order.orderId);

        return {
          order,
          items: details.items,
          itemCount: details.items.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        };
      } catch {
        // Keep the order visible even if its details cannot be retrieved.
        return {
          order,
          items: null as OrderItem[] | null,
          itemCount: null as number | null,
        };
      }
    }),
  );

  const visibleOrders = ordersWithDetails.filter(({ order }) =>
    String(order.orderId).includes(search),
  );

  const totalPages = Math.max(1, history.totalPages);

  function buildOrdersUrl(options: {
    status?: string;
    page?: number;
    search?: string;
  }) {
    const query = new URLSearchParams();

    if (options.status) query.set("status", options.status);
    if (options.page && options.page > 1) {
      query.set("page", String(options.page));
    }
    if (options.search) query.set("search", options.search);

    const queryString = query.toString();
    return queryString ? `/orders?${queryString}` : "/orders";
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <header className="mb-7 flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-gray-950 to-orange-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Your shopping journey
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              My Orders<span className="text-orange-500">.</span>
            </h1>

            <p className="mt-2 text-sm text-gray-300">
              Track purchases and revisit your order details.
            </p>
          </div>

          <Link
            href="/products"
            className="rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-bold transition hover:bg-orange-400"
          >
            Continue Shopping →
          </Link>
        </header>

        {/* Purchases and filters */}
        <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Your purchases</h2>
              <p className="text-sm text-gray-500">
                {history.totalRecords} orders
              </p>
            </div>

            <form action="/orders" method="GET" className="flex gap-2">
              {status && <input type="hidden" name="status" value={status} />}

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search order number..."
                aria-label="Search by order number"
                className="min-h-11 min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:w-64"
              />

              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Search
              </button>
            </form>
          </div>

          <nav
            aria-label="Filter orders by status"
            className="mt-5 flex gap-2 overflow-x-auto pb-1"
          >
            {STATUS_TABS.map((tab) => {
              const isActive = (status ?? "") === tab.value;

              return (
                <Link
                  key={tab.label}
                  href={buildOrdersUrl({ status: tab.value })}
                  aria-current={isActive ? "page" : undefined}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </section>

        {/* Orders */}
        {visibleOrders.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
            <div className="text-4xl" aria-hidden="true">
              🛍️
            </div>

            <h2 className="mt-4 text-xl font-bold">
              {search
                ? "No matching orders"
                : status
                  ? "No orders found"
                  : "No orders yet. Start shopping!"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try a different order number."
                : "Your orders will appear here when you shop with us."}
            </p>

            <Link
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Explore Products
            </Link>
          </section>
        ) : (
          <div className="space-y-4">
            {visibleOrders.map(({ order, items, itemCount }) => (
              <OrderCard
                key={order.orderId}
                order={order}
                items={items}
                itemCount={itemCount}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!search && totalPages > 1 && (
          <nav
            aria-label="Order pages"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Link
                href={buildOrdersUrl({ status, page: page - 1 })}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                className={`rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                Previous
              </Link>

              <Link
                href={buildOrdersUrl({ status, page: page + 1 })}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
                className={`rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                Next
              </Link>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
}
