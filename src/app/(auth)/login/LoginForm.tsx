
"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { loginAction } from "@/app/(auth)/actions";

const initialState = {
  error: null as string | null,
};

export default function LoginForm() {
  const searchParams = useSearchParams();

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);

  const returnTo = searchParams.get("returnTo") ?? "/";
  const isRegistered = searchParams.get("registered") === "1";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your SwiftCart account.
        </p>
      </div>

      {isRegistered && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          Account created successfully. Please sign in.
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don &apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          Create one
        </Link>
      </p>
    </section>
  );
}
