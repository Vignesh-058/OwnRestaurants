import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const FloatingCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount, grandTotal, cartItems } = useCartStore();
  const organization = useOrganizationStore((state) => state.organization);
  const currency = (organization?.currency && organization.currency !== '$') ? organization.currency.replace(/\$/g, '') : '₹';

  const hideRoutes = ['/', '/cart', '/checkout', '/payment', '/order-success']; // removed /orders and /profile/orders to allow Repeat Order to show it
  if (hideRoutes.some(route => location.pathname === route || location.pathname.startsWith('/profile') && !location.pathname.includes('orders'))) return null;

  const itemCount = cartItemCount;
  const itemsCalculatedTotal = (cartItems || []).reduce((acc, item) => {
    const itemPrice = (item as any).price ?? (item as any).sellingPrice ?? (item as any).defaultSellingPrice ?? (item as any).basePrice ?? 0;
    return acc + (itemPrice * (item.quantity || 1));
  }, 0);
  const totalAmount = grandTotal > 0 ? grandTotal : itemsCalculatedTotal;

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          key="floating-cart-container"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed left-0 right-0 z-50 pointer-events-none flex justify-center transition-all duration-300 px-4 md:px-0"
          style={{ bottom: 'max(1.5rem, calc(1.5rem + var(--floating-nav-height, 0px)))' }}
        >
          <div
            onClick={() => navigate('/cart')}
            className="bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] rounded-full w-full max-w-[500px] p-2.5 md:p-3 pointer-events-auto cursor-pointer flex items-center justify-between border border-border/50 hover:scale-[1.02] gap-3 md:gap-4 transition-all duration-300"
          >
            {/* Left: icon + count + price */}
            <div className="flex items-center gap-3.5 md:gap-4 pl-2 md:pl-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <ShoppingBag className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <span className="absolute -top-1 -right-1 h-[22px] min-w-[22px] md:h-[24px] md:min-w-[24px] px-1 bg-primary text-white text-[12px] md:text-[13px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              </div>
              <div className="flex flex-col text-foreground min-w-0">
                <span className="text-[14px] md:text-[16px] font-bold opacity-80 leading-none truncate mb-1 md:mb-1.5">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'} <span className="text-muted-foreground mx-1.5">|</span> {currency}{totalAmount.toLocaleString()}
                </span>
                <span className="text-[11px] md:text-[13px] font-medium text-muted-foreground leading-tight tracking-tight truncate">
                  Extra charges may apply
                </span>
              </div>
            </div>

            {/* Right: View Cart CTA */}
            <div className="h-12 md:h-[52px] px-6 md:px-8 bg-primary hover:bg-primary-light text-white rounded-full flex items-center justify-center font-bold text-[14px] md:text-[16px] gap-2 md:gap-2.5 shadow-md shrink-0 whitespace-nowrap transition-colors">
              <span>View Cart</span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
