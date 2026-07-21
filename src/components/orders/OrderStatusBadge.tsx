import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

const statusConfig: Record<string, { label: string; className: string }> = {
  // Pending - Amber
  orderReceived: { label: 'Order Received', className: 'text-amber-500 border-amber-500 bg-amber-500/10' },
  orderPlaced: { label: 'Order Placed', className: 'text-amber-500 border-amber-500 bg-amber-500/10' },
  Pending: { label: 'Pending', className: 'text-amber-500 border-amber-500 bg-amber-500/10' },
  
  // Confirmed - Blue
  Confirmed: { label: 'Confirmed', className: 'text-blue-500 border-blue-500 bg-blue-500/10' },
  
  // Preparing - Orange
  preparing: { label: 'Preparing', className: 'text-orange-500 border-orange-500 bg-orange-500/10' },
  Preparing: { label: 'Preparing', className: 'text-orange-500 border-orange-500 bg-orange-500/10' },
  
  // Ready - Purple
  Ready: { label: 'Ready', className: 'text-purple-500 border-purple-500 bg-purple-500/10' },
  
  // Out for Delivery - Indigo
  outForDelivery: { label: 'Out For Delivery', className: 'text-indigo-500 border-indigo-500 bg-indigo-500/10' },
  'Out For Delivery': { label: 'Out For Delivery', className: 'text-indigo-500 border-indigo-500 bg-indigo-500/10' },
  
  // Delivered - Green
  delivered: { label: 'Delivered', className: 'text-green-500 border-green-500 bg-green-500/10' },
  Delivered: { label: 'Delivered', className: 'text-green-500 border-green-500 bg-green-500/10' },
  
  // Cancelled - Red
  orderCancelled: { label: 'Cancelled', className: 'text-red-500 border-red-500 bg-red-500/10' },
  Cancelled: { label: 'Cancelled', className: 'text-red-500 border-red-500 bg-red-500/10' },
};

interface OrderStatusBadgeProps {
 status: OrderStatus | string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
 const config = statusConfig[status] ?? {
 label: status,
 className: 'bg-gray-100 text-gray-700 border-gray-200',
 };

 return (
 <Badge
 variant="outline"
 className={`rounded-full font-bold px-3 py-1.5 text-[12px] uppercase tracking-wider border ${config.className}`}
 >
 {config.label}
 </Badge>
 );
};
