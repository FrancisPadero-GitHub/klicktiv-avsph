import { Skeleton } from "@/components/ui/skeleton";

function SettingsSkeleton() {
  return (
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
  );
}

export default SettingsSkeleton;
