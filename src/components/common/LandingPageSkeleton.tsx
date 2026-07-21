import { Skeleton } from '@/components/ui/skeleton';

export const LandingPageSkeleton = () => {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Navbar Skeleton */}
      <div className="h-[80px] w-full bg-[#FFFFFF] border-b border-[#FFE2CC] shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full hidden sm:block" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        {/* Hero Banner Skeleton */}
        <Skeleton className="w-full h-[200px] md:h-[400px] rounded-[24px]" />

        {/* Categories Skeleton */}
        <div className="w-full">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 w-20 md:h-32 md:w-28 rounded-2xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Featured Products Skeleton */}
        <div className="w-full">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
