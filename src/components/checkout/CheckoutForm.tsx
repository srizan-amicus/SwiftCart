
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddressPicker from "@/components/checkout/AddressPicker";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingFields from "@/components/checkout/ShippingFields";

import { checkoutSchema } from "@/lib/validations/checkout-schema";

import type { Address, CheckoutFormData } from "@/types/checkout";
import type { CartItem } from "@/services/cart-api";

interface CheckoutFormProps {
  addresses: Address[];
  cartItems: CartItem[];
  subtotal: number;
  onContinue: (data: {
    addressId: number | null;
    formData: CheckoutFormData;
  }) => Promise<number>;
}

export default function CheckoutForm({
  addresses,
  cartItems,
  subtotal,
  onContinue,
}: CheckoutFormProps) {
  const router = useRouter();

  const defaultAddress = addresses.find((address) => address.isDefault);

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | "new"
  >(defaultAddress?.addressId ?? "new");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    formState: { isValid },
  } = methods;

  // Populate the form when a saved address is selected.
  useEffect(() => {
    if (selectedAddressId === "new") {
      setValue("streetAddress", "", { shouldValidate: true });
      setValue("apartment", "");
      setValue("city", "", { shouldValidate: true });
      setValue("state", "", { shouldValidate: true });
      setValue("zip", "", { shouldValidate: true });
      setValue("country", "", { shouldValidate: true });

      clearErrors([
        "streetAddress",
        "apartment",
        "city",
        "state",
        "zip",
        "country",
      ]);

      return;
    }

    const selectedAddress = addresses.find(
      (address) => address.addressId === selectedAddressId,
    );

    if (!selectedAddress) return;

    setValue("streetAddress", selectedAddress.addressLine1, {
      shouldValidate: true,
    });
    setValue("apartment", selectedAddress.addressLine2 ?? "", {
      shouldValidate: true,
    });
    setValue("city", selectedAddress.city, { shouldValidate: true });
    setValue("state", selectedAddress.state, { shouldValidate: true });
    setValue("zip", selectedAddress.postalCode, { shouldValidate: true });
    setValue("country", selectedAddress.country, { shouldValidate: true });

    clearErrors([
      "streetAddress",
      "apartment",
      "city",
      "state",
      "zip",
      "country",
    ]);

    void trigger();
  }, [selectedAddressId, addresses, setValue, clearErrors, trigger]);

  // Save the address and proceed to the payment page.
  const handleFormSubmit: SubmitHandler<CheckoutFormData> = async (
    formData,
  ) => {
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      await onContinue({
        addressId:
          selectedAddressId === "new" ? null : selectedAddressId,
        formData,
      });

      router.push("/payment");
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <CheckoutSteps activeStep={1} />

        {checkoutError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                  Shipping Information
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Select a saved address or enter a new delivery address.
                </p>
              </div>

              <div className="space-y-6">
                <AddressPicker
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                />

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="mb-4 text-base font-semibold text-gray-900">
                    {selectedAddressId === "new"
                      ? "New Address Details"
                      : "Delivery Address Details"}
                  </h2>

                  <ShippingFields />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-6">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              isFormValid={isValid}
              isSubmitting={isSubmitting}
              actionLabel={
                isSubmitting ? "Processing..." : "Continue to Payment"
              }
              hideTotals
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
