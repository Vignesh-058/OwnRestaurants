import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/CartStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DiscountList } from '@/components/discount/DiscountList';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { toast } from 'sonner';

interface CartSummaryProps {
  currency: string;
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
    <span className={`${isLarge ? 'text-[18px] font-bold text-[#1F2937]' : 'text-[15px] font-medium text-[#6B7280]'}`}>
      {label}
    </span>
    <span className={`tabular-nums font-bold ${
      isLarge
        ? 'text-[18px] text-[#1F2937]'
        : isGreen
          ? 'text-[15px] text-[#22C55E]'
          : 'text-[15px] text-[#1F2937]'
    }`}>
      {value}
    </span>
  </div>
);

export const CartSummary = ({
  currency,
  isUpdating: _isUpdating,
  hideMobileActions = false,
}: CartSummaryProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    cartItems,
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
    preBookingId,
    preOrderDate,
    preOrderTime
  } = useCartStore();

  const handleCheckout = () => {
    console.log('[DEBUG Checkout Flow] Button clicked (CartSummary)');
    console.log('[DEBUG Checkout Flow] Validation started', {
      cartItemCount: cartItems?.length,
      checkoutEnable,
      checkOutMessage,
      preBookingId,
      preOrderDate,
      preOrderTime
    });

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const currentPreBookingId = preBookingId || searchParams.get('preBookingId');
    const currentPreOrderDate = preOrderDate || searchParams.get('preOrderDate');
    const currentPreOrderTime = preOrderTime || searchParams.get('preOrderTime');

    if (currentPreBookingId && (!currentPreOrderDate || !currentPreOrderTime)) {
      toast.error('Pre-order date and time are required for pre-booking.');
      return;
    }

    if (!checkoutEnable && checkOutMessage && !currentPreBookingId) {
      toast.error(checkOutMessage || 'Checkout is currently disabled.');
      return;
    }

    console.log('[DEBUG Checkout Flow] Validation passed');
    console.log('[DEBUG Checkout Flow] Navigation/API triggered');

    if (currentPreBookingId) {
      navigate(`/checkout?preBookingId=${currentPreBookingId}&preOrderDate=${currentPreOrderDate}&preOrderTime=${currentPreOrderTime}`);
    } else {
      navigate('/checkout');
    }
  };

  const hasDiscount = storeHasDiscount || !!appliedDiscount;
  const displaySavedAmount = appliedDiscount?.discountAmount || savedAmount;
  
  const itemsCalculatedTotal = (cartItems || []).reduce((acc, item) => {
    const itemPrice = (item as any).price ?? (item as any).sellingPrice ?? (item as any).defaultSellingPrice ?? (item as any).basePrice ?? 0;
    return acc + (itemPrice * (item.quantity || 1));
  }, 0);
  const grandTotal = storeGrandTotal > 0 ? storeGrandTotal : itemsCalculatedTotal;

  if (appliedDiscount) {
     console.log('[Updated Grand Total]', grandTotal);
  }

  const organization = useOrganizationStore(state => state.organization);
  const cartConfig = organization?.theme?.config?.cart?.config;
  const showSavings = cartConfig?.showSavings ?? true;
  const showBillDetails = cartConfig?.showBillDetails ?? true;


  const displayCurrency = (!currency || currency === '$' || currency.trim() === '') ? '₹' : currency.replace(/\$/g, '₹');

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-[#FFE2CC] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#FFE2CC]">
        <div className="w-10 h-10 rounded-full bg-[#FFF4EB] flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
        </div>
        <div>
          <h3 className="text-[20px] font-bold text-[#1F2937] leading-none">Order Summary</h3>
          <p className="text-[12px] text-[#6B7280] font-medium mt-1">
            {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* ── Price Breakdown ── */}
        {showBillDetails && (
        <div className="space-y-2">
          <PriceRow label="Subtotal" value={`${displayCurrency}${(orderTotal || 0).toLocaleString()}`} />

          {(packageCharge || 0) > 0 && (
            <PriceRow label="Package Charge" value={`${displayCurrency}${(packageCharge || 0).toLocaleString()}`} />
          )}

          {(deliveryCharge || 0) > 0 ? (
            <PriceRow label="Delivery Charge" value={`${displayCurrency}${(deliveryCharge || 0).toLocaleString()}`} />
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-[#6B7280]">Delivery Charge</span>
              <span className="text-[13px] font-bold text-[#22C55E] bg-[#DCFCE7] px-2 py-0.5 rounded-[4px]">FREE</span>
            </div>
          )}

          {(totalTax || 0) > 0 && (
            <PriceRow label="Tax (GST)" value={`${displayCurrency}${(totalTax || 0).toLocaleString()}`} />
          )}

          {showSavings && hasDiscount && (displaySavedAmount || 0) > 0 && (
            <PriceRow
              label={appliedDiscount ? "Discount" : "Coupon Discount"}
              value={`-${displayCurrency}${(displaySavedAmount || 0).toLocaleString()}`}
              isGreen
            />
          )}
        </div>

        )}

        {/* ── Discounts ── */}
        <div className="border-t border-[#ECE7E2] pt-3 mt-1">
          <DiscountList />
        </div>
        {/* ── Divider ── */}
        <div className="border-t-2 border-dashed border-[#FFE2CC]" />

        {/* ── Grand Total ── */}
        <div className="flex justify-between items-center pb-2">
          <span className="text-[18px] font-bold text-[#1F2937]">Grand Total</span>
          <span className="text-[24px] font-bold text-[#FF6B00] tabular-nums leading-none">
            {displayCurrency}{(grandTotal || 0).toLocaleString()}
          </span>
        </div>

        {/* ── Action Buttons ── */}
        <div className={hideMobileActions ? 'hidden lg:flex flex-col gap-2.5 pt-1' : 'flex flex-col gap-2.5 pt-1'}>
          <Button
            className="w-full h-[50px] rounded-[14px] text-[15px] font-bold bg-[#FF6B00] hover:bg-[#FF7A1A] text-white shadow-[0_4px_16px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.3)] transition-all duration-300 border-0 group"
            disabled={cartItemCount === 0}
            onClick={handleCheckout}
          >
            Proceed to Checkout
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          {!checkoutEnable && checkOutMessage && (
            <p className="text-[#EF4444] text-[12px] font-medium text-center">
              {checkOutMessage}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full h-[44px] rounded-[14px] text-[14px] font-bold border border-[#FFE2CC] text-[#1F2937] hover:bg-[#FAF8F5] hover:text-[#FF6B00] transition-all duration-300 bg-white shadow-sm"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
