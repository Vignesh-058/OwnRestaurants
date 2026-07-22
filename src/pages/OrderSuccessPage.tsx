import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CircleCheckBig, 
  Package, 
  Receipt, 
  Truck, 
  ShoppingBag, 
  ArrowRight, 
  AlertCircle,
  Clock, 
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrderDetail } from '@/hooks/queries/useOrderDetail';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { RecommendedProducts } from '@/components/product/RecommendedProducts';

export const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId);
  const { organization: org } = useOrganizationStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'accepted':
      case 'ready':
      case 'out for delivery':
      case 'delivered':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'preparing':
      case 'processing':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return `${org?.currency || '₹'}${amount.toFixed(2)}`;
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pb-24 pt-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Card className="bg-white rounded-[24px] border border-[#FFE2CC] shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Unable to load order details</h2>
            <p className="text-gray-500 font-medium mb-8 max-w-sm">
              Your order has been placed successfully, but we couldn't load the receipt at this moment.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="rounded-full px-8 border-[#FFE2CC] hover:bg-orange-50 text-gray-700 font-bold"
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
              <Button 
                className="bg-[#FF6B00] hover:bg-[#FF7A1A] text-white rounded-full px-8 font-bold"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pb-24 pt-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Card className="bg-white rounded-[24px] border border-[#FFE2CC] shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Order not found</h2>
            <p className="text-gray-500 font-medium mb-8">We couldn't find the order you're looking for.</p>
            <Button 
              className="bg-[#FF6B00] hover:bg-[#FF7A1A] text-white rounded-full px-8 font-bold"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const orderAny = order as any;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32 pt-4 lg:pt-8 transition-all duration-300">
      <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Success Header Card */}
        <Card className="bg-white rounded-[24px] border border-[#FFE2CC] shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#22C55E]" />
          <div className="p-6 md:p-10 text-center flex flex-col items-center pt-10">
            <div className="w-24 h-24 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
              <CircleCheckBig className="w-12 h-12 text-[#22C55E]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">Order Placed Successfully!</h1>
            <p className="text-gray-500 font-medium text-base mb-8 max-w-md">
              Thank you for your order. We've received it and are preparing it right away.
            </p>
            
            <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-4 md:gap-8 w-full border-t border-gray-100 pt-8">
              <div className="text-left md:text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-24 md:mx-auto" />
                ) : (
                  <p className="font-bold text-gray-900 text-lg">#{order?.orderNo || order?.orderId}</p>
                )}
              </div>
              <div className="text-right md:text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Estimated</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-24 md:mx-auto ml-auto" />
                ) : (
                  <p className="font-bold text-gray-900 text-lg">25-30 Mins</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Order Details & Summary */}
        <Card className="bg-white rounded-[24px] border border-[#FFE2CC] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-xl flex items-center gap-2 text-gray-900">
              <Receipt className="w-5 h-5 text-[#FF6B00]" />
              Order Summary
            </h3>
            {!isLoading && order && (
              <Badge variant="outline" className={`border ${getStatusColor(order.orderStatus || order.status)} font-bold px-3 py-1 uppercase tracking-wide text-xs rounded-full`}>
                {order.orderStatus || order.status}
              </Badge>
            )}
          </div>
          
          <div className="p-6 space-y-6">
            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Store className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Outlet</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <p className="font-bold text-gray-900">{orderAny?.outletId?.outletName || orderAny?.outletName || 'Main Outlet'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {order?.orderType === 'Door Delivery' ? (
                  <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                ) : (
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order Type</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <p className="font-bold text-gray-900">{order?.orderType || 'Pickup'}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Scheduled Delivery Section */}
            {order?.scheduleDate && (
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-orange-600/80 uppercase tracking-wider mb-0.5">Scheduled Delivery</p>
                  <p className="font-bold text-orange-900">{order.scheduleDate}</p>
                  {order.scheduleTime && (
                    <p className="text-sm font-semibold text-orange-700 mt-0.5">{order.scheduleTime}</p>
                  )}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              ) : (
                order?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start group">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200/60 flex-shrink-0">
                        {item.menuItem?.image?.[0] ? (
                          <img src={item.menuItem.image[0]} alt={item.menuItem.itemname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          {item.menuItem?.itemname || item.name}
                          {item.menuItem?.dietryType && (
                            <span className={`w-2.5 h-2.5 rounded-full ${item.menuItem.dietryType.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                          )}
                        </p>
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                        {item.variation && (
                          <p className="text-xs font-medium text-gray-400 mt-1">Variation: {item.variation.name}</p>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-xs font-medium text-gray-400 mt-0.5">
                            Addons: {item.addons.map((a: any) => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(item.totalPrice || (item.price * item.quantity))}</p>
                  </div>
                ))
              )}
            </div>

            <Separator className="bg-gray-100" />

            {/* Price Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                <span>Subtotal</span>
                {isLoading ? <Skeleton className="h-4 w-16" /> : <span className="font-semibold text-gray-900">{formatCurrency(orderAny?.itemTotal || order?.subtotal || 0)}</span>}
              </div>
              
              {(order?.discount || orderAny?.discountAmt > 0) && (
                <div className="flex justify-between items-center text-sm font-medium text-[#22C55E]">
                  <span>Discount</span>
                  <span className="font-semibold">-{formatCurrency(order?.discount || orderAny?.discountAmt)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                <span>Taxes & Fees</span>
                {isLoading ? <Skeleton className="h-4 w-16" /> : <span className="font-semibold text-gray-900">{formatCurrency(order?.tax || orderAny?.taxTotal || 0)}</span>}
              </div>
              
              {(order?.deliveryCharge ?? 0) > 0 && (
                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order?.deliveryCharge)}</span>
                </div>
              )}
            </div>

            <Separator className="bg-gray-100" />

            {/* Grand Total */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Paid</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-50 text-[#FF6B00] border-[#FFE2CC] font-bold">
                    {isLoading ? '...' : order?.paymentMode || 'COD'}
                  </Badge>
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className="text-2xl font-black text-[#FF6B00]">{formatCurrency(order?.grandTotal || order?.totalAmount || 0)}</span>
              )}
            </div>

          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            className="w-full bg-[#FF6B00] hover:bg-[#FF7A1A] text-white rounded-[16px] h-14 font-bold text-lg shadow-sm"
            onClick={() => navigate('/orders')}
          >
            Track Order
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline"
            className="w-full bg-white border-[#FFE2CC] hover:bg-orange-50 text-gray-900 rounded-[16px] h-14 font-bold text-lg shadow-sm"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </div>

        {/* Recommended Products */}
        <div className="pt-8">
          <RecommendedProducts />
        </div>

      </div>
    </div>
  );
};
