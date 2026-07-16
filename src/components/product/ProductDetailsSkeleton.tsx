export const ProductDetailsSkeleton = () => {
 return (
 <div className="w-full flex flex-col min-h-screen bg-background">
 <div className="w-full aspect-[4/3] md:aspect-auto md:h-[400px] bg-border dark:bg-slate-800 animate-pulse relative">
 <div className="absolute bottom-4 left-4 w-3/4 h-8 bg-black/10 rounded animate-pulse" />
 </div>
 <div className="flex-1 p-6 space-y-8">
 <div className="space-y-4">
 <div className="flex justify-between items-center">
 <div className="w-1/3 h-6 bg-border dark:bg-slate-800 rounded animate-pulse" />
 <div className="w-16 h-6 bg-border dark:bg-slate-800 rounded-full animate-pulse" />
 </div>
 <div className="w-full h-16 bg-border dark:bg-slate-800 rounded-2xl animate-pulse" />
 <div className="w-full h-16 bg-border dark:bg-slate-800 rounded-2xl animate-pulse" />
 </div>

 <div className="space-y-4">
 <div className="w-1/4 h-6 bg-border dark:bg-slate-800 rounded animate-pulse" />
 <div className="w-full h-16 bg-border dark:bg-slate-800 rounded-2xl animate-pulse" />
 <div className="w-full h-16 bg-border dark:bg-slate-800 rounded-2xl animate-pulse" />
 </div>
 </div>
 <div className="border-t border-border bg-white p-4 flex gap-4 h-24">
 <div className="w-1/3 h-full bg-border dark:bg-slate-800 rounded-2xl animate-pulse" />
 <div className="w-2/3 h-full bg-border dark:bg-slate-800 rounded-full animate-pulse" />
 </div>
 </div>
 );
};
