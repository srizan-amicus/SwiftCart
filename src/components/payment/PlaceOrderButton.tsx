"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { confirmOrder } from "@/app/(store)/review/action";

export default function PlaceOrderButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handlePlaceOrder() {
    setError(null);

    startTransition(async () => {
      try {
        const orderId = await confirmOrder();
        router.push(`/order?orderId=${orderId}`);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while placing your order.",
        );
      }
    });
  }

  return (
    <div>
      {error && (
        <p
          role="alert"
          className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isPending}
        className="w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Placing Order..." : "Confirm & Place Order"}
      </button>
    </div>
  );
}
