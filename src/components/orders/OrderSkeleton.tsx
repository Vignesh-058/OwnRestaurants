import { Skeleton } from '@/components/ui/skeleton';

export const OrderSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-[#FFFFFF] border border-[#FFE2CC] rounded-2xl shadow-sm p-5 md:p-6 mb-4 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        {/* Left: Info */}
        <div className="flex flex-col gap-3 w-full md:w-1/4 shrink-0">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-20 rounded-full mt-1" />
        </div>

        {/* Center: Products */}
        <div className="flex-1 w-full border-t border-b md:border-y-0 md:border-x border-[#FFE2CC]/50 py-4 md:py-0 md:px-6 flex items-center">
          <div className="flex flex-wrap gap-4 items-center">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 md:items-end">
          <div className="flex justify-between md:flex-col md:items-end gap-2 w-full">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-2">
            <Skeleton className="h-10 w-[120px] rounded-lg" />
            <Skeleton className="h-10 w-[100px] rounded-lg hidden md:block" />
            <Skeleton className="h-10 w-[100px] rounded-lg hidden md:block" />
          </div>
        </div>

      </div>
    ))}
  </div>
);
