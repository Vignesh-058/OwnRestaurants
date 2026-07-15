import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/CartStore';
import { useNavigate } from 'react-router-dom';
import { DiscountList } from '@/components/discount/DiscountList';
import { AppliedCoupon } from '@/components/discount/AppliedCoupon';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { DeliveryTypeSelector } from '@/components/cart/DeliveryTypeSelector';

interface CartSummaryProps {
  currency: string;
  deliveryType?: string;
  onDeliveryTypeChange?: (val: string) => void;
  isUpdating?: boolean;
  hideMobileActions?: boolean;
}

/* ── Utility row ── */
const PriceRow = ({
  label,
  value,
  isGreen,
  isLarge,
}: {
  label: string;
  value: string;
  isGreen?: boolean;
  isLarge?: boolean;
}) => (
  <div className={`flex justify-between items-center ${isLarge ? 'py-1' : ''}`}>
    <span className={`${isLarge ? 'text-[18px] font-bold text-[#111827]' : 'text-[15px] font-medium text-[#6B7280]'}`}>
      {label}
    </span>
    <span className={`tabular-nums font-bold ${
      isLarge
        ? 'text-[18px] text-[#111827]'
        : isGreen
          ? 'text-[15px] text-[#10B981]'
          : 'text-[15px] text-[#111827]'
    }`}>
      {value}
    </span>
  </div>
);

export const CartSummary = ({
  currency,
  deliveryType,
  onDeliveryTypeChange,
  isUpdating,
  hideMobileActions,
}: CartSummaryProps) => {
  const navigate = useNavigate();

  const {
    orderTotal,
    savedAmount,
    deliveryCharge,
    packageCharge,
    totalTax,
    grandTotal: storeGrandTotal,
    hasDiscount: storeHasDiscount,
    checkoutEnable,
    checkOutMessage,
    cartItemCount,
    appliedDiscount,
  } = useCartStore();

  const hasDiscount = storeHasDiscount || !!appliedDiscount;
  const displaySavedAmount = appliedDiscount?.discountAmount || savedAmount;
  
  // Base Grand Total is provided by the backend cart response
  const grandTotal = storeGrandTotal;

  if (appliedDiscount) {
     console.log('[Updated Grand Total]', grandTotal);
  }

  const organization = useOrganizationStore(state => state.organization);
  const cartConfig = organization?.theme?.config?.cart?.config;
  const showSavings = cartConfig?.showSavings ?? true;
  const showOffers = cartConfig?.showOffers ?? true;
  const showBillDetails = cartConfig?.showBillDetails ?? true;


  return (
    <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[#F0F0F0] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[#F3F4F6]">
        <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
        </div>
        <div>
          <h3 className="text-[22px] font-black text-[#111827] leading-none">Order Summary</h3>
          <p className="text-[13px] text-[#9CA3AF] font-medium mt-0.5">
            {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">

        {/* ── Order Type ── */}
        {deliveryType && onDeliveryTypeChange && (
          <DeliveryTypeSelector
            value={deliveryType}
            onChange={onDeliveryTypeChange}
            disabled={isUpdating}
            compact
          />
        )}

        {/* ── Price Breakdown ── */}
        {showBillDetails && (
        <div className="space-y-2">
          <PriceRow label="Subtotal" value={`${currency}${orderTotal.toLocaleString()}`} />

          {packageCharge > 0 && (
            <PriceRow label="Package Charge" value={`${currency}${packageCharge.toLocaleString()}`} />
          )}

          {deliveryCharge > 0 ? (
            <PriceRow label="Delivery Charge" value={`${currency}${deliveryCharge.toLocaleString()}`} />
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-[#6B7280]">Delivery Charge</span>
              <span className="text-[13px] font-bold text-[#10B981] bg-[#F0FDF4] px-2 py-0.5 rounded-full">FREE</span>
            </div>
          )}

          {totalTax > 0 && (
            <PriceRow label="Tax (GST)" value={`${currency}${totalTax.toLocaleString()}`} />
          )}

          {showSavings && hasDiscount && displaySavedAmount > 0 && (
            <PriceRow
              label={appliedDiscount ? "Discount" : "Coupon Discount"}
              value={`-${currency}${displaySavedAmount.toLocaleString()}`}
              isGreen
            />
          )}
        </div>

        )}
        {/* ── Divider ── */}
        <div className="border-t-2 border-dashed border-[#F3F4F6]" />

        {/* ── Grand Total ── */}
        <div className="flex justify-between items-center">
          <span className="text-[20px] font-black text-[#111827]">Grand Total</span>
          <span className="text-[28px] font-black text-[#FF6B00] tabular-nums leading-none">
            {currency}{grandTotal.toLocaleString()}
          </span>
        </div>


        {/* ── Coupons ── */}
        {showOffers && (
          <div>
            <DiscountList />
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className={hideMobileActions ? 'hidden lg:flex flex-col gap-3' : 'flex flex-col gap-3'}>
          <Button
            className="w-full h-[56px] rounded-full text-[16px] font-black bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E65C00] hover:to-[#FF6B00] text-white shadow-[0_8px_24px_rgba(255,107,0,0.30)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,107,0,0.40)] transition-all duration-300 border-0 group"
            disabled={!checkoutEnable}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          {!checkoutEnable && checkOutMessage && (
            <p className="text-[#EF4444] text-[12px] font-bold text-center -mt-1">
              {checkOutMessage}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full h-[48px] rounded-full text-[15px] font-bold border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FFF7ED] transition-all duration-300 bg-white"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
