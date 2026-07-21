import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

const statusConfig: Record<string, { label: string; className: string }> = {
  orderReceived: { label: 'Order Received', className: 'text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10' },
  orderPlaced: { label: 'Order Placed', className: 'text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10' },
  preparing: { label: 'Preparing', className: 'text-[#3B82F6] border-[#3B82F6] bg-[#3B82F6]/10' },
  Ready: { label: 'Ready', className: 'text-[#3B82F6] border-[#3B82F6] bg-[#3B82F6]/10' },
  outForDelivery: { label: 'Out For Delivery', className: 'text-[#FF6B00] border-[#FF6B00] bg-[#FF6B00]/10' },
  delivered: { label: 'Delivered', className: 'text-[#22C55E] border-[#22C55E] bg-[#22C55E]/10' },
  orderCancelled: { label: 'Cancelled', className: 'text-[#EF4444] border-[#EF4444] bg-[#EF4444]/10' },
  
  // Legacy fallbacks
  Pending: { label: 'Pending', className: 'text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10' },
  Confirmed: { label: 'Confirmed', className: 'text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10' },
  Preparing: { label: 'Preparing', className: 'text-[#3B82F6] border-[#3B82F6] bg-[#3B82F6]/10' },
  'Out For Delivery': { label: 'Out For Delivery', className: 'text-[#FF6B00] border-[#FF6B00] bg-[#FF6B00]/10' },
  Delivered: { label: 'Delivered', className: 'text-[#22C55E] border-[#22C55E] bg-[#22C55E]/10' },
  Cancelled: { label: 'Cancelled', className: 'text-[#EF4444] border-[#EF4444] bg-[#EF4444]/10' },
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
