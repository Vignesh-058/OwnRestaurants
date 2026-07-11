import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CartSkeleton = () => {
 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] flex flex-col">
 <div className="flex items-center space-x-4 mb-8">
 <Button variant="ghost" size="icon" disabled className="rounded-full">
 <ArrowLeft className="w-5 h-5 text-muted-foreground" />
 </Button>
 <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
 </div>

 <div className="flex flex-col lg:flex-row gap-8">
 <div className="flex-1 space-y-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="flex gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm items-start">
 <div className="w-24 h-24 sm:w-28 sm:h-28 bg-muted rounded-2xl animate-pulse flex-shrink-0"></div>
 <div className="flex-1 space-y-3 py-1">
 <div className="flex justify-between items-start">
 <div className="h-6 w-1/2 bg-muted rounded animate-pulse"></div>
 <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
 </div>
 <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
 <div className="h-4 w-1/3 bg-muted rounded animate-pulse mt-2"></div>
 <div className="flex justify-between items-center mt-4">
 <div className="h-10 w-28 bg-muted rounded-xl animate-pulse"></div>
 <div className="h-10 w-10 bg-muted rounded-xl animate-pulse"></div>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="w-full lg:w-96 flex-shrink-0">
 <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
 <div className="h-7 w-40 bg-muted rounded animate-pulse mb-6"></div>
 
 <div className="space-y-4 mb-6">
 <div className="flex justify-between">
 <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
 <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
 </div>
 <div className="flex justify-between">
 <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
 <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
 </div>
 <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
 <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
 <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
 </div>
 </div>

 <div className="h-14 w-full bg-muted rounded-2xl animate-pulse"></div>
 </div>
 </div>
 </div>
 </div>
 );
};
