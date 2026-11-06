import { Suspense } from "react";
import { redirect } from "next/navigation";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getAddresses } from "@/services/addresses-api";
import { getCart } from "@/services/cart-api";
import type { Address } from "@/types/checkout";
import { continueCheckout } from "./action";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Checkout",
  description:
    "Complete your SwiftCart order by reviewing your items and providing your delivery details.",
});

function CheckoutSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>

        <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </main>
  );
}

async function CheckoutContent() {
  const cartItems = await getCart().catch(() => {
    redirect("/login?redirect=/checkout");
  });

  if (cartItems.length === 0) {
    redirect("/products");
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.itemSubtotal,
    0,
  );

  let addresses: Address[] = [];

  try {
    addresses = await getAddresses();
  } catch {
    // Customers can still enter a new address if saved addresses
    // cannot be loaded.
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutForm
        addresses={addresses}
        cartItems={cartItems}
        subtotal={subtotal}
        onContinue={continueCheckout}
      />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
