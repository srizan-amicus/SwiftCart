
"use client";

interface ErrorContentProps {
  reset: () => void;
}

export default function ErrorContent({ reset }: ErrorContentProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <span className="text-4xl font-bold text-orange-600">!</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          An unexpected error occurred. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
