import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyOrders = () => {
 return (
 <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
 <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
 <PackageSearch className="w-12 h-12 text-primary" />
 </div>
 <h3 className="text-2xl font-black text-foreground mb-2">No Orders Yet</h3>
 <p className="text-muted-foreground font-medium mb-8 max-w-sm">
 Looks like you haven't placed any orders yet. Discover our amazing menu and start your first order!
 </p>
 <Button className="rounded-full px-8 h-14 text-lg font-bold shadow-premium" asChild>
 <Link to="/shop">Browse Menu</Link>
 </Button>
 </div>
 );
};
