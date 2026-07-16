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

  const hideRoutes = ['/', '/cart', '/checkout', '/payment', '/order-success']; // removed /orders and /profile/orders to allow Repeat Order to show it
  if (hideRoutes.some(route => location.pathname === route || location.pathname.startsWith('/profile') && !location.pathname.includes('orders'))) return null;

  const itemCount = cartItemCount;
  const totalAmount = grandTotal;

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          key="floating-cart-container"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed left-4 right-4 md:left-auto md:right-6 z-40 pointer-events-none flex justify-center md:justify-end transition-all duration-300"
          style={{ bottom: 'max(1.5rem, calc(1rem + var(--floating-nav-height, 0px)))' }}
        >
          <div
            onClick={() => navigate('/cart')}
            className="bg-primary backdrop-blur-md shadow-[0_8px_32px_rgba(255,107,0,0.35)] rounded-full w-full max-w-[400px] md:w-auto py-1.5 px-2.5 md:p-3 md:pr-3 md:pl-5 pointer-events-auto cursor-pointer flex items-center justify-between border border-white/20 hover:bg-primary transition-all duration-200 hover:scale-[1.02] gap-2 md:gap-6"
          >
            {/* Left: icon + count + price */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-white/20 rounded-full flex items-center justify-center relative shrink-0">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-white" />
                <span className="absolute -top-0.5 -right-0.5 h-[14px] w-[14px] md:h-5 md:w-5 bg-white text-primary text-[9px] md:text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              </div>
              <div className="flex flex-col text-white min-w-0">
                <span className="text-[11px] md:text-[11px] font-semibold opacity-80 leading-none truncate">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
                <span className="text-[15px] md:text-[18px] font-black leading-tight tracking-tight truncate">
                  {currency}{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: View Cart pill */}
            <div className="h-[34px] md:h-11 px-3.5 md:px-5 bg-white text-primary rounded-full flex items-center justify-center font-bold text-[12px] md:text-[14px] gap-1 md:gap-1.5 shadow-sm shrink-0 whitespace-nowrap min-w-[44px]">
              <span className="hidden md:inline">View Cart</span>
              <span className="md:hidden">Cart</span>
              <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
