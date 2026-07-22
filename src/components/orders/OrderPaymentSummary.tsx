import type { Order } from '@/types/order.types';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Receipt } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { PaymentBadge } from './PaymentBadge';

interface OrderPaymentSummaryProps {
  order: Order;
}

export const OrderPaymentSummary = ({ order }: OrderPaymentSummaryProps) => {
  const { organization: org } = useOrganizationStore();
  const orderAny = order as any;
  
  const formatCurrency = (amount: number = 0) => {
    const symbol = (org?.currency || '₹').replace(/\$/g, '');
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <Card className="bg-[#FFFFFF] rounded-[24px] border border-[#FFE2CC] shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-[#FF6B00]" />
        <h3 className="font-bold text-lg text-gray-900">Payment Summary</h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium text-gray-500">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">{formatCurrency(orderAny?.itemTotal || order?.subtotal || 0)}</span>
        </div>
        
        {(order?.discount || orderAny?.discountAmt > 0) && (
          <div className="flex justify-between items-center text-sm font-medium text-[#22C55E]">
            <span>Discount</span>
            <span className="font-semibold">-{formatCurrency(order?.discount || orderAny?.discountAmt)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm font-medium text-gray-500">
          <span>Taxes & Fees</span>
          <span className="font-semibold text-gray-900">{formatCurrency(order?.tax || orderAny?.taxTotal || 0)}</span>
        </div>
        
        {(order?.deliveryCharge ?? 0) > 0 && (
          <div className="flex justify-between items-center text-sm font-medium text-gray-500">
            <span>Delivery Charge</span>
            <span className="font-semibold text-gray-900">{formatCurrency(order?.deliveryCharge)}</span>
          </div>
        )}

        <Separator className="bg-gray-100" />

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
            <PaymentBadge paymentStatus={order.paymentStatus || 'Pending'} />
            <p className="text-xs font-semibold text-gray-500 mt-1">{order.paymentMode || 'COD'}</p>
          </div>
          <span className="text-2xl font-black text-[#FF6B00]">
            {formatCurrency(order?.grandTotal || order?.totalAmount || 0)}
          </span>
        </div>
      </div>
    </Card>
  );
};
