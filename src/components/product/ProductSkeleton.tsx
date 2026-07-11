
export const ProductSkeleton = () => {
 return (
 <div className="w-full flex flex-col min-h-screen">
 {/* Filters Skeleton */}
 <div className="w-full bg-background border-b border-[#E5E7EB] dark:border-white/10">
 <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-4">
 <div className="h-14 w-full bg-[#E5E7EB] dark:bg-slate-800 rounded-full animate-pulse" />
 <div className="flex gap-3 overflow-hidden py-2">
 {[...Array(6)].map((_, i) => (
 <div key={i} className="h-10 w-24 bg-[#E5E7EB] dark:bg-slate-800 rounded-full animate-pulse shrink-0" />
 ))}
 </div>
 </div>
 </div>

 {/* Grid Skeleton */}
 <div className="w-full py-10 bg-background">
 <div className="max-w-7xl mx-auto px-4 md:px-8">
 <div className="h-8 w-48 bg-[#E5E7EB] dark:bg-slate-800 rounded animate-pulse mb-8" />
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
 {[...Array(8)].map((_, i) => (
 <div key={i} className="bg-white rounded-3xl border border-[#E5E7EB] h-[400px] overflow-hidden flex flex-col">
 <div className="w-full aspect-[4/3] bg-[#E5E7EB] dark:bg-slate-800 animate-pulse" />
 <div className="p-5 flex flex-col gap-3 flex-1">
 <div className="h-5 w-3/4 bg-[#E5E7EB] dark:bg-slate-800 rounded animate-pulse" />
 <div className="h-4 w-full bg-[#E5E7EB] dark:bg-slate-800 rounded animate-pulse" />
 <div className="h-4 w-2/3 bg-[#E5E7EB] dark:bg-slate-800 rounded animate-pulse" />
 <div className="mt-auto flex justify-between items-end">
 <div className="h-6 w-20 bg-[#E5E7EB] dark:bg-slate-800 rounded animate-pulse" />
 <div className="h-10 w-24 bg-[#E5E7EB] dark:bg-slate-800 rounded-full animate-pulse" />
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
};
