import { Skeleton } from '@/components/ui/skeleton';

export const BannerSkeleton = () => (
 <div className="w-full max-w-7xl mx-auto px-4 mt-6">
 <Skeleton className="w-full h-[220px] md:h-[420px] rounded-3xl" />
 </div>
);

export const CategoryListSkeleton = () => (
 <div className="w-full max-w-7xl mx-auto px-4 my-6 overflow-hidden">
 <div className="flex gap-4">
 {Array.from({ length: 6 }).map((_, i) => (
 <Skeleton key={i} className="flex-none w-24 h-10 sm:w-32 sm:h-12 rounded-full" />
 ))}
 </div>
 </div>
);

export const ProductGridSkeleton = () => (
 <div className="w-full max-w-7xl mx-auto px-4">
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="flex flex-col gap-3 rounded-2xl border p-4">
 <Skeleton className="w-full aspect-square rounded-xl" />
 <Skeleton className="w-3/4 h-5" />
 <Skeleton className="w-1/2 h-4" />
 <div className="mt-4 flex justify-between items-center">
 <Skeleton className="w-1/3 h-6" />
 <Skeleton className="w-10 h-10 rounded-full" />
 </div>
 </div>
 ))}
 </div>
 </div>
);
