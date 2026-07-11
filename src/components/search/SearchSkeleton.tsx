import { Skeleton } from '@/components/ui/skeleton';

export const SearchSkeleton = () => (
 <div className="space-y-8">
 {/* Search bar */}
 <Skeleton className="h-14 w-full rounded-full" />
 {/* Chips row */}
 <div className="flex gap-3">
 {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
 </div>
 {/* Results grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="rounded-3xl border overflow-hidden">
 <Skeleton className="aspect-[4/3] w-full rounded-none" />
 <div className="p-4 space-y-3">
 <Skeleton className="h-4 w-3/4" />
 <Skeleton className="h-3 w-1/2" />
 <div className="flex justify-between items-center">
 <Skeleton className="h-5 w-1/3" />
 <Skeleton className="h-9 w-16 rounded-full" />
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
);
