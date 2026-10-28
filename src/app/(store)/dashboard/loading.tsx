import DashboardSkeleton from "./_components/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome section skeleton */}
        <section className="animate-pulse overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-4">
              <div className="h-3 w-28 rounded bg-orange-100" />
              <div className="h-8 w-64 max-w-full rounded-lg bg-gray-200" />
              <div className="h-4 w-80 max-w-full rounded bg-gray-100" />
            </div>

            <div className="h-12 w-36 rounded-xl bg-orange-100" />
          </div>
        </section>

        {/* Account summary skeleton */}
        <section className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-28 rounded bg-orange-100" />
            <div className="h-6 w-44 rounded bg-gray-200" />
          </div>

          <DashboardSkeleton cards={3} />
        </section>

        {/* Recent orders skeleton */}
        <DashboardSkeleton cards={0} showOrders />
      </div>
    </main>
  );
}
