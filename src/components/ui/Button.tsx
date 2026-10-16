"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  ButtonVariant,
  type ButtonVariant as ButtonVariantType,
} from "@/constants/button-variants";

interface ButtonProps {
  variant?: ButtonVariantType;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  form?: string;
  ariaLabel?: string;
  href?: string;
}

const baseStyles =
  "inline-flex shrink-0 items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2";

const variantStyles: Record<ButtonVariantType, string> = {
  [ButtonVariant.Primary]:
    "min-h-11 w-full rounded-lg bg-orange-500 px-5 py-2.5 text-sm text-white hover:bg-orange-600",

  [ButtonVariant.Secondary]:
    "min-h-11 w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-800 hover:bg-gray-100",

  [ButtonVariant.Outline]:
    "min-h-11 w-full rounded-lg border border-orange-500 bg-white px-5 py-2.5 text-sm text-orange-600 hover:bg-orange-500 hover:text-white",

  [ButtonVariant.Danger]:
    "min-h-11 w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-700",

  [ButtonVariant.Order]:
    "mt-4 min-h-10 w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700",

  [ButtonVariant.QuantityAction]:
    "h-9 w-9 rounded-md bg-orange-500 text-base text-white hover:bg-orange-600",

  [ButtonVariant.Quantity]:
    "h-9 min-w-10 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-900",

  [ButtonVariant.Compact]:
    "min-h-9 rounded-lg px-3 py-2 text-sm text-orange-600 hover:bg-orange-50",
};

export default function Button({
  variant = ButtonVariant.Primary,
  type = "button",
  children,
  disabled = false,
  onClick,
  className = "",
  form,
  ariaLabel,
  href,
}: ButtonProps) {
  const combinedClassName = `${baseStyles} ${
    variantStyles[variant]
  } ${className} ${
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
  }`;

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
        className={combinedClassName}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      form={form}
      aria-label={ariaLabel}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
