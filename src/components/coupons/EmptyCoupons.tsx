import { Gift } from 'lucide-react';

export const EmptyCoupons = () => (
 <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border-2 border-dashed bg-white/50">
 <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
 <Gift className="h-10 w-10 text-primary" />
 </div>
 <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">No Offers Available</h3>
 <p className="text-muted-foreground max-w-sm text-base">
 There are no active coupons or offers at the moment. Please check back later!
 </p>
 </div>
);
