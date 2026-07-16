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
 if (status === 'Cancelled') {
 return (
 <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl">
 <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
 <XCircle className="h-5 w-5 text-red-600" />
 </div>
 <div>
 <p className="font-bold text-red-700">Order Cancelled</p>
 <p className="text-sm text-red-500">This order has been cancelled.</p>
 </div>
 </div>
 );
 }

 const currentIndex = STATUS_ORDER.indexOf(status as OrderStatus);

  return (
  <div className="relative w-full">
    {/* Horizontal line for md+ */}
    <div className="hidden md:block absolute left-0 right-0 top-5 h-0.5 bg-muted z-0 mx-8" />
    <div
      className="hidden md:block absolute left-0 top-5 h-0.5 bg-primary z-0 mx-8 transition-all duration-700"
      style={{ width: currentIndex >= 0 ? `${(currentIndex / (STATUS_ORDER.length - 1)) * (100 - (200 / STATUS_ORDER.length))}%` : '0%' }}
    />

    {/* Vertical line for mobile */}
    <div className="md:hidden absolute left-5 top-4 bottom-4 w-0.5 bg-muted z-0" />
    <div
      className="md:hidden absolute left-5 top-4 w-0.5 bg-primary z-0 transition-all duration-700"
      style={{ height: currentIndex >= 0 ? `${(currentIndex / (STATUS_ORDER.length - 1)) * 100}%` : '0%' }}
    />

    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2 relative">
    {TIMELINE_STEPS.map((step, idx) => {
      const isCompleted = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      const Icon = step.icon;
      return (
        <div key={step.status} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 md:flex-1 w-full md:w-auto">
          <div
            className={`h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full flex items-center justify-center border-[2px] transition-all duration-300
            ${isCompleted ? 'bg-primary border-primary text-white shadow-md md:scale-110' :
            isCurrent ? 'bg-accent border-primary text-primary' :
            'bg-white border-border text-muted-foreground'}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <p className={`text-[13px] md:text-[12px] font-bold md:text-center leading-tight
            ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
            {step.label}
          </p>
        </div>
      );
    })}
    </div>
  </div>
  );
};
