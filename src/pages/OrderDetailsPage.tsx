import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOrderDetail } from '@/hooks/queries/useOrderDetail';
import { useRepeatOrder } from '@/hooks/orders/useRepeatOrder';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderPaymentSummary } from '@/components/orders/OrderPaymentSummary';
import { OrderDeliveryInfo } from '@/components/orders/OrderDeliveryInfo';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, AlertCircle, Package, RotateCcw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data: orderResponse, isLoading, isError, error, refetch } = useOrderDetail(orderId);
  
  const orderAny = orderResponse as any;
  let fetchedOrder = orderAny?.data || orderResponse; // Handle variable nesting
  if (Array.isArray(fetchedOrder)) {
    fetchedOrder = fetchedOrder[0];
  }
  
  const order = state?.order || fetchedOrder;

  const {
    handleRepeatOrder,
    isPending: isReordering,
    showConfirmDialog,
    confirmReorder,
    cancelReorder,
  } = useRepeatOrder();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderId]);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));

  if (isLoading && !order) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderSkeleton />
        </div>
      </div>
    );
  }

  if (!isLoading && !order && isError) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[45vh] flex flex-col items-center justify-center p-8 border border-[#FFE2CC] rounded-[24px] bg-[#FFFFFF] shadow-sm gap-4 text-center"
          >
            <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-[24px] font-bold text-[#1F2937] tracking-tight">
                {isError ? "Couldn't load order details" : "Order not found"}
              </h2>
              <p className="text-[#6B7280] text-[14px] mt-2 max-w-sm">
                {isError ? (error as Error)?.message || "Unable to load your order details. Please try again." : "The order you are looking for does not exist."}
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => navigate('/orders')} variant="outline" className="rounded-xl border-[#FFE2CC] text-[#1F2937] px-8 h-11 font-bold hover:bg-[#FFF4EB] hover:text-[#FF6B00]">
                Return to Orders
              </Button>
              {isError && (
                <Button onClick={() => refetch()} className="rounded-xl bg-[#FF6B00] hover:bg-[#FF7A1A] text-white px-8 h-11 font-bold">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderSkeleton />
        </div>
      </div>
    );
  }

  const orderNumber = order.orderId || order._id || orderId;
  const status = order.orderStatus || order.status;

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Button
              variant="ghost"
              className="mb-4 text-[#6B7280] hover:text-[#FF6B00] hover:bg-[#FFF4EB] -ml-2 rounded-xl transition-all"
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-[32px] md:text-[40px] font-black text-[#1F2937] tracking-tight leading-none">
                Order <span className="text-[#FF6B00]">#{orderNumber?.slice(-8).toUpperCase()}</span>
              </h1>
              {status && <OrderStatusBadge status={status} />}
            </div>
            {order.createdAt && (
              <p className="text-[#6B7280] font-medium mt-2">Placed on {fmtDate(order.createdAt)}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 md:self-end mb-1">
            {order.bill && (
              <Button 
                variant="outline" 
                className="rounded-xl border-[#FFE2CC] text-[#1F2937] hover:bg-[#FFF4EB] hover:text-[#FF6B00] h-12 px-6 font-semibold"
                onClick={() => window.open(order.bill, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" /> Download Invoice
              </Button>
            )}
            <Button 
              className="rounded-xl bg-[#FF6B00] hover:bg-[#FF7A1A] text-white h-12 px-8 font-bold shadow-md shadow-[#FF6B00]/20"
              onClick={() => handleRepeatOrder(order)}
              disabled={isReordering}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reorder Items
            </Button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Timeline Tracker */}
          <section>
            <OrderTimeline status={status} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Items (approx 70% width) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#FFFFFF] rounded-[24px] border border-[#FFE2CC] shadow-sm overflow-hidden p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-6 h-6 text-[#FF6B00]" />
                  <h2 className="text-xl font-bold text-[#1F2937]">Ordered Items</h2>
                </div>
                
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => {
                    const itemName = item.itemname || item.name || 'Product';
                    const firstImage = Array.isArray(item.image) ? item.image[0] : item.image;
                    const price = item.price || item.totalPrice || 0;
                    
                    return (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 items-center transition-all hover:border-[#FFE2CC]">
                        <div className="w-20 h-20 bg-white rounded-xl border border-[#FFE2CC] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                          {firstImage ? (
                            <img src={firstImage} alt={itemName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-gray-400">No Image</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 self-center">
                          <h4 className="font-bold text-[#1F2937] truncate text-base leading-tight">{itemName}</h4>
                          <p className="text-sm font-medium text-[#6B7280] mt-1">Qty: {item.quantity || 1}</p>
                          {(item.variants?.length > 0 || item.addons?.length > 0) && (
                            <p className="text-xs text-gray-400 mt-1.5 truncate bg-white border border-gray-100 px-2 py-0.5 rounded-md inline-block max-w-full">
                              {[...(item.variants || []), ...(item.addons || [])].join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0 self-center pl-4">
                          <p className="text-lg font-black text-[#FF6B00]">₹{price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Summaries (approx 30% width) */}
            <div className="lg:col-span-4 space-y-6">
              <OrderPaymentSummary order={order} />
              <OrderDeliveryInfo order={order} />
            </div>
            
          </div>
        </motion.div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={cancelReorder}>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Replace cart items?</AlertDialogTitle>
            <AlertDialogDescription className="text-[15px]">
              Your cart currently contains items. Proceeding will clear your cart and add the items from this past order. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-[#FFE2CC] h-11">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReorder}
              className="bg-[#FF6B00] hover:bg-[#FF7A1A] text-white rounded-xl h-11 px-8"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
