import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/CartStore";
import { useNavigate } from "react-router-dom";
import { DiscountList } from "@/components/discount/DiscountList";
import { AppliedCoupon } from "@/components/discount/AppliedCoupon";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { DeliveryTypeSelector } from "@/components/cart/DeliveryTypeSelector";

interface CartSummaryProps {
  currency: string;
  deliveryType?: string;
  onDeliveryTypeChange?: (val: string) => void;
  isUpdating?: boolean;
  hideMobileActions?: boolean;
}

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
    grandTotal,
    hasDiscount,
    checkoutEnable,
    checkOutMessage,
  } = useCartStore();

  const organization = useOrganizationStore((state) => state.organization);
  const cartConfig = organization?.theme?.sections?.cart?.config;
  const showSavings = cartConfig?.showSavings ?? true;

  return (
    <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#F3F4F6]">
        <h3 className="text-[16px] font-bold text-[#111827]">Order Summary</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Type */}
        {deliveryType && onDeliveryTypeChange && (
          <DeliveryTypeSelector
            value={deliveryType}
            onChange={onDeliveryTypeChange}
            disabled={isUpdating}
            compact
          />
        )}

        {/* Price Breakdown */}
        <div className="space-y-2.5 text-[13px]">
          <div className="flex justify-between font-medium">
            <span className="text-[#6B7280]">Subtotal</span>
            <span className="text-[#111827]">
              {currency}
              {orderTotal.toLocaleString()}
            </span>
          </div>

          {packageCharge > 0 && (
            <div className="flex justify-between font-medium">
              <span className="text-[#6B7280]">Package Charge</span>
              <span className="text-[#111827]">
                {currency}
                {packageCharge.toLocaleString()}
              </span>
            </div>
          )}

          {deliveryCharge > 0 && (
            <div className="flex justify-between font-medium">
              <span className="text-[#6B7280]">Delivery Charge</span>
              <span className="text-[#111827]">
                {currency}
                {deliveryCharge.toLocaleString()}
              </span>
            </div>
          )}

          {totalTax > 0 && (
            <div className="flex justify-between font-medium">
              <span className="text-[#6B7280]">Tax (GST)</span>
              <span className="text-[#111827]">
                {currency}
                {totalTax.toLocaleString()}
              </span>
            </div>
          )}

          {showSavings && hasDiscount && savedAmount > 0 && (
            <div className="flex justify-between font-bold text-[#10B981]">
              <span>Total Savings</span>
              <span>
                -{currency}
                {savedAmount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="border-t border-[#F3F4F6] pt-3 mt-1 flex justify-between items-center">
            <span className="font-bold text-[15px] text-[#111827]">
              Grand Total
            </span>
            <span className="font-black text-[22px] text-[#FF6B00]">
              {currency}
              {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Coupons */}
        {showSavings && (
          <div>{hasDiscount ? <AppliedCoupon /> : <DiscountList />}</div>
        )}

        {/* Action Buttons — hidden on mobile when fixed footer handles checkout */}
        <div className={hideMobileActions ? 'hidden lg:flex flex-col gap-2.5' : 'flex flex-col gap-2.5'}>
          <Button
            className="w-full h-[46px] rounded-full text-[14px] font-bold bg-[#FF6B00] hover:bg-[#E65C00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.25)] hover:-translate-y-0.5 transition-all duration-300 border-0"
            disabled={!checkoutEnable}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>

          {!checkoutEnable && checkOutMessage && (
            <p className="text-[#EF4444] text-[12px] font-bold text-center">
              {checkOutMessage}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full h-[46px] rounded-full text-[14px] font-bold border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FFF7ED] transition-all duration-300 bg-white"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
