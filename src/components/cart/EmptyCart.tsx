import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyCart = () => {
 const navigate = useNavigate();

 return (
 <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card rounded-3xl border border-border shadow-sm min-h-[50vh]">
 <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8 relative">
 <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
 <ShoppingBag className="w-16 h-16 text-primary" />
 </div>
 <h2 className="text-3xl font-black mb-3 text-foreground">Your cart is empty</h2>
 <p className="text-muted-foreground mb-10 max-w-sm text-lg">
 Looks like you haven't added anything to your cart yet. Let's fix that!
 </p>
 <Button 
 onClick={() => navigate('/shop')} 
 size="lg" 
 className="rounded-full px-12 h-14 text-lg font-bold shadow-premium hover:shadow-premium-hover transition-all"
 >
 Browse Menu
 </Button>
 </div>
 );
};
