interface DashboardSkeletonProps {
  cards?: number;
  showOrders?: boolean;
}

export default function DashboardSkeleton({
  cards = 3,
  showOrders = false,
}: DashboardSkeletonProps) {
  return (
    <div
      aria-label="Loading dashboard content"
      aria-busy="true"
      className="space-y-5"
    >
      {cards > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: cards }, (_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-24 rounded-md bg-gray-200" />
                  <div className="h-8 w-20 rounded-md bg-gray-200" />
                  <div className="h-3 w-32 rounded-md bg-gray-100" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-orange-100" />
              </div>
              <div className="mt-6 h-4 w-24 rounded-md bg-orange-100" />
            </div>
          ))}
        </div>
      )}

      {showOrders && (
        <section className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-28 rounded-md bg-orange-100" />
            <div className="h-6 w-40 rounded-md bg-gray-200" />
            <div className="h-3 w-56 max-w-full rounded-md bg-gray-100" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <article
                key={index}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-orange-100" />

                    <div className="space-y-3 pt-1">
                      <div className="h-4 w-28 rounded-md bg-gray-200" />
                      <div className="h-3 w-36 rounded-md bg-gray-100" />
                      <div className="h-6 w-16 rounded-full bg-orange-100" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:justify-end sm:border-0 sm:pt-0">
                    <div className="space-y-2 sm:text-right">
                      <div className="h-3 w-20 rounded-md bg-gray-100" />
                      <div className="h-5 w-28 rounded-md bg-gray-200" />
                    </div>
                    <div className="h-10 w-10 shrink-0 rounded-xl border border-gray-100 bg-gray-100" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
