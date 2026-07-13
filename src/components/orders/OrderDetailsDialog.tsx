import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/types/order.types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentBadge } from './PaymentBadge';
import { OrderTimeline } from './OrderTimeline';
import { Separator } from '@/components/ui/separator';
import { MapPin, User, Phone, Package, CreditCard, Tag, Truck, Download, FileText, Navigation, Info, EyeOff } from 'lucide-react';
import { useSettingsStore } from '@/store/SettingsStore';
import { Button } from '@/components/ui/button';

const fmtDate = (iso: string) =>
 new Intl.DateTimeFormat('en-IN', {
 day: '2-digit', month: 'long', year: 'numeric',
 hour: '2-digit', minute: '2-digit', hour12: true,
 }).format(new Date(iso));

interface OrderDetailsDialogProps {
 order: Order | null;
 open: boolean;
 onClose: () => void;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number }) => {
 if (!value && value !== 0) return null;
 return (
 <div className="flex items-start gap-3">
 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
 <Icon className="h-4 w-4 text-primary" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground font-medium">{label}</p>
 <p className="text-sm font-semibold text-foreground">{value}</p>
 </div>
 </div>
 );
};

export const OrderDetailsDialog = ({ order, open, onClose }: OrderDetailsDialogProps) => {
  const settings = useSettingsStore((state) => state.settings);

  if (!order) return null;

 const address = order.address ?? order.deliveryAddress;
 const total = order.grandTotal ?? order.totalAmount ?? 0;
 const orderId = order.orderNo ?? order.orderId ?? order._id;

 const formattedDate = order.createdAt ? fmtDate(order.createdAt) : '—';

 return (
 <Dialog open={open} onOpenChange={onClose}>
 <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl p-0">
 {/* Header with gradient */}
 <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 pb-5 rounded-t-3xl">
 <DialogHeader>
 <div className="flex items-start justify-between">
 <div>
 <DialogTitle className="text-xl font-black">Order Details</DialogTitle>
 <p className="text-sm text-muted-foreground mt-1">
 #{orderId.slice(-10).toUpperCase()} · {formattedDate}
 </p>
 </div>
 <OrderStatusBadge status={order.status} />
 </div>
 </DialogHeader>
 <div className="mt-4">
 <PaymentBadge paymentStatus={order.paymentStatus} paymentMode={order.paymentMode} />
 </div>
 </div>

 <div className="p-6 space-y-6">
 {/* Invoice Actions */}
 {settings?.isInvoicePdfGenerated && order.status === 'Delivered' && (
   <div className="flex gap-3">
     <Button variant="outline" className="flex-1 rounded-xl shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary gap-2 text-xs font-bold h-11">
       <FileText className="h-4 w-4" /> View Invoice
     </Button>
     <Button variant="default" className="flex-1 rounded-xl shadow-premium gap-2 text-xs font-bold h-11">
       <Download className="h-4 w-4" /> Download PDF
     </Button>
   </div>
 )}

 {/* Timeline */}
 <div>
 <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider text-muted-foreground">
 Order Progress
 </h4>
 <OrderTimeline status={order.status} />
 </div>

 <Separator />

 {/* Customer Info */}
 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Customer</h4>
 <div className="space-y-3">
 <InfoRow icon={User} label="Name" value={order.customerName} />
 <InfoRow icon={Phone} label="Phone" value={order.customerPhone ?? order.phone} />
 </div>
 </div>

 {/* Delivery Address */}
 {address && (
 <>
 <Separator />
 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Delivery Address</h4>
 <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl">
 <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
 <div className="text-sm text-foreground leading-relaxed">
 {[
 address.customerName,
 address.addressLine1 ?? address.address,
 address.addressLine2,
 address.landmark ? `Near ${address.landmark}` : null,
 address.city,
 address.state,
 address.pincode,
 ].filter(Boolean).join(', ')}
 </div>
 </div>
 </div>
 </>
 )}

  {/* Delivery Tracking */}
  {order.currentDelivery && (
  <>
    <Separator />
    <div>
    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
      <Navigation className="h-4 w-4" />
      Delivery Tracking
    </h4>
    <div className="space-y-3 p-4 bg-muted/20 rounded-2xl">
      <InfoRow icon={Truck} label="Partner" value={order.currentDelivery.partnerName} />
      <InfoRow icon={User} label="Driver" value={order.currentDelivery.driverName} />
      <InfoRow icon={Phone} label="Phone" value={order.currentDelivery.driverPhone} />
      {order.currentDelivery.deliveryOtp && (
        <InfoRow icon={EyeOff} label="Delivery OTP" value="••• •••" />
      )}
      {order.currentDelivery.eta && (
        <div className="mt-3 p-3 bg-primary/10 text-primary rounded-xl font-medium text-sm flex justify-between items-center">
          <span>ETA</span>
          <span>{order.currentDelivery.eta}</span>
        </div>
      )}
      {order.currentDelivery.trackingUrl && (
        <Button variant="outline" className="w-full mt-2 rounded-xl text-xs font-bold" onClick={() => window.open(order.currentDelivery!.trackingUrl, '_blank')}>
          Track Live
        </Button>
      )}
    </div>
    </div>
  </>
  )}

  {order.instructions && (
  <>
  <Separator />
  <div>
    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
      <Info className="h-4 w-4" /> Instructions
    </h4>
    <p className="text-sm text-foreground bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">{order.instructions}</p>
  </div>
  </>
  )}

 <Separator />

 {/* Items */}
 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
 <Package className="h-4 w-4" />
 Items Ordered
 </h4>
 <div className="space-y-3">
 {order.items?.map((item, idx) => {
 const name = item.itemname ?? item.name ?? 'Item';
 const price = item.sellingPrice ?? item.price ?? item.basePrice ?? 0;
 return (
 <div key={item.itemid ?? item._id ?? idx} className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
 <div className="flex-1">
 <p className="font-semibold text-sm text-foreground">{name}</p>
 {item.variationName && (
 <p className="text-xs text-muted-foreground mt-0.5">{item.variationName}</p>
 )}
 {((item.addOnDetails || item.addons) ?? []).length > 0 && (
  <div className="mt-2 space-y-1">
  {(item.addOnDetails || item.addons)?.map((a, ai) => (
  <p key={ai} className="text-xs text-muted-foreground bg-background border px-2 py-1 rounded-md inline-block mr-1">
    {a.group ? `${a.group}: ` : ''}{a.name} (₹{a.price})
  </p>
  ))}
  </div>
  )}
 </div>
 <div className="text-right shrink-0">
 <p className="text-sm font-bold">₹{price.toLocaleString()}</p>
 <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 <Separator />

 {/* Bill Summary */}
 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
 <CreditCard className="h-4 w-4" />
 Bill Summary
 </h4>
 <div className="space-y-3 bg-muted/20 rounded-2xl p-4">
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">Subtotal</span>
    <span className="font-medium">₹{(total - (order.deliveryCharge || 0) - (order.tax || 0) - (order.packageCharge || 0) + (order.discount || order.savedAmount || 0)).toFixed(2)}</span>
  </div>
  {(order.discount || order.savedAmount) ? (
  <div className="flex justify-between items-center text-sm">
  <span className="text-green-600 flex items-center gap-2">
  <Tag className="h-3.5 w-3.5" /> Discount
  </span>
  <span className="text-green-600 font-bold">-₹{order.discount || order.savedAmount}</span>
  </div>
  ) : null}
  {order.packageCharge ? (
  <div className="flex justify-between items-center text-sm">
  <span className="text-muted-foreground flex items-center gap-2">
  <Package className="h-3.5 w-3.5" /> Package Charge
  </span>
  <span className="font-medium">₹{order.packageCharge}</span>
  </div>
  ) : null}
 {order.deliveryCharge !== undefined && (
 <div className="flex justify-between items-center text-sm">
 <span className="text-muted-foreground flex items-center gap-2">
 <Truck className="h-3.5 w-3.5" /> Delivery Charge
 </span>
 <span className="font-medium">₹{order.deliveryCharge}</span>
 </div>
 )}
 {order.tax !== undefined && order.tax > 0 && (
 <div className="flex justify-between items-center text-sm">
 <span className="text-muted-foreground">Tax</span>
 <span className="font-medium">₹{order.tax}</span>
 </div>
 )}
 <Separator className="my-2" />
 <div className="flex justify-between items-center">
 <span className="font-bold text-base">Grand Total</span>
 <span className="font-black text-xl text-primary">₹{total.toLocaleString()}</span>
 </div>
 </div>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 );
};
