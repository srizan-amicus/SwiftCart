
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { continueToReview } from "@/app/(store)/payment/action";

import type { CheckoutResponse } from "@/services/checkout-api";
import type { ShippingMethod } from "@/types/checkout";
import type { DisplayPaymentMethod } from "@/types/payment";

const shippingOptions: {
  value: ShippingMethod;
  label: string;
  description: string;
  price: number;
}[] = [
  {
    value: "Standard",
    label: "Standard",
    description: "Reliable delivery at an affordable price",
    price: 100,
  },
  {
    value: "Express",
    label: "Express",
    description: "A faster way to receive your order",
    price: 250,
  },
  {
    value: "Same Day",
    label: "Overnight",
    description: "Choose this delivery option",
    price: 400,
  },
];

const paymentOptions: {
  value: DisplayPaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "Card",
    label: "Debit / Credit Card",
    description: "Pay securely with your card",
  },
  {
    value: "UPI",
    label: "UPI",
    description: "Google Pay, PhonePe and more",
  },
  {
    value: "Cash on Delivery",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
];

export default function PaymentSelectionForm() {
  const router = useRouter();

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("Standard");

  const [paymentMethod, setPaymentMethod] =
    useState<DisplayPaymentMethod>("Card");

  const [error, setError] = useState<string | null>(null);
  const [checkoutIssues, setCheckoutIssues] =
    useState<CheckoutResponse | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleContinue = () => {
    setError(null);
    setCheckoutIssues(null);

    startTransition(async () => {
      try {
        const result = await continueToReview({
          shippingMethod,
          displayPaymentMethod: paymentMethod,
        });

        if (
          result.priceChanges.length > 0 ||
          result.stockIssues.length > 0
        ) {
          setCheckoutIssues(result);
          return;
        }

        if (result.orderId === null) {
          setError("Unable to create your order. Please try again.");
          return;
        }

        router.push("/review");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutSteps activeStep={2} />

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Shipping & Payment
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Select the options that work for you.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {checkoutIssues && (
        <section
          aria-live="polite"
          className="mt-6 space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4"
        >
          <h2 className="font-semibold text-amber-900">
            Please review your checkout
          </h2>

          {checkoutIssues.priceChanges.map((item) => (
            <p key={item.productId} className="text-sm text-gray-700">
              {item.productName}: ₹{item.oldPrice.toFixed(2)} → ₹
              {item.currentPrice.toFixed(2)}
            </p>
          ))}

          {checkoutIssues.stockIssues.map((item) => (
            <p key={item.productId} className="text-sm text-gray-700">
              {item.productName}: Requested {item.requestedQuantity},
              available {item.availableQuantity}
            </p>
          ))}

          <p className="text-sm text-amber-800">
            Please review your cart and try again.
          </p>
        </section>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Shipping method */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Shipping method
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            How quickly would you like your order?
          </p>

          <div className="mt-5 space-y-3">
            {shippingOptions.map((option) => {
              const isSelected = shippingMethod === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setShippingMethod(option.value)}
                      className="mt-1 accent-orange-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {option.label}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{option.price.toFixed(2)}
                    </p>

                    {isSelected && (
                      <span className="mt-1 inline-block text-xs font-medium text-orange-600">
                        Selected
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Payment method */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Payment method
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose how you prefer to pay.
          </p>

          <div className="mt-5 space-y-3">
            {paymentOptions.map((option) => {
              const isSelected = paymentMethod === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setPaymentMethod(option.value)}
                    className="mt-1 accent-orange-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      {option.label}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          <p className="mt-5 text-xs leading-5 text-gray-500">
            Your selected method is recorded with your order.
            Payment processing uses the existing payment service.
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-col-reverse justify-between gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/checkout")}
          disabled={isPending}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isPending}
          className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating order..." : "Continue to Review Order →"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Review your selections before proceeding to the final order review.
      </p>
    </main>
  );
}
