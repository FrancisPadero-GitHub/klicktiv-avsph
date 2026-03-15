import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r p-4 flex flex-col gap-6">
        {/* Logo */}
        <Skeleton className="h-8 w-32" />

        {/* Nav items */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-1.5">
              <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>

        {/* Bottom user */}
        <div className="mt-auto flex items-center gap-3 px-2">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-2.5 w-3/5" />
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 shrink-0 border-b px-6 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Page title */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-72" />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-4 space-y-3">
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-7 w-2/5" />
                <Skeleton className="h-2.5 w-4/5" />
              </div>
            ))}
          </div>

          {/* Chart + sidebar panel */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="col-span-2 rounded-xl border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="flex items-end gap-2 h-40">
                {[60, 80, 45, 95, 70, 55, 100, 75, 85, 50, 65, 40].map(
                  (h, i) => (
                    <Skeleton
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
              <div className="flex justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-2.5 w-7" />
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-4">
              <Skeleton className="h-4 w-2/5" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-2.5 w-3/5" />
                  </div>
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-4 gap-4 border-b pb-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-2.5 w-3/5" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" />
                </div>
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-5 w-3/5 rounded-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
