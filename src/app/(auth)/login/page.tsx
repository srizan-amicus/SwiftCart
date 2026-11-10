import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Login",
  description:
    "Sign in to your SwiftCart account to manage your profile, shop products, and track your orders.",
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Loading sign-in form...</p>
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
