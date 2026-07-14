import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const FloatingCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount, grandTotal } = useCartStore();
  const organization = useOrganizationStore((state) => state.organization);
  const currency = organization?.currency || '₹';

  const hideRoutes = ['/', '/cart', '/checkout', '/payment', '/order-success', '/orders'];
  if (hideRoutes.includes(location.pathname)) return null;

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
            className="bg-[#FF6B00] backdrop-blur-md shadow-[0_8px_32px_rgba(255,107,0,0.35)] rounded-full w-full max-w-sm sm:max-w-md p-3 pl-5 pointer-events-auto cursor-pointer flex items-center justify-between border border-white/20 hover:bg-[#E65C00] transition-all duration-200 hover:scale-[1.02]"
          >
            {/* Left: icon + count + price */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center relative shrink-0">
                <ShoppingBag className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-[#FF6B00] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              </div>
              <div className="flex flex-col text-white">
                <span className="text-[11px] font-semibold opacity-80 leading-none">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </span>
                <span className="text-[18px] font-black leading-tight tracking-tight">
                  {currency}{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: View Cart pill */}
            <div className="h-11 px-5 bg-white text-[#FF6B00] rounded-full flex items-center justify-center font-bold text-[14px] gap-1.5 shadow-sm shrink-0">
              View Cart <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
