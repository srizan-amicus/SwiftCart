import { redirect } from "next/navigation";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getAddresses } from "@/services/addresses-api";
import { getCart } from "@/services/cart-api";
import type { Address } from "@/types/checkout";
import { continueCheckout } from "./action";

export const metadata = {
  title: "Checkout | SwiftCart",
};

export default async function CheckoutPage() {
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