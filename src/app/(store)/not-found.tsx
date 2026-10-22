"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <ShoppingBag className="h-10 w-10 text-orange-600" />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
          Page not found
        </p>

        <h1 className="mt-3 text-7xl font-extrabold text-gray-900">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Oops! This page is missing.
        </h2>

        <p className="mt-3 text-gray-600">
          The page you are looking for may have been moved, removed, or is
          temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            <Search className="h-5 w-5" />
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}