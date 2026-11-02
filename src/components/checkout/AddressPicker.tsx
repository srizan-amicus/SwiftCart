"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Plus } from "lucide-react";

import type { Address } from "@/types/checkout";

interface AddressPickerProps {
  addresses: Address[];
  selectedAddressId: number | "new";
  onSelect: (id: number | "new") => void;
  isLoading?: boolean;
}

export default function AddressPicker({
  addresses,
  selectedAddressId,
  onSelect,
  isLoading = false,
}: AddressPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAddress = addresses.find(
    (address) => address.addressId === selectedAddressId,
  );

  const handleSelect = (id: number | "new") => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Saved Addresses
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select an address for your delivery.
        </p>
      </div>

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        disabled={isLoading}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white p-4 text-left transition hover:border-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex min-w-0 items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-orange-500" />

          <div className="min-w-0">
            <p className="font-medium text-gray-900">
              {isLoading
                ? "Loading addresses..."
                : selectedAddress
                  ? selectedAddress.isDefault
                    ? "Default Address"
                    : "Selected Address"
                  : selectedAddressId === "new"
                    ? "Add a new address"
                    : "Choose a delivery address"}
            </p>

            <p className="truncate text-sm text-gray-500">
              {selectedAddress
                ? `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "Click to select a saved address"}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded address list */}
      {isOpen && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          {addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((address) => {
                const isSelected =
                  selectedAddressId === address.addressId;

                return (
                  <button
                    key={address.addressId}
                    type="button"
                    onClick={() => handleSelect(address.addressId)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {address.addressLine1}
                          </span>

                          {address.isDefault && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                              Default
                            </span>
                          )}
                        </div>

                        {address.addressLine2 && (
                          <p className="mt-1 text-sm text-gray-600">
                            {address.addressLine2}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-gray-600">
                          {address.city}, {address.state},{" "}
                          {address.postalCode}
                        </p>

                        <p className="text-sm text-gray-600">
                          {address.country}
                        </p>
                      </div>

                      <span
                        className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500 ring-2 ring-orange-100"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="py-3 text-center text-sm text-gray-500">
              No saved addresses available.
            </p>
          )}

          {/* Add new address */}
          <button
            type="button"
            onClick={() => handleSelect("new")}
            className={`flex w-full items-center gap-2 rounded-lg border border-dashed p-4 text-sm font-medium transition ${
              selectedAddressId === "new"
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600"
            }`}
          >
            <Plus className="h-5 w-5" />
            Add New Address
          </button>
        </div>
      )}
    </div>
  );
}
