import type { OrderStatus } from '@/types/order.types';
import { Check, Clock, ChefHat, Truck, Star, XCircle } from 'lucide-react';

const TIMELINE_STEPS: Array<{ status: OrderStatus | string; label: string; icon: any }> = [
 { status: 'orderReceived', label: 'Order Received', icon: Clock },
 { status: 'orderPlaced', label: 'Order Placed', icon: Check },
 { status: 'preparing', label: 'Preparing', icon: ChefHat },
 { status: 'outForDelivery', label: 'Out For Delivery', icon: Truck },
 { status: 'delivered', label: 'Delivered', icon: Star },
];

const STATUS_ORDER: string[] = [
 'orderReceived', 'orderPlaced', 'preparing', 'outForDelivery', 'delivered',
];

interface OrderTimelineProps {
 status: OrderStatus | string;
}

export const OrderTimeline = ({ status }: OrderTimelineProps) => {
  const isCancelled = status?.toLowerCase() === 'cancelled' || status?.toLowerCase() === 'ordercancelled';
  
  if (isCancelled) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-[#FFFFFF] border border-red-100 rounded-2xl shadow-sm">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-center md:text-left">
          <p className="text-xl font-bold text-red-600 tracking-tight">Order Cancelled</p>
          <p className="text-sm font-medium text-red-400 mt-1">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  // Handle various casing for status matching
  const normalizedStatus = status?.toLowerCase();
  const currentIndex = STATUS_ORDER.findIndex(s => s.toLowerCase() === normalizedStatus);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="relative w-full p-4 md:p-8 bg-[#FFFFFF] border border-[#FFE2CC] rounded-[24px] shadow-sm">
      {/* Horizontal line for md+ */}
      <div className="hidden md:block absolute left-12 right-12 top-16 h-1 bg-gray-100 z-0 rounded-full" />
      <div
        className="hidden md:block absolute left-12 top-16 h-1 bg-[#FF6B00] z-0 transition-all duration-700 rounded-full"
        style={{ width: `${(activeIndex / (STATUS_ORDER.length - 1)) * 100}%`, maxWidth: 'calc(100% - 6rem)' }}
      />

      {/* Vertical line for mobile */}
      <div className="md:hidden absolute left-9 top-8 bottom-8 w-1 bg-gray-100 z-0 rounded-full" />
      <div
        className="md:hidden absolute left-9 top-8 w-1 bg-[#FF6B00] z-0 transition-all duration-700 rounded-full"
        style={{ height: `${(activeIndex / (STATUS_ORDER.length - 1)) * 100}%`, maxHeight: 'calc(100% - 4rem)' }}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 relative z-10">
      {TIMELINE_STEPS.map((step, idx) => {
        const isCompleted = idx <= activeIndex;
        const isCurrent = idx === activeIndex;
        const Icon = step.icon;
        return (
          <div key={step.status} className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-3 w-full md:w-auto relative group">
            <div
              className={`h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10
              ${isCompleted ? 'bg-[#FF6B00] border-[#FF6B00]/20 text-white shadow-md md:scale-110' :
              'bg-white border-gray-100 text-gray-300'}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-left md:text-center flex-1 md:flex-none">
              <p className={`text-[15px] font-bold tracking-tight transition-colors duration-300
                ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {isCurrent && (
                <span className="text-[12px] font-semibold text-[#FF6B00] uppercase tracking-wider block mt-0.5 md:absolute md:left-1/2 md:-translate-x-1/2 md:-bottom-5 whitespace-nowrap">
                  Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
