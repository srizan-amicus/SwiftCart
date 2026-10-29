"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { loginAction } from "@/app/(auth)/actions";

const initialState = { error: null as string | null };

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>

      <p className="mt-2 text-sm text-gray-600">
        Sign in to your SwiftCart account.
      </p>

      {searchParams.get("registered") === "1" && (
        <p className="mt-4 text-sm text-green-700" role="status">
          Account created successfully. Please sign in.
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-5">
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
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              className="h-11 w-full rounded-lg border border-gray-300 py-2 pl-3 pr-12 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-gray-500 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
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
