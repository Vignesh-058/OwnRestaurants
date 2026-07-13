import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/CartStore';
import { useNavigate } from 'react-router-dom';
import { CouponDialog } from '@/components/discount/CouponDialog';
import { AppliedCoupon } from '@/components/discount/AppliedCoupon';
import { useOrganizationStore } from '@/store/OrganizationStore';

interface CartSummaryProps {
  currency: string;
}

export const CartSummary = ({ currency }: CartSummaryProps) => {
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
    checkOutMessage
  } = useCartStore();

  const organization = useOrganizationStore(state => state.organization);
  const cartConfig = organization?.theme?.sections?.cart?.config;
  const showSavings = cartConfig?.showSavings ?? true;

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]">
      <h3 className="text-[20px] font-bold mb-6 text-[#111827]">Order Summary</h3>
      
      <div className="space-y-4 text-[15px] mb-6">
        <div className="flex justify-between font-medium">
          <span className="text-[#6B7280]">Subtotal</span>
          <span className="text-[#111827]">{currency}{orderTotal.toLocaleString()}</span>
        </div>
        
        {packageCharge > 0 && (
          <div className="flex justify-between font-medium">
            <span className="text-[#6B7280]">Package Charge</span>
            <span className="text-[#111827]">{currency}{packageCharge.toLocaleString()}</span>
          </div>
        )}

        {deliveryCharge > 0 && (
          <div className="flex justify-between font-medium">
            <span className="text-[#6B7280]">Delivery Charge</span>
            <span className="text-[#111827]">{currency}{deliveryCharge.toLocaleString()}</span>
          </div>
        )}

        {totalTax > 0 && (
          <div className="flex justify-between font-medium">
            <span className="text-[#6B7280]">Tax (GST)</span>
            <span className="text-[#111827]">{currency}{totalTax.toLocaleString()}</span>
          </div>
        )}

        {showSavings && hasDiscount && savedAmount > 0 && (
          <div className="flex justify-between font-bold text-[#10B981]">
            <span>Total Savings</span>
            <span>-{currency}{savedAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-[#F3F4F6] pt-4 mt-2 flex justify-between items-center">
          <span className="font-bold text-[18px] text-[#111827]">Grand Total</span>
          <span className="font-black text-[26px] text-[#FF6B00]">{currency}{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Coupons */}
      {showSavings && (
        <div className="mb-6">
          {hasDiscount ? (
            <AppliedCoupon />
          ) : (
            <CouponDialog />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button 
          className="w-full h-[54px] rounded-full text-[16px] font-bold bg-[#FF6B00] hover:bg-[#E65C00] text-white shadow-[0_8px_25px_rgba(255,107,0,0.25)] hover:-translate-y-1 transition-all duration-300 border-0"
          disabled={!checkoutEnable}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </Button>

        {!checkoutEnable && checkOutMessage && (
          <p className="text-[#EF4444] text-[13px] font-bold text-center mt-1">
            {checkOutMessage}
          </p>
        )}

        <Button 
          variant="outline"
          className="w-full h-[54px] rounded-full text-[16px] font-bold border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FFF7ED] hover:text-[#FF6B00] transition-all duration-300 bg-white"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
