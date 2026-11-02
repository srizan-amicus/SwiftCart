"use client";

import type { ShippingMethod } from "@/types/checkout";

interface ShippingMethodSelectorProps {
  value: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
}

const SHIPPING_METHODS: {
  value: ShippingMethod;
  label: string;
  description: string;
  price: number;
  deliveryTime: string;
}[] = [
  {
    value: "Standard",
    label: "Standard Delivery",
    description: "Regular delivery",
    price: 100,
    deliveryTime: "5–7 business days",
  },
  {
    value: "Express",
    label: "Express Delivery",
    description: "Faster delivery",
    price: 250,
    deliveryTime: "2–3 business days",
  },
  {
    value: "Same Day",
    label: "Overnight Delivery",
    description: "Priority delivery",
    price: 400,
    deliveryTime: "1 business day",
  },
];

export default function ShippingMethodSelector({
  value,
  onChange,
}: ShippingMethodSelectorProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose how quickly you want your order delivered.
        </p>
      </div>

      <div className="space-y-3">
        {SHIPPING_METHODS.map((method) => {
          const isSelected = value === method.value;

          return (
            <label
              key={method.value}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition ${
                isSelected
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="shippingMethod"
                  value={method.value}
                  checked={isSelected}
                  onChange={() => onChange(method.value)}
                  className="mt-1 h-4 w-4 accent-orange-500"
                />

                <div>
                  <p className="font-medium text-gray-900">{method.label}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {method.deliveryTime}
                  </p>
                </div>
              </div>

              <span className="shrink-0 font-semibold text-gray-900">
                ₹{method.price.toFixed(2)}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
