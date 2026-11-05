
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCart } from "@/services/cart-api";
import CartContent from "@/components/cart/CartContent";

async function CartPageContent() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login?redirect=/cart");
  }

  const cartItems = await getCart();

  return <CartContent initialItems={cartItems} />;
}

function CartLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-gray-500">
        Loading your cart...
      </p>
    </div>
  );
}

export default function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<CartLoading />}>
        <CartPageContent />
      </Suspense>
    </main>
  );
}
