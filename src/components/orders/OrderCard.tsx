import type { Order } from '@/types/order.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentBadge } from './PaymentBadge';
import { Eye, RotateCcw, Loader2, Calendar, ShoppingBag, Truck, CreditCard } from 'lucide-react';
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

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 group overflow-hidden bg-background relative border-border/60">
        <div className={`absolute top-0 left-0 bottom-0 w-1 ${orderStatus === 'Delivered' ? 'bg-green-500' : orderStatus === 'Cancelled' ? 'bg-destructive' : 'bg-primary'}`} />

        <CardContent className="p-6 md:p-8">
          {/* Header Row: Order ID & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-extrabold text-foreground tracking-tight">Order #{orderId?.slice(-8).toUpperCase() || 'UNKNOWN'}</span>
              <div className="flex items-center gap-2 text-[14px] text-muted-foreground font-medium">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
            </div>
            {orderStatus && <OrderStatusBadge status={orderStatus} />}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border/50 mb-6 bg-muted/20 -mx-6 md:-mx-8 px-6 md:px-8">
            {itemCount !== undefined && itemCount !== null && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground text-[13px] font-semibold uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" /> Items
                </div>
                <span className="text-[16px] font-bold text-foreground">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
              </div>
            )}

            {orderType && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground text-[13px] font-semibold uppercase tracking-wider">
                  <Truck className="w-4 h-4" /> Type
                </div>
                <span className="text-[16px] font-bold text-foreground capitalize">{orderType.replace('_', ' ')}</span>
              </div>
            )}

            {paymentStatus && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground text-[13px] font-semibold uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" /> Payment
                </div>
                <PaymentBadge paymentStatus={paymentStatus} />
              </div>
            )}

            {total !== undefined && total !== null && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground text-[13px] font-semibold uppercase tracking-wider">
                  Total
                </div>
                <span className="text-2xl font-black text-primary leading-none">₹{total.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto font-bold h-12 px-6 shadow-none hover:bg-muted"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="w-4 h-4 mr-2" /> View Details
            </Button>
            
            <Button 
              className="w-full sm:w-auto font-bold h-12 px-6 shadow-sm"
              onClick={() => handleRepeatOrder(order)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              {isPending ? 'Processing...' : 'Repeat Order'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={cancelReorder}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Replace cart items?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart contains items from a different restaurant. Reordering will clear your current cart and add these items. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl h-12 font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReorder}
              className="rounded-xl h-12 font-bold"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
