import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyWishlist = () => {
 const navigate = useNavigate();
 return (
 <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-[32px] border-2 border-dashed bg-white/50 /50 min-h-[50vh]">
 <div className="h-24 w-24 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-8 relative">
 <Heart className="h-12 w-12 text-red-500 animate-pulse" fill="currentColor" />
 <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl -z-10" />
 </div>
 <h3 className="text-3xl font-black mb-3 text-[#111827] dark:text-white tracking-tight">Your Wishlist is Empty</h3>
 <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
 Save your favorite products to buy later. Explore our shop to find something you love.
 </p>
 <Button 
 size="lg" 
 className="rounded-full px-10 h-14 text-[16px] font-bold bg-[#FF6B00] hover:bg-[#E65C00] text-white shadow-[0_8px_25px_rgba(255,107,0,0.25)] hover:-translate-y-1 transition-all duration-300 border-0"
 onClick={() => navigate('/products')}
 >
 Continue Shopping
 </Button>
 </div>
 );
};
