import type { Order } from '@/types/order.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentBadge } from './PaymentBadge';
import { MapPin, Package, ShoppingBag, Eye, RotateCcw, Calendar } from 'lucide-react';

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
 const address = order.address ?? order.deliveryAddress;
 const total = order.grandTotal ?? order.totalAmount ?? 0;
 const itemCount = order.itemCount ?? order.items?.length ?? 0;
 const orderId = order.orderNo ?? order.orderId ?? order._id;

 const formattedDate = order.createdAt ? fmtDate(order.createdAt) : '—';

 return (
 <Card className="rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
 {/* Top accent */}
 <div className={`h-1 w-full ${order.status === 'Delivered' ? 'bg-green-500' : order.status === 'Cancelled' ? 'bg-red-500' : 'bg-primary'}`} />

 <CardContent className="p-6">
 {/* Header row */}
 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
 <div>
 <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1.5">
 <ShoppingBag className="h-3.5 w-3.5" />
 Order #{orderId.slice(-8).toUpperCase()}
 </p>
 <div className="flex items-center gap-2 text-sm text-muted-foreground">
 <Calendar className="h-3.5 w-3.5" />
 {formattedDate}
 </div>
 </div>
 <OrderStatusBadge status={order.status} />
 </div>

 {/* Payment badges */}
 <div className="mb-4">
 <PaymentBadge paymentStatus={order.paymentStatus} paymentMode={order.paymentMode} />
 </div>

 {/* Stats row */}
 <div className="flex items-center gap-6 py-4 border-y border-muted/60 mb-4">
 <div className="flex flex-col">
 <span className="text-2xl font-black text-foreground">₹{total.toLocaleString()}</span>
 <span className="text-xs text-muted-foreground">Grand Total</span>
 </div>
 <div className="w-px h-10 bg-muted/60" />
 <div className="flex items-center gap-2 text-muted-foreground">
 <Package className="h-4 w-4" />
 <span className="text-sm font-medium">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
 </div>
 {order.orderType && (
 <>
 <div className="w-px h-10 bg-muted/60 hidden sm:block" />
 <span className="text-sm text-muted-foreground hidden sm:block">{order.orderType}</span>
 </>
 )}
 {order.savedAmount && order.savedAmount > 0 ? (
 <>
 <div className="w-px h-10 bg-muted/60 hidden sm:block" />
 <div className="hidden sm:flex flex-col">
 <span className="text-sm font-bold text-green-600">₹{order.savedAmount} saved</span>
 <span className="text-xs text-muted-foreground">Savings</span>
 </div>
 </>
 ) : null}
 </div>

 {/* Address */}
 {address && (
 <div className="flex items-start gap-2 mb-5 text-sm text-muted-foreground">
 <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/60" />
 <span className="line-clamp-1">
 {[address.addressLine1 ?? address.address, address.city, address.pincode]
 .filter(Boolean).join(', ')}
 </span>
 </div>
 )}

 {/* Actions */}
 <div className="flex gap-3">
 <Button
 variant="default"
 className="flex-1 rounded-full font-semibold shadow-premium gap-2"
 onClick={() => onViewDetails(order)}
 >
 <Eye className="h-4 w-4" />
 View Details
 </Button>
 <Button
 variant="outline"
 className="rounded-full font-semibold gap-2 opacity-50 cursor-not-allowed"
 disabled
 title="Repeat order coming soon"
 >
 <RotateCcw className="h-4 w-4" />
 Repeat
 </Button>
 </div>
 </CardContent>
 </Card>
 );
};
