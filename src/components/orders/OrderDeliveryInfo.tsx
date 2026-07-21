import type { Order } from '@/types/order.types';
import { Card } from '@/components/ui/card';
import { Truck, MapPin, Phone, User, Clock, Store } from 'lucide-react';

interface OrderDeliveryInfoProps {
  order: Order;
}

export const OrderDeliveryInfo = ({ order }: OrderDeliveryInfoProps) => {
  const orderAny = order as any;
  const isDelivery = orderAny.orderType === 'Delivery' || orderAny.orderType === 'DELIVERY' || orderAny.orderType === 'delivery' || !orderAny.orderType;

  const formatAddress = (addr: any) => {
    if (!addr) return 'Address not provided';
    if (typeof addr === 'string') return addr;
    // Format object
    return `${addr.street || ''} ${addr.city || ''} ${addr.zipCode || ''}`.trim() || 'Address not provided';
  };

  return (
    <Card className="bg-[#FFFFFF] rounded-[24px] border border-[#FFE2CC] shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        {isDelivery ? <Truck className="w-5 h-5 text-[#FF6B00]" /> : <Store className="w-5 h-5 text-[#FF6B00]" />}
        <h3 className="font-bold text-lg text-gray-900">
          {isDelivery ? 'Delivery Information' : 'Pickup Information'}
        </h3>
      </div>
      
      <div className="p-5 space-y-4">
        {isDelivery ? (
          <>
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.customerName || orderAny.customerName || 'Customer'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{order.customerPhone || order.phone || orderAny.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {formatAddress(order.deliveryAddress)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <Store className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Outlet Details</p>
                <p className="text-sm font-semibold text-gray-900">Main Outlet</p>
              </div>
            </div>
            
            {orderAny.pickupTime && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Scheduled Pickup</p>
                  <p className="text-sm font-medium text-[#FF6B00]">{orderAny.pickupTime}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Scheduled Delivery Info (Pre-Booking) */}
        {orderAny.scheduleDate && (
          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-100">
            <Clock className="w-4 h-4 text-orange-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-orange-600/80 uppercase tracking-wider mb-1">Scheduled For</p>
              <p className="text-sm font-bold text-orange-900">{orderAny.scheduleDate}</p>
              {orderAny.scheduleTime && (
                <p className="text-xs font-semibold text-orange-700 mt-0.5">{orderAny.scheduleTime}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
