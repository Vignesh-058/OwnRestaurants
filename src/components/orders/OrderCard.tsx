import type { Order } from '@/types/order.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentBadge } from './PaymentBadge';
import { Eye, RotateCcw, Loader2 } from 'lucide-react';
import { useRepeatOrder } from '@/hooks/orders/useRepeatOrder';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(iso));

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const {
    handleRepeatOrder,
    isPending,
    showConfirmDialog,
    confirmReorder,
    cancelReorder,
  } = useRepeatOrder();
  
  const orderId = order.orderId || order._id;
  const total = order.totalAmount ?? order.grandTotal;
  const itemCount = order.items?.length;
  const orderType = order.orderType;
  const paymentStatus = order.paymentStatus;
  const orderStatus = order.orderStatus;
  
  const formattedDate = order.createdAt ? fmtDate(order.createdAt) : '—';

  // Debug Logs
  console.log('[Mapped Order Object]', order);
  if (total === undefined || total === null) {
    console.log('[Missing Field] totalAmount is missing from backend response for order:', orderId);
  } else {
    console.log('[Displayed Total Amount]', total);
  }
  console.log('[Displayed Item Count]', itemCount);
  console.log('[Displayed Order Status]', orderStatus);
  console.log('[Displayed Payment Status]', paymentStatus);

  return (
    <>
      <Card className="rounded-[20px] border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(255,107,0,0.08)] transition-all duration-300 group overflow-hidden bg-white relative">
        <div className={`absolute top-0 left-0 right-0 h-1 w-full ${orderStatus === 'Delivered' ? 'bg-[#10B981]' : orderStatus === 'Cancelled' ? 'bg-[#EF4444]' : 'bg-[#FF6B00]'}`} />

        <CardContent className="p-[20px]">
          {/* Row 1: Order ID, Date, Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-[16px] font-bold text-[#111827]">Order #{orderId?.slice(-8).toUpperCase() || 'UNKNOWN'}</span>
              <span className="text-[14px] text-[#6B7280] hidden sm:block">•</span>
              <span className="text-[14px] text-[#6B7280]">{formattedDate}</span>
            </div>
            {orderStatus && <OrderStatusBadge status={orderStatus} />}
          </div>

          {/* Row 2: Payment, Total, Items, Delivery Type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#F3F4F6] mb-4">
            <div className="flex items-center flex-wrap gap-4 sm:gap-6">
              {total !== undefined && total !== null && (
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#6B7280] mb-0.5">Total Amount</span>
                  <span className="text-[26px] font-bold text-[#FF6B00] leading-none">₹{total.toLocaleString()}</span>
                </div>
              )}
              
              {(total !== undefined && total !== null && itemCount !== undefined && itemCount !== null) && (
                <div className="w-px h-10 bg-[#E5E7EB] hidden sm:block" />
              )}
              
              {itemCount !== undefined && itemCount !== null && (
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#6B7280] mb-1">Items</span>
                  <span className="text-[15px] font-bold text-[#111827]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                </div>
              )}

              {((total !== undefined || itemCount !== undefined) && orderType) && (
                <div className="w-px h-10 bg-[#E5E7EB] hidden sm:block" />
              )}

              {orderType && (
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#6B7280] mb-1">Order Type</span>
                  <span className="text-[15px] font-bold text-[#111827]">{orderType}</span>
                </div>
              )}
            </div>
            
            <div className="flex shrink-0 items-center justify-start sm:justify-end">
              <PaymentBadge paymentStatus={paymentStatus} paymentMode={order.paymentMode} />
            </div>
          </div>

          {/* Row 3: Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full font-bold h-11 border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] gap-2 transition-all"
              onClick={() => onViewDetails(order)}
              disabled={isPending}
            >
              <Eye className="h-4 w-4 text-[#9CA3AF]" />
              View Details
            </Button>
            <Button
              className="flex-1 rounded-full font-bold h-11 bg-[#FF6B00] hover:bg-[#EA580C] text-white gap-2 transition-all shadow-[0_4px_12px_rgba(255,107,0,0.2)]"
              onClick={() => handleRepeatOrder(order)}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              {isPending ? 'Processing...' : 'Repeat Order'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={cancelReorder}>
        <AlertDialogContent className="rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Switch Outlet?</AlertDialogTitle>
            <AlertDialogDescription>
              This order belongs to a different outlet. Switch to that outlet and reorder?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReorder} className="bg-[#FF6B00] hover:bg-[#EA580C] rounded-full font-bold text-white">
              Switch & Reorder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
