import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, UserRound } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  getAddresses,
  getCart,
  getOrderHistory,
} from "@/services/dashboard-api";

import DashboardSkeleton from "./_components/DashboardSkeleton";

async function AccountOverview() {
  const [addresses, cart] = await Promise.all([getAddresses(), getCart()]);

  const defaultAddress =
    addresses.find((address) => address.isDefault) ?? addresses[0];

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Your cart</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">{cartCount}</p>
            <p className="mt-1 text-sm text-gray-500">
              {cartCount === 1
                ? "item waiting for you"
                : "items waiting for you"}
            </p>
          </div>
          <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <ShoppingBag size={22} />
          </span>
        </div>
        <Link
          href="/cart"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View cart <ArrowRight size={16} />
        </Link>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Saved address</p>
            <p className="mt-3 text-lg font-bold text-gray-900">
              {defaultAddress ? defaultAddress.city : "Not added yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {defaultAddress
                ? `${defaultAddress.state}, ${defaultAddress.country}`
                : "Add an address during checkout"}
            </p>
          </div>
          <span className="rounded-xl bg-gray-100 p-3 text-gray-700">
            <UserRound size={22} />
          </span>
        </div>
        {defaultAddress && (
          <p className="mt-4 text-sm text-gray-600">
            {defaultAddress.addressLine1}
            {defaultAddress.postalCode ? ` · ${defaultAddress.postalCode}` : ""}
          </p>
        )}
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Order history</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              <OrderCount />
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Orders placed with SwiftCart
            </p>
          </div>
          <span className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Package size={22} />
          </span>
        </div>
        <Link
          href="/orders"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View orders <ArrowRight size={16} />
        </Link>
      </article>
    </section>
  );
}

async function OrderCount() {
  const history = await getOrderHistory(1, 1);
  return history.totalRecords;
}

async function RecentOrders() {
  const history = await getOrderHistory(1, 5);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
            Your activity
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Recent orders
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep track of your latest purchases.
          </p>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
        >
          View all orders <ArrowRight size={16} />
        </Link>
      </div>

      {history.orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Package size={26} />
          </div>
          <h3 className="mt-4 font-semibold text-gray-900">
            Your first order starts here
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Explore the store and find something you love.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Explore products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.orders.map((order) => (
            <article
              key={order.orderId}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-100">
                    <Package size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">
                      Order #{order.orderId}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    <span className="mt-3 inline-flex rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:justify-end sm:border-0 sm:pt-0">
                  <div className="sm:text-right">
                    <p className="text-xs font-medium text-gray-500">
                      Order total
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order.orderId}`}
                    aria-label={`View order ${order.orderId}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/login?returnTo=%2Fdashboard");
  }

  const userName = cookieStore.get("userName")?.value ?? "there";
  const userEmail = cookieStore.get("userEmail")?.value;

  return (
    <main className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 px-6 py-8 text-white shadow-sm sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold text-orange-50">
            YOUR SWIFTCART SPACE
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {userName}!
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-orange-50 sm:text-base">
            Everything you need for your shopping journey, all in one place.
            Check your orders and pick up where you left off.
          </p>
          {userEmail && (
            <p className="mt-4 text-sm text-white/90">{userEmail}</p>
          )}
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-50"
          >
            Continue shopping <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Your account at a glance
        </h2>
        <Suspense fallback={<DashboardSkeleton cards={3} />}>
          <AccountOverview />
        </Suspense>
      </div>

      <Suspense fallback={<DashboardSkeleton cards={0} showOrders />}>
        <RecentOrders />
      </Suspense>
    </main>
  );
}
