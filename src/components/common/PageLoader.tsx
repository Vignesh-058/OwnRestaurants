import { Loader2 } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const PageLoader = () => {
 const brandName = useOrganizationStore((state) => state.organization?.brandName) || 'Loading...';
 
 return (
 <div className="min-h-screen bg-background flex flex-col items-center justify-center">
 <div className="relative flex flex-col items-center">
 {/* Pulse rings */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="h-24 w-24 bg-info/20 rounded-full animate-ping" />
 </div>
 
 {/* Core spinner */}
 <div className="relative bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl mb-6">
 <Loader2 className="h-10 w-10 text-info animate-spin" />
 </div>
 
 {/* Text */}
 <h2 className="text-xl font-bold text-foreground dark:text-white animate-pulse">
 {brandName}
 </h2>
 <p className="text-sm text-muted-foreground mt-2 font-medium">
 Preparing your experience...
 </p>
 </div>
 </div>
 );
};
