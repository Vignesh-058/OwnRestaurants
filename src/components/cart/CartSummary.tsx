import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/CartStore';
import { useNavigate } from 'react-router-dom';
import { DiscountList } from '@/components/discount/DiscountList';
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
    <span className={`${isLarge ? 'text-[18px] font-bold text-foreground' : 'text-[15px] font-medium text-muted-foreground'}`}>
      {label}
    </span>
    <span className={`tabular-nums font-bold ${
      isLarge
        ? 'text-[18px] text-foreground'
        : isGreen
          ? 'text-[15px] text-green-500'
          : 'text-[15px] text-foreground'
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
    <div className="bg-card rounded-[20px] shadow-sm border border-border overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[22px] font-extrabold text-foreground leading-none">Order Summary</h3>
          <p className="text-[13px] text-muted-foreground font-medium mt-0.5">
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
              <span className="text-[15px] font-medium text-muted-foreground">Delivery Charge</span>
              <span className="text-[13px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">FREE</span>
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
        <div className="border-t-2 border-dashed border-border" />

        {/* ── Grand Total ── */}
        <div className="flex justify-between items-center">
          <span className="text-[20px] font-extrabold text-foreground">Grand Total</span>
          <span className="text-[28px] font-extrabold text-primary tabular-nums leading-none">
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
            className="w-full h-[56px] rounded-full text-[16px] font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 border-0 group"
            disabled={!checkoutEnable}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          {!checkoutEnable && checkOutMessage && (
            <p className="text-destructive text-[12px] font-bold text-center -mt-1">
              {checkOutMessage}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full h-[48px] rounded-full text-[15px] font-bold border-2 border-primary text-primary hover:bg-primary/5 transition-all duration-300 bg-card"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
