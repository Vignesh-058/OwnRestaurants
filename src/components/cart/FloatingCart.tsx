import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const FloatingCart = () => {
 const navigate = useNavigate();
  const { cartItemCount, grandTotal } = useCartStore();
 const organization = useOrganizationStore((state) => state.organization);
 const currency = organization?.currency || '₹';

 const itemCount = cartItemCount;
 const totalAmount = grandTotal;

 return (
 <AnimatePresence>
 {itemCount > 0 && (
 <motion.div
 initial={{ y: 100, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 100, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 260, damping: 20 }}
 className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center"
 >
 <div 
 onClick={() => navigate('/cart')}
 className="bg-[#FF6B00]/95 backdrop-blur-md shadow-2xl rounded-full w-full max-w-sm sm:max-w-md p-2 pl-6 pointer-events-auto cursor-pointer flex items-center justify-between border border-[#FF6B00]/20 hover:scale-[1.02] transition-transform duration-300"
 >
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center relative">
 <ShoppingBag className="h-5 w-5 text-white" />
 <span className="absolute -top-1 -right-1 h-5 w-5 bg-background text-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
 {itemCount}
 </span>
 </div>
 <div className="flex flex-col text-white">
 <span className="text-sm font-semibold opacity-90">View Cart</span>
 <span className="text-lg font-bold leading-none">{currency}{totalAmount.toLocaleString()}</span>
 </div>
 </div>
 
 <div className="h-12 px-6 bg-white text-[#FF6B00] rounded-full flex items-center justify-center font-bold gap-2 shadow-sm">
 Checkout <ArrowRight className="h-4 w-4" />
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
};
