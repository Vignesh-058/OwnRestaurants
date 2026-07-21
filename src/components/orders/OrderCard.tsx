import type { Order } from '@/types/order.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentBadge } from './PaymentBadge';
import { Eye, RotateCcw, Download, Calendar, MapPinned, Clock } from 'lucide-react';
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
  const itemCount = order.items?.length || 0;
  const paymentStatus = order.paymentStatus;
  const orderStatus = order.orderStatus || order.status;
  
  const formattedDate = order.createdAt ? fmtDate(order.createdAt) : '—';
  const branchName = 'Main Outlet';

  const previewItems = order.items?.slice(0, 3) || [];
  const remainingItemsCount = Math.max(0, itemCount - 3);

  return (
    <>
      <Card className="bg-[#FFFFFF] border border-[#FFE2CC] rounded-2xl shadow-sm hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 overflow-hidden group p-5 md:p-6 mb-4">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          {/* Left: Order Info */}
          <div className="flex flex-col gap-2 w-full md:w-1/4 shrink-0">
            <span className="text-[16px] font-semibold text-[#1F2937]">#{orderId?.slice(-8).toUpperCase() || 'UNKNOWN'}</span>
            <div className="flex items-center gap-1.5 text-[14px] text-[#6B7280]">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[14px] text-[#6B7280]">
              <MapPinned className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[150px]">{branchName}</span>
            </div>
            <div className="mt-1 flex flex-col gap-2 items-start">
              {orderStatus && <OrderStatusBadge status={orderStatus} />}
              {(order as any).scheduleDate && (
                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-[11px] font-bold border border-orange-100">
                  <Clock className="w-3 h-3" />
                  Scheduled
                </div>
              )}
            </div>
          </div>

          {/* Center: Product Previews */}
          <div className="flex-1 w-full border-t border-b md:border-y-0 md:border-x border-[#FFE2CC]/50 py-4 md:py-0 md:px-6 flex items-center">
            <div className="flex flex-wrap gap-4 items-center">
              {previewItems.map((item, idx) => {
                const itemName = item.itemname || item.name || 'Product';
                const firstImage = Array.isArray(item.image) ? item.image[0] : item.image;
                
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#FFE2CC] overflow-hidden shrink-0 flex items-center justify-center">
                      {firstImage ? (
                        <img src={firstImage} alt={itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Img</div>
                      )}
                    </div>
                    <div className="flex flex-col max-w-[120px]">
                      <span className="text-[14px] font-medium text-[#1F2937] truncate">{itemName}</span>
                      <span className="text-[13px] text-[#6B7280]">x{item.quantity || 1}</span>
                    </div>
                  </div>
                );
              })}
              
              {remainingItemsCount > 0 && (
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#FFF4EB] text-[#FF6B00] text-[13px] font-semibold shrink-0">
                  +{remainingItemsCount}
                </div>
              )}
            </div>
          </div>

          {/* Right: Amounts and Actions */}
          <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 md:items-end">
            <div className="flex justify-between md:flex-col md:items-end gap-1 w-full">
              <span className="text-[18px] font-bold text-[#1F2937]">₹{total?.toLocaleString() || 0}</span>
              {paymentStatus && <PaymentBadge paymentStatus={paymentStatus} />}
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto mt-2">
              <Button 
                variant="default" 
                className="flex-1 md:flex-none bg-[#FF6B00] hover:bg-[#FF7A1A] text-white rounded-lg h-10 px-4 font-medium transition-all"
                onClick={() => onViewDetails(order)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </Button>
              
              {order.bill && (
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none border-[#FFE2CC] text-[#1F2937] hover:bg-[#FFF4EB] hover:text-[#FF6B00] rounded-lg h-10 px-4 transition-all"
                  onClick={() => window.open(order.bill, '_blank')}
                >
                  <Download className="w-4 h-4 md:mr-0 lg:mr-2" /> <span className="hidden lg:inline">Invoice</span>
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none border-[#FFE2CC] text-[#1F2937] hover:bg-[#FFF4EB] hover:text-[#FF6B00] rounded-lg h-10 px-4 transition-all"
                onClick={() => handleRepeatOrder(order)}
                disabled={isPending}
              >
                <RotateCcw className="w-4 h-4 md:mr-0 lg:mr-2" /> <span className="hidden lg:inline">Reorder</span>
              </Button>
            </div>
          </div>
          
        </div>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={cancelReorder}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Replace cart items?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart currently contains items. Proceeding will clear your cart and add the items from this past order. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-[#FFE2CC]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReorder}
              className="bg-[#FF6B00] hover:bg-[#FF7A1A] text-white rounded-xl"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
