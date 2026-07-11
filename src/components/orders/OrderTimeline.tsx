import type { OrderStatus } from '@/types/order.types';
import { Check, Clock, ChefHat, Package, Truck, Star, XCircle } from 'lucide-react';

const TIMELINE_STEPS: Array<{ status: OrderStatus; label: string; icon: any }> = [
 { status: 'Pending', label: 'Order Placed', icon: Clock },
 { status: 'Confirmed', label: 'Confirmed', icon: Check },
 { status: 'Preparing', label: 'Preparing', icon: ChefHat },
 { status: 'Ready', label: 'Ready', icon: Package },
 { status: 'Out For Delivery', label: 'Out For Delivery', icon: Truck },
 { status: 'Delivered', label: 'Delivered', icon: Star },
];

const STATUS_ORDER: OrderStatus[] = [
 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Out For Delivery', 'Delivered',
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
 <div className="relative">
 <div className="flex items-center justify-between relative">
 {/* connector line */}
 <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted z-0 mx-5" />
 <div
 className="absolute left-0 top-5 h-0.5 bg-primary z-0 mx-5 transition-all duration-700"
 style={{ width: currentIndex >= 0 ? `${(currentIndex / (STATUS_ORDER.length - 1)) * (100 - (100 / STATUS_ORDER.length))}%` : '0%' }}
 />

 {TIMELINE_STEPS.map((step, idx) => {
 const isCompleted = idx <= currentIndex;
 const isCurrent = idx === currentIndex;
 const Icon = step.icon;
 return (
 <div key={step.status} className="relative z-10 flex flex-col items-center gap-2 flex-1">
 <div
 className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
 ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-md scale-110' :
 isCurrent ? 'bg-primary/10 border-primary text-primary' :
 'bg-background border-muted text-muted-foreground'}`}
 >
 <Icon className="h-4 w-4" />
 </div>
 <p className={`text-[10px] text-center font-medium leading-tight max-w-[60px]
 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
 {step.label}
 </p>
 </div>
 );
 })}
 </div>
 </div>
 );
};
