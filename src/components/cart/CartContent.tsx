"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import type { CartItem } from "@/services/cart-api";
import {
  updateCartQuantityFormAction,
  removeCartItemFormAction,
} from "@/app/(store)/cart/action";

interface CartContentProps {
  initialItems: CartItem[];
}

type CartAction =
  | { type: "update"; productId: number; quantity: number }
  | { type: "remove"; productId: number };

const SHIPPING_COST = 100;
const TAX_RATE = 0.08;

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  if (action.type === "remove") {
    return items.filter((item) => item.productId !== action.productId);
  }

  return items.map((item) =>
    item.productId === action.productId
      ? {
          ...item,
          quantity: action.quantity,
          itemSubtotal: item.price * action.quantity,
        }
      : item,
  );
}

export default function CartContent({ initialItems }: CartContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [optimisticItems, dispatchOptimistic] = useOptimistic( 
    initialItems,
    cartReducer,
  );

  function updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1 || quantity === item.quantity || isPending) return;

    setError("");

    startTransition(async () => {
      dispatchOptimistic({
        type: "update",
        productId: item.productId,
        quantity,
      });

      const formData = new FormData();
      formData.set("productId", String(item.productId));
      formData.set("quantity", String(quantity));

      const result = await updateCartQuantityFormAction(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  function removeItem(productId: number) {
    if (isPending) return;

    setError("");

    startTransition(async () => {
      dispatchOptimistic({ type: "remove", productId });

      const formData = new FormData();
      formData.set("productId", String(productId));

      const result = await removeCartItemFormAction(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  const itemCount = optimisticItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  const subtotal = optimisticItems.reduce(
    (total, item) => total + item.itemSubtotal,
    0,
  );

  const shipping = optimisticItems.length ? SHIPPING_COST : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  if (!optimisticItems.length) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-orange-50 p-6 text-orange-500">
          <ShoppingBag size={40} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          You haven&apos;t added anything yet. Explore our collection and find
          something you love.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Start shopping <ArrowRight size={17} />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-orange-500">
          Your SwiftCart bag
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="mt-2 text-sm text-gray-500">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_350px]">
        <div>
          <div className="space-y-4">
            {optimisticItems.map((item) => (
              <article
                key={item.cartItemId}
                className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <ShoppingBag size={32} strokeWidth={1.4} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {item.productName}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      disabled={isPending}
                      aria-label={`Remove ${item.productName}`}
                      className="text-gray-400 transition hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatPrice(item.price)} / unit
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center rounded-full border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        disabled={isPending || item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="rounded-full p-1.5 text-gray-600 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        disabled={isPending}
                        aria-label="Increase quantity"
                        className="rounded-full p-1.5 text-gray-600 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="font-bold text-gray-900">
                      {formatPrice(item.itemSubtotal)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500"
          >
            <ArrowLeft size={16} /> Continue shopping
          </Link>
        </div>

        <aside className="rounded-xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-medium text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span className="flex items-center gap-2">
                <Truck size={15} /> Standard shipping
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Estimated tax (8%)</span>
              <span className="font-medium text-gray-900">
                {formatPrice(tax)}
              </span>
            </div>
          </div>

          <div className="my-6 border-t border-dashed border-gray-200" />

          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-gray-900">Estimated total</span>
            <span className="text-xl font-bold text-orange-500">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-400">
            Final shipping and tax charges will be calculated during checkout.
          </p>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Proceed to Checkout <ArrowRight size={17} />
          </Link>

          <p className="mt-4 text-center text-xs text-gray-400">
            Your cart is saved to your account.
          </p>
        </aside>
      </div>
    </section>
  );
}
