"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import useLocationOptions from "@/hooks/useLocationOptions";
import type { CheckoutSchemaInput } from "@/lib/validations/checkout-schema";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const labelClass = "block text-sm font-semibold text-gray-800";

export default function ShippingFields() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutSchemaInput>();

  const {
    countries,
    states,
    cities,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    error: locationError,
    fetchStates,
    fetchCities,
    clearStates,
    clearCities,
  } = useLocationOptions();

  const country = useWatch({ control, name: "country" });
  const state = useWatch({ control, name: "state" });
  const city = useWatch({ control, name: "city" });

  // Load states whenever the selected country changes.
  useEffect(() => {
    if (country) {
      void fetchStates(country);
    } else {
      clearStates();
    }
  }, [country, fetchStates, clearStates]);

  // Load cities whenever the selected state changes.
  useEffect(() => {
    if (country && state) {
      void fetchCities(country, state);
    } else {
      clearCities();
    }
  }, [country, state, fetchCities, clearCities]);
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Full Name */}
      <div className="sm:col-span-2">
        <label htmlFor="fullName" className={labelClass}>
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          className={inputClass}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="10-digit phone number"
          className={inputClass}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Street Address */}
      <div className="sm:col-span-2">
        <label htmlFor="streetAddress" className={labelClass}>
          Street Address *
        </label>
        <input
          id="streetAddress"
          type="text"
          autoComplete="address-line1"
          placeholder="House number and street name"
          className={inputClass}
          {...register("streetAddress")}
        />
        {errors.streetAddress && (
          <p className="mt-1 text-xs text-red-600">
            {errors.streetAddress.message}
          </p>
        )}
      </div>

      {/* Apartment */}
      <div className="sm:col-span-2">
        <label htmlFor="apartment" className={labelClass}>
          Apartment, Suite, etc. (Optional)
        </label>
        <input
          id="apartment"
          type="text"
          autoComplete="address-line2"
          placeholder="Apartment, suite, unit, etc."
          className={inputClass}
          {...register("apartment")}
        />
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className={labelClass}>
          Country *
        </label>
        <select
          id="country"
          className={inputClass}
          disabled={isLoadingCountries}
          value={country ?? ""}
          onChange={(event) => {
            setValue("country", event.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setValue("state", "", {
              shouldValidate: true,
              shouldDirty: true,
            });

            setValue("city", "", {
              shouldValidate: true,
              shouldDirty: true,
            });

            clearStates();
          }}
        >
          <option value="">
            {isLoadingCountries ? "Loading countries..." : "Select country"}
          </option>

          {country && !countries.some((item) => item.country === country) && (
            <option value={country}>{country}</option>
          )}

          {countries.map((item) => (
            <option key={item.iso2} value={item.country}>
              {item.country}
            </option>
          ))}
        </select>

        {errors.country && (
          <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label htmlFor="state" className={labelClass}>
          State *
        </label>
        <select
          id="state"
          className={inputClass}
          disabled={!country || isLoadingStates}
          value={state ?? ""}
          onChange={(event) => {
            setValue("state", event.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setValue("city", "", {
              shouldValidate: true,
              shouldDirty: true,
            });

            clearCities();
          }}
        >
          <option value="">
            {isLoadingStates ? "Loading states..." : "Select state"}
          </option>

          {state && !states.includes(state) && (
            <option value={state}>{state}</option>
          )}

          {states.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {errors.state && (
          <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className={labelClass}>
          City *
        </label>
        <select
          id="city"
          className={inputClass}
          disabled={!state || isLoadingCities}
          value={city ?? ""}
          onChange={(event) => {
            setValue("city", event.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        >
          <option value="">
            {isLoadingCities ? "Loading cities..." : "Select city"}
          </option>

          {city && !cities.includes(city) && (
            <option value={city}>{city}</option>
          )}

          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {errors.city && (
          <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
        )}
      </div>

      {/* ZIP / Postal Code */}
      <div>
        <label htmlFor="zip" className={labelClass}>
          ZIP / Postal Code *
        </label>
        <input
          id="zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter postal code"
          className={inputClass}
          {...register("zip")}
        />
        {errors.zip && (
          <p className="mt-1 text-xs text-red-600">{errors.zip.message}</p>
        )}
      </div>

      {/* Location API Error */}
      {locationError && (
        <p role="alert" className="sm:col-span-2 text-xs text-red-600">
          {locationError}
        </p>
      )}
    </div>
  );
}
