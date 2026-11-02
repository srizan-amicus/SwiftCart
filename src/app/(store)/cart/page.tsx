
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCart } from "@/services/cart-api";
import CartContent from "@/components/cart/CartContent";

export default async function CartPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login?redirect=/cart");
  }

  const cartItems = await getCart();

  return (
    <main className="container mx-auto px-4 py-8">
      <CartContent initialItems={cartItems} />
    </main>
  );
}
