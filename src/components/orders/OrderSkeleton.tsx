import { Skeleton } from '@/components/ui/skeleton';

export const OrderSkeleton = () => (
 <div className="space-y-4">
 {[1, 2, 3, 4].map((i) => (
 <div key={i} className="bg-white rounded-3xl border p-6 space-y-4">
 <div className="flex justify-between items-start">
 <div className="space-y-2">
 <Skeleton className="h-5 w-32" />
 <Skeleton className="h-4 w-24" />
 </div>
 <Skeleton className="h-7 w-24 rounded-full" />
 </div>
 <div className="flex gap-3">
 <Skeleton className="h-6 w-20 rounded-full" />
 <Skeleton className="h-6 w-16 rounded-full" />
 </div>
 <div className="flex justify-between items-center pt-2 border-t">
 <Skeleton className="h-5 w-28" />
 <div className="flex gap-2">
 <Skeleton className="h-9 w-24 rounded-full" />
 <Skeleton className="h-9 w-28 rounded-full" />
 </div>
 </div>
 </div>
 ))}
 </div>
);
