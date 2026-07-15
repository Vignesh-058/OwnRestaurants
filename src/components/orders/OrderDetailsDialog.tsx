import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/types/order.types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentBadge } from './PaymentBadge';
import { OrderTimeline } from './OrderTimeline';
import { MapPin, User, Phone, Package, CreditCard, Tag, Truck, X, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRepeatOrder } from '@/hooks/orders/useRepeatOrder';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
};

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-[#FF6B00]" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{label}</p>
        <p className="text-[13px] font-bold text-[#111827]">{value}</p>
      </div>
    </div>
  );
};

export const OrderDetailsDialog = ({ order, open, onClose }: OrderDetailsDialogProps) => {
  const { handleRepeatOrder, isPending, showConfirmDialog, confirmReorder, cancelReorder } = useRepeatOrder();

  useEffect(() => {
    if (open && order) {
      console.log('[Selected Order]', order);
      console.log('[Order Details Response]', order);
      console.log('[Items Count]', order.items?.length ?? 0);
      console.log('[Grand Total]', order.totalAmount ?? order.grandTotal);
      console.log('[Payment Status]', order.paymentStatus);
      console.log('[Order Status]', order.orderStatus);
    }
  }, [open, order]);

  if (!order) return null;

  const address = order.address ?? order.deliveryAddress;
  const total = order.totalAmount ?? order.grandTotal;
  const orderId = order.orderId ?? order.orderNo ?? order._id;
  const formattedDate = order.createdAt ? fmtDate(order.createdAt) : '—';
  const itemCount = order.items?.length ?? 0;

  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed right-0 md:top-[5%] md:bottom-auto bottom-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[75%] lg:w-[70%] max-h-[90vh] h-[90vh] p-0 flex flex-col overflow-hidden md:rounded-[16px] rounded-t-[20px] rounded-b-none border-none shadow-[0_10px_40px_rgba(0,0,0,0.1)] m-0 bg-[#F8FAFC]">
        
        {/* Sticky Header */}
        <div className="flex-none bg-white px-5 py-4 border-b border-[#F1F5F9] z-10 sticky top-0 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <DialogTitle className="text-[20px] font-black text-[#111827]">Order #{orderId?.slice(-8).toUpperCase()}</DialogTitle>
              {order.orderStatus && <OrderStatusBadge status={order.orderStatus} />}
              {order.paymentStatus && <PaymentBadge paymentStatus={order.paymentStatus} />}
            </div>
            <p className="text-[13px] font-medium text-[#6B7280]">
              {formattedDate}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-[#F1F5F9] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-[#4B5563]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Customer Details, Payment, Timeline) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Timeline Section */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
                <h4 className="font-extrabold text-[14px] text-[#111827] mb-5 uppercase tracking-wider">Order Timeline</h4>
                <OrderTimeline status={order.orderStatus} />
              </div>

              {/* Items Section */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
                <h4 className="font-extrabold text-[14px] text-[#111827] mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#FF6B00]" /> Items Ordered ({itemCount})
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item: any, idx: number) => {
                    const name = item.itemname ?? item.name ?? 'Item';
                    const price = item.sellingPrice ?? item.price ?? item.basePrice ?? 0;
                    const image = Array.isArray(item.image) ? item.image[0] : item.image;
                    
                    return (
                      <div key={item.itemid ?? item._id ?? idx} className="flex items-start gap-4 p-3 rounded-[12px] border border-[#F1F5F9] hover:border-[#E5E7EB] bg-[#F8FAFC]/50 transition-colors">
                        {image && (
                          <div className="h-16 w-16 rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                            <img src={image} alt={name} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[14px] text-[#111827] truncate">{name}</p>
                          {item.variationName && (
                            <p className="text-[12px] font-semibold text-[#6B7280] mt-0.5">{item.variationName}</p>
                          )}
                          {((item.addOnDetails || item.addons) ?? []).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {(item.addOnDetails || item.addons)?.map((a: any, ai: number) => (
                                <span key={ai} className="text-[10px] font-bold text-[#4B5563] bg-white border border-[#E5E7EB] px-2 py-1 rounded-[6px]">
                                  {a.group ? `${a.group}: ` : ''}{a.name} (₹{a.price})
                                </span>
                              ))}
                            </div>
                          )}
                          {order.instructions && (
                             <p className="text-[11px] font-medium text-[#FF6B00] mt-2 italic bg-[#FFF7ED] p-1.5 rounded-[6px]">
                               Note: {order.instructions}
                             </p>
                          )}
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end">
                          <p className="text-[14px] font-black text-[#111827]">₹{price.toLocaleString()}</p>
                          <span className="text-[11px] font-bold text-[#6B7280] bg-[#F1F5F9] px-2 py-0.5 rounded-[4px] mt-1">
                            Qty ×{item.quantity}
                          </span>
                          <p className="text-[12px] font-bold text-[#111827] mt-1">
                            Subtotal: ₹{(price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column (Customer, Bill Summary, Payment) */}
            <div className="space-y-6">
              
              {/* Customer Info Card */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#F1F5F9] space-y-4">
                <h4 className="font-extrabold text-[14px] text-[#111827] uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4 text-[#FF6B00]" /> Customer Details
                </h4>
                <div className="space-y-4">
                  <InfoRow icon={User} label="Name" value={order.customerName} />
                  <InfoRow icon={Phone} label="Phone" value={order.customerPhone ?? order.phone} />
                  {address && (
                    <div className="flex items-start gap-3 mt-2">
                      <div className="h-8 w-8 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-[#FF6B00]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Delivery Address</p>
                        <p className="text-[13px] font-medium text-[#111827] leading-relaxed">
                          {[
                            address.addressLine1 ?? address.address,
                            address.addressLine2,
                            address.landmark ? `Near ${address.landmark}` : null,
                            address.city,
                            address.state,
                            address.pincode,
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#F1F5F9] space-y-4">
                <h4 className="font-extrabold text-[14px] text-[#111827] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#FF6B00]" /> Payment
                </h4>
                <div className="space-y-4">
                  <InfoRow icon={CreditCard} label="Payment Method" value={order.paymentMode} />
                  <InfoRow icon={CreditCard} label="Payment Status" value={order.paymentStatus} />
                  {(order.transactionId || (order as any).paymentId) && (
                     <InfoRow icon={Tag} label="Transaction ID" value={order.transactionId || (order as any).paymentId} />
                  )}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
                <h4 className="font-extrabold text-[14px] text-[#111827] mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#FF6B00]" /> Bill Summary
                </h4>
                <div className="space-y-3">
                  {(() => {
                    const subtotal = order.bill?.subTotal ?? order.bill?.subtotal ?? order.subtotal ?? order.price;
                    const discount = order.bill?.discount ?? order.discount ?? order.savedAmount;
                    const packageCharge = order.bill?.packageCharge ?? order.packageCharge;
                    const deliveryCharge = order.bill?.deliveryCharge ?? order.deliveryCharge;
                    const tax = order.bill?.tax ?? order.tax;

                    return (
                      <>
                        {subtotal !== undefined && subtotal !== null && (
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-medium text-[#6B7280]">Item Total</span>
                            <span className="font-bold text-[#111827]">₹{subtotal.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {discount !== undefined && discount !== null && discount > 0 && (
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-bold text-[#059669]">Coupon Discount</span>
                            <span className="font-bold text-[#059669]">-₹{discount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {packageCharge !== undefined && packageCharge !== null && packageCharge > 0 && (
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-medium text-[#6B7280]">Packing Charge</span>
                            <span className="font-bold text-[#111827]">₹{packageCharge.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {deliveryCharge !== undefined && deliveryCharge !== null && (
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-medium text-[#6B7280]">Delivery Charge</span>
                            <span className="font-bold text-[#111827]">₹{deliveryCharge.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {tax !== undefined && tax !== null && tax > 0 && (
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-medium text-[#6B7280]">Taxes</span>
                            <span className="font-bold text-[#111827]">₹{tax.toLocaleString()}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-none bg-white p-4 md:px-6 md:py-4 border-t border-[#F1F5F9] z-10 sticky bottom-0">
          <div className="flex justify-between items-center">
            {total !== undefined && total !== null ? (
              <div>
                <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5">Total Amount</p>
                <p className="text-[24px] font-black text-[#FF6B00] leading-none">₹{total.toLocaleString()}</p>
              </div>
            ) : (
               <div />
            )}
            <Button
              className="rounded-full font-bold h-12 px-6 bg-[#FF6B00] hover:bg-[#EA580C] text-white shadow-[0_4px_12px_rgba(255,107,0,0.2)] gap-2"
              onClick={() => handleRepeatOrder(order!)}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <RotateCcw className="h-5 w-5" />}
              {isPending ? 'Processing...' : 'Reorder Items'}
            </Button>
          </div>
        </div>

      </DialogContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={cancelReorder}>
        <AlertDialogContent className="rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Switch Outlet?</AlertDialogTitle>
            <AlertDialogDescription>
              This order belongs to a different outlet. Switch to that outlet and reorder?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { confirmReorder(); onClose(); }} className="bg-[#FF6B00] hover:bg-[#EA580C] rounded-full font-bold text-white">
              Switch & Reorder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Dialog>
  );
};
