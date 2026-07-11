import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyOrders = () => {
 const navigate = useNavigate();
 return (
 <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border-2 border-dashed bg-white/50 backdrop-blur-sm">
 <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
 <Package className="h-10 w-10 text-primary" />
 </div>
 <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">No Orders Yet</h3>
 <p className="text-muted-foreground max-w-sm mb-8 text-base">
 You haven't placed any orders. Start shopping to see your orders here.
 </p>
 <Button
 className="rounded-full px-10 shadow-premium"
 size="lg"
 onClick={() => navigate('/')}
 >
 Start Shopping
 </Button>
 </div>
 );
};
