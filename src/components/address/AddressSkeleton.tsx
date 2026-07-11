import { Skeleton } from '@/components/ui/skeleton';

export const AddressSkeleton = () => {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
 {[1, 2, 3, 4].map((i) => (
 <div key={i} className="p-6 rounded-3xl border bg-white flex flex-col gap-4">
 <div className="flex justify-between items-start">
 <Skeleton className="h-6 w-24 rounded-full" />
 <Skeleton className="h-4 w-4 rounded-full" />
 </div>
 <Skeleton className="h-5 w-32" />
 <div className="space-y-2">
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-3/4" />
 </div>
 <div className="pt-4 flex gap-2">
 <Skeleton className="h-9 flex-1 rounded-full" />
 <Skeleton className="h-9 w-20 rounded-full" />
 </div>
 </div>
 ))}
 </div>
 );
};
