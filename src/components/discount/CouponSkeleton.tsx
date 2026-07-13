import { Skeleton } from '@/components/ui/skeleton';

export const CouponSkeleton = () => (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="rounded-3xl overflow-hidden border">
 <div className="h-2 bg-gradient-to-r from-primary/30 to-primary/10" />
 <div className="p-6 space-y-4">
 <div className="flex justify-between items-start">
 <Skeleton className="h-8 w-24 rounded-xl" />
 <Skeleton className="h-6 w-20 rounded-full" />
 </div>
 <Skeleton className="h-5 w-3/4" />
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-2/3" />
 <div className="pt-2 border-t flex gap-3">
 <Skeleton className="h-4 w-24" />
 <Skeleton className="h-4 w-20" />
 </div>
 <Skeleton className="h-10 w-full rounded-full" />
 </div>
 </div>
 ))}
 </div>
);
