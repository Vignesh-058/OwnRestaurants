import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

interface SkeletonLoaderProps {
 variant?: 'card' | 'list' | 'text' | 'avatar' | 'banner' | 'product' | 'category';
 count?: number;
 className?: string;
}

const CardSkeleton = () => (
 <div className="rounded-3xl border p-6 space-y-4 bg-white">
 <div className="flex justify-between">
 <Skeleton className="h-6 w-2/5" />
 <Skeleton className="h-6 w-1/5 rounded-full" />
 </div>
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-3/4" />
 <Skeleton className="h-10 w-full rounded-full" />
 </div>
);

const ProductSkeleton = () => (
 <div className="rounded-3xl border overflow-hidden bg-white">
 <Skeleton className="h-48 w-full rounded-none" />
 <div className="p-4 space-y-3">
 <Skeleton className="h-5 w-3/4" />
 <Skeleton className="h-4 w-1/2" />
 <div className="flex justify-between items-center">
 <Skeleton className="h-6 w-1/3" />
 <Skeleton className="h-9 w-9 rounded-full" />
 </div>
 </div>
 </div>
);

const CategorySkeleton = () => (
 <div className="flex flex-col items-center gap-3">
 <Skeleton className="h-16 w-16 rounded-2xl" />
 <Skeleton className="h-4 w-14" />
 </div>
);

const BannerSkeleton = () => (
 <Skeleton className="h-48 sm:h-64 w-full rounded-3xl" />
);

const ListItemSkeleton = () => (
 <div className="flex items-center gap-4 py-3">
 <Skeleton className="h-12 w-12 rounded-full shrink-0" />
 <div className="flex-1 space-y-2">
 <Skeleton className="h-4 w-3/4" />
 <Skeleton className="h-3 w-1/2" />
 </div>
 </div>
);

const AvatarSkeleton = () => (
 <div className="flex items-center gap-4">
 <Skeleton className="h-16 w-16 rounded-full" />
 <div className="space-y-2">
 <Skeleton className="h-5 w-32" />
 <Skeleton className="h-4 w-24" />
 </div>
 </div>
);

const TextSkeleton = () => (
 <div className="space-y-2">
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-5/6" />
 <Skeleton className="h-4 w-4/6" />
 </div>
);

const VARIANTS = {
 card: CardSkeleton,
 product: ProductSkeleton,
 category: CategorySkeleton,
 banner: BannerSkeleton,
 list: ListItemSkeleton,
 avatar: AvatarSkeleton,
 text: TextSkeleton,
};

const GRID_CLASSES: Record<string, string> = {
 product: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
 category: 'flex flex-wrap gap-6',
 card: 'space-y-4',
 list: 'divide-y',
 banner: 'space-y-4',
 avatar: 'space-y-4',
 text: 'space-y-6',
};

export const SkeletonLoader = ({
 variant = 'card',
 count = 4,
 className,
}: SkeletonLoaderProps) => {
 const Item = VARIANTS[variant];
 const grid = GRID_CLASSES[variant] ?? 'space-y-4';

 return (
 <div className={cn(grid, className)} aria-busy="true" aria-label="Loading...">
 {Array.from({ length: count }).map((_, i) => (
 <Item key={i} />
 ))}
 </div>
 );
};
