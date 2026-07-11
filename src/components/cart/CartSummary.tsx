import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/CartStore';
import { useNavigate } from 'react-router-dom';
import { CouponDialog } from '@/components/coupons/CouponDialog';
import { AppliedCoupon } from '@/components/coupons/AppliedCoupon';
import { useCouponStore } from '@/store/CouponStore';

interface CartSummaryProps {
 subTotal: number;
 tax: number;
 total: number;
 currency: string;
}

export const CartSummary = ({ subTotal, tax, total, currency }: CartSummaryProps) => {
 const navigate = useNavigate();
 const deliveryType = useCartStore(state => state.deliveryType);
 const { discountAmount, discountedTotal } = useCouponStore();
 const effectiveTotal = discountedTotal ?? (total - discountAmount);

 return (
 <div className="bg-card rounded-3xl p-6 border border-border shadow-sm sticky top-24">
 <h3 className="text-xl font-bold mb-6">Order Summary</h3>
 
 <div className="space-y-4 text-sm mb-6">
 <div className="flex justify-between text-muted-foreground font-medium">
 <span>Subtotal</span>
 <span className="text-foreground">{currency}{subTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-muted-foreground font-medium">
 <span>Taxes & Fees</span>
 <span className="text-foreground">{currency}{tax.toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-muted-foreground font-medium">
 <span>Delivery Option</span>
 <span className="text-foreground">{deliveryType}</span>
 </div>
 {discountAmount > 0 && (
 <div className="flex justify-between font-medium text-emerald-600">
 <span>Coupon Savings</span>
 <span>-{currency}{discountAmount.toLocaleString()}</span>
 </div>
 )}

 <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
 <span className="font-bold text-lg">Grand Total</span>
 <span className="font-black text-2xl text-primary">{currency}{effectiveTotal.toLocaleString()}</span>
 </div>
 </div>

 {/* Coupons */}
 <div className="mb-4">
 <AppliedCoupon />
 <div className="mt-3">
 <CouponDialog />
 </div>
 </div>

 <Button 
 className="w-full rounded-2xl h-14 text-lg font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all"
 onClick={() => navigate('/checkout')}
 >
 Proceed to Checkout
 </Button>
 
 <p className="text-xs text-center text-muted-foreground font-medium mt-4">
 Taxes and delivery charges are calculated at checkout.
 </p>
 </div>
 );
};
