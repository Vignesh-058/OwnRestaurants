import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ProfileSkeleton = () => {
 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
 <div className="flex flex-col lg:flex-row gap-8">
 
 {/* Sidebar Skeleton */}
 <div className="w-full lg:w-[320px] shrink-0 space-y-6">
 <Card className="rounded-3xl border-border/50">
 <CardContent className="p-4 space-y-2">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="flex items-center p-4">
 <Skeleton className="h-12 w-12 rounded-full mr-4" />
 <div className="space-y-2 flex-1">
 <Skeleton className="h-5 w-32" />
 <Skeleton className="h-3 w-48" />
 </div>
 </div>
 ))}
 </CardContent>
 </Card>
 </div>

 {/* Main Content Skeleton */}
 <div className="flex-1 space-y-8 min-w-0">
 {/* Header Skeleton */}
 <Card className="rounded-3xl border-border/50 h-[220px] overflow-hidden">
 <CardContent className="pt-16 pb-8 px-6 sm:px-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
 <Skeleton className="h-28 w-28 rounded-full border-4 border-background" />
 <div className="flex-1 space-y-4 w-full pt-2">
 <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
 <div className="flex gap-4 justify-center sm:justify-start">
 <Skeleton className="h-4 w-32" />
 <Skeleton className="h-4 w-40" />
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Stats Skeleton */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {[1, 2, 3].map((i) => (
 <Card key={i} className="rounded-3xl border-border/50">
 <CardContent className="p-6 flex flex-col items-center justify-center">
 <Skeleton className="w-14 h-14 rounded-2xl mb-4" />
 <Skeleton className="h-8 w-20 mb-2" />
 <Skeleton className="h-3 w-24" />
 </CardContent>
 </Card>
 ))}
 </div>

 {/* Address Skeleton */}
 <Card className="rounded-3xl border-border/50">
 <CardHeader className="pb-4 px-8 pt-8">
 <Skeleton className="h-8 w-48 mb-2" />
 <Skeleton className="h-4 w-32" />
 </CardHeader>
 <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
 {[1, 2, 3].map((i) => (
 <Skeleton key={i} className="h-40 w-full rounded-2xl" />
 ))}
 </CardContent>
 </Card>
 </div>
 
 </div>
 </div>
 );
};
