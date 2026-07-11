import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyAddressProps {
 onAddAddress: () => void;
}

export const EmptyAddress = ({ onAddAddress }: EmptyAddressProps) => {
 return (
 <div className="flex flex-col items-center justify-center p-12 text-center border rounded-3xl bg-white/50 backdrop-blur-sm border-dashed">
 <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
 <MapPin className="h-8 w-8 text-primary" />
 </div>
 <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
 No Saved Addresses
 </h3>
 <p className="text-muted-foreground max-w-sm mb-8">
 You haven't added any addresses yet. Add a new address to speed up checkout.
 </p>
 <Button onClick={onAddAddress} className="rounded-full px-8 shadow-premium" size="lg">
 Add Address
 </Button>
 </div>
 );
};
