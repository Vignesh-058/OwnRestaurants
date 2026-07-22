import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Plus, Clock } from 'lucide-react';
import { CreditCard as CreditCardIcon, Banknote, Smartphone } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartDetails } from '@/hooks/queries/useCart';
import { useAddresses } from '@/hooks/queries/useAddresses';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useCartStore } from '@/store/CartStore';
import { PageLoader } from '@/components/common/PageLoader';
import { ErrorState } from '@/components/common/ErrorState';
import { useSettingsStore } from '@/store/SettingsStore';
import { useAuthStore } from '@/store/AuthStore';
import { useAddressStore } from '@/store/AddressStore';
import { isValidMongoId } from '@/utils/cartPayload';
import { useOrderCheckout } from '@/hooks/mutations/useOrderCheckout';
import { toast } from 'sonner';
import { DiscountList } from '@/components/discount/DiscountList';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useActivePreBooking } from '@/hooks/queries/usePreBooking';

import { useSearchParams } from 'react-router-dom';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { clearCart, orderId, tableInfo, preBookingId: storePreBookingId, preOrderDate: storePreOrderDate, preOrderTime: storePreOrderTime, setPreBooking } = useCartStore();
  const { user } = useAuthStore();
  const { mutateAsync: checkoutOrder } = useOrderCheckout();
  const { mutate: updateCart } = useUpdateCart();

  const urlPreBookingId = searchParams.get('preBookingId');
  const urlPreOrderDate = searchParams.get('preOrderDate');
  const urlPreOrderTime = searchParams.get('preOrderTime');

  const preBookingId = storePreBookingId || urlPreBookingId;
  const preOrderDate = storePreOrderDate || urlPreOrderDate;
  const preOrderTime = storePreOrderTime || urlPreOrderTime;

  useEffect(() => {
    if (urlPreBookingId && urlPreOrderDate && urlPreOrderTime) {
      setPreBooking({
        preBookingId: urlPreBookingId,
        preOrderDate: urlPreOrderDate,
        preOrderTime: urlPreOrderTime
      });
    }
  }, [urlPreBookingId, urlPreOrderDate, urlPreOrderTime, setPreBooking]);

  const settings = useSettingsStore((state) => state.settings);

  const availableOrderTypes = selectedOutlet?.orderType?.length 
    ? selectedOutlet.orderType 
    : ['Door Delivery', 'Self Pickup', 'Dine In'];
    
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [deliveryType, setDeliveryType] = useState<string>(availableOrderTypes[0]);
  const [orderTiming, setOrderTiming] = useState<'now' | 'later'>('now');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');

  // Make sure deliveryType updates if available order types change (e.g. outlet switch)
  useEffect(() => {
    if (availableOrderTypes.length > 0 && !availableOrderTypes.includes(deliveryType)) {
      setDeliveryType(availableOrderTypes[0]);
    }
  }, [availableOrderTypes, deliveryType]);

  const handleDeliveryTypeChange = (type: string) => {
    setDeliveryType(type);
    
    if (orderId && selectedOutlet) {
      const items = useCartStore.getState().cartItems.map(c => ({
        itemId: c.product_retailer_id,
        quantity: c.quantity,
        variationId: c.variationId || "",
        addOnDetails: c.addons || [],
        currency: org?.currency === '₹' ? 'INR' : (org?.currency || 'INR')
      }));

      updateCart({
        orderId,
        outletId: selectedOutlet._id,
        customerPhoneNo: user?.phone || '0000000000',
        customerName: user?.name || 'Guest',
        items,
        deliveryType: type,
        orderType: type,
        instruction: type === 'Dine In' && tableInfo ? `Table: ${tableInfo.tableName}` : '',
        ...(selectedAddress && type === 'Door Delivery' && isValidMongoId(selectedAddress._id) ? { addressId: selectedAddress._id } : {})
      });
    }
  };

  const handleAddressChange = (addr: any) => {
    useAddressStore.getState().selectAndUseAddressForDelivery(addr);
    setSelectedAddress(addr);
    setIsAddressListOpen(false);

    if (orderId && selectedOutlet && deliveryType === 'Door Delivery' && isValidMongoId(addr._id)) {
      const items = useCartStore.getState().cartItems.map(c => ({
        itemId: c.product_retailer_id,
        quantity: c.quantity,
        variationId: c.variationId || "",
        addOnDetails: c.addons || [],
        currency: org?.currency === '₹' ? 'INR' : (org?.currency || 'INR')
      }));

      updateCart({
        orderId,
        outletId: selectedOutlet._id,
        customerPhoneNo: user?.phone || '0000000000',
        customerName: user?.name || 'Guest',
        items,
        deliveryType,
        orderType: deliveryType,
        instruction: '',
        addressId: addr._id
      });
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);

  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>(settings?.defaultPaymentMode || 'COD');
  
  // Specific selection for online payment subtypes
  const [onlineMethod, setOnlineMethod] = useState<string | null>(null);
  
  // Coupon handled by DiscountList

  const { data: cart, isLoading: isCartLoading, isError: isCartError } = useCartDetails({
    customerPhoneNo: user?.phone || '0000000000',
    outletId: selectedOutlet?._id || ''
  });
  const { data: addresses, isLoading: isAddrLoading } = useAddresses();

  // Auto-initialize selected address if not yet set
  useEffect(() => {
    if (!selectedAddress) {
      const addrStore = useAddressStore.getState();
      const active = addrStore.selectedAddress || addrStore.deliveryAddress || (addresses && addresses.length > 0 ? addresses[0] : null);
      if (active) {
        setSelectedAddress(active);
      }
    }
  }, [addresses, selectedAddress]);



  const subtotal = cart?.orderTotal || 0;
  const hasCouponOrOffer = !!(cart?.appliedOfferId || cart?.couponName || (cart as any)?.appliedCoupon);
  const rawDiscount = hasCouponOrOffer ? (cart?.discountAmount ?? cart?.couponDiscount ?? cart?.savedAmount ?? 0) : 0;
  const discountAmount = Math.min(subtotal, Math.max(0, rawDiscount));

  const calculatedGrandTotal = Math.max(0, subtotal + (cart?.deliveryCharge || 0) + (cart?.totalTax || 0) - discountAmount);
  const finalTotal = Math.max(0, (hasCouponOrOffer && cart?.grandTotal) ? cart.grandTotal : calculatedGrandTotal);

  if (import.meta.env.DEV) {
    console.log('[DEBUG Checkout] Derived Final Total:', {
      orderTotal: cart?.orderTotal,
      deliveryCharge: cart?.deliveryCharge,
      totalTax: cart?.totalTax,
      discountAmount,
      calculatedGrandTotal,
      grandTotal: cart?.grandTotal,
      finalTotal
    });
  }

  const handlePlaceOrder = async () => {
    const cartObj = Array.isArray(cart) ? cart[0] : cart;
    const activeOrderId = orderId || cartObj?.orderId || cartObj?._id || new Date().toISOString().replace(/\D/g, '');
    const activeOutletId = selectedOutlet?._id;

    if (!selectedOutlet || !activeOutletId) {
      toast.error('Please select an outlet to continue.');
      return;
    }
    if (!deliveryType) {
      toast.error('Please select a delivery type.');
      return;
    }
    if (deliveryType === 'Door Delivery' && !selectedAddress) {
      toast.error('Please select a delivery address to continue.');
      setIsAddressListOpen(true);
      return;
    }
    if (deliveryType === 'Dine In' && !tableInfo && !searchParams.get('tableId')) {
      toast.error('Please select or scan a Dine-In table.');
      return;
    }
    if (selectedPaymentMode === 'Online Payment' && !onlineMethod) {
      toast.error('Please select an online payment method.');
      return;
    }

    const payload: any = {
      orderId: activeOrderId,
      outletId: activeOutletId,
      customerPhoneNo: user?.phone || '0000000000',
      orderType: deliveryType,
      paymentMode: selectedPaymentMode,
    };

    if (onlineMethod) payload.onlineMethod = onlineMethod;
    if (orderTiming === 'later') {
      if (scheduleDate) payload.scheduleDate = scheduleDate;
      if (scheduleTime) payload.scheduleTime = scheduleTime;
    }
    
    if (preBookingId) payload.preBookingId = preBookingId;
    if (preOrderDate) payload.preOrderDate = preOrderDate;
    if (preOrderTime) payload.preOrderTime = preOrderTime;
    
    if (deliveryType === 'Dine In') {
      const storeGuests = useCartStore.getState().numberOfGuests;
      const urlGuests = searchParams.get('numberOfGuests');
      const urlTableId = searchParams.get('tableId');
      
      const activeTableId = tableInfo?.tableId || urlTableId;
      const activeGuests = storeGuests || (urlGuests ? parseInt(urlGuests, 10) : null);
      
      if (activeTableId) payload.tableId = activeTableId;
      if (activeGuests) payload.numberOfGuests = activeGuests;
    }

    if (selectedAddress && deliveryType === 'Door Delivery') {
      if (isValidMongoId(selectedAddress._id)) {
        payload.addressId = selectedAddress._id;
      }
      if (selectedAddress.state) payload.state = selectedAddress.state;
      if (selectedAddress.city) payload.city = selectedAddress.city;
      if (selectedAddress.pincode) payload.pincode = selectedAddress.pincode;
      if (selectedAddress.latitude !== undefined) payload.latitude = selectedAddress.latitude;
      if (selectedAddress.longitude !== undefined) payload.longitude = selectedAddress.longitude;
    }

    setIsProcessing(true);
    
    try {
      if (import.meta.env.DEV) {
        console.log('[Order Checkout API Request]:', JSON.stringify(payload, null, 2));
      }
      
      const res = await checkoutOrder(payload);
      
      const createdOrderId = res?.data?.orderId || res?.data?.data?.orderId || activeOrderId;
      const successMessage = res?.message || (selectedPaymentMode === 'COD' ? "Order Placed Successfully!" : `Redirecting to ${onlineMethod} Gateway...`);

      clearCart();
      toast.success(successMessage);
      navigate(`/order-success/${createdOrderId}`);
    } catch (error: any) {
      console.error('[Order Checkout API Error]:', error);
      toast.error(error?.response?.data?.message || 'Unable to complete order checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCartLoading || isAddrLoading) return <PageLoader />;
  if (isCartError || !cart || (cart.items || []).length === 0) return <ErrorState description="Your cart is empty or could not be loaded." />;

  const onlineOptions = [
    { id: 'gpay', name: 'Google Pay', type: 'upi' },
    { id: 'phonepe', name: 'PhonePe', type: 'upi' },
    { id: 'paytm', name: 'Paytm', type: 'upi' },
    { id: 'bhim', name: 'BHIM UPI', type: 'upi' },
    { id: 'credit', name: 'Credit Card', type: 'card' },
    { id: 'debit', name: 'Debit Card', type: 'card' },
    { id: 'amazon', name: 'Amazon Pay', type: 'wallet' },
    { id: 'mobikwik', name: 'Mobikwik', type: 'wallet' },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center p-4 sm:px-6 md:px-8 h-[72px]">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl hover:bg-muted">
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Button>
          <h1 className="ml-4 font-extrabold text-[20px] text-foreground flex-1">Checkout</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        <div 
          className="flex flex-col lg:grid lg:grid-cols-[65fr_35fr] md:grid-cols-[70fr_30fr] gap-5 xl:gap-6 lg:pb-0 items-start transition-all duration-300"
          style={{ paddingBottom: 'calc(8rem + var(--floating-nav-height, 0px))' }}
        >
          
          {/* LEFT COLUMN: Addresses, Pre-Booking, Payment */}
          <div className="flex-1 space-y-6 md:space-y-8 w-full">
            
            {preBookingId && preOrderDate && preOrderTime && (
              <div className="bg-primary/10 p-4 md:p-5 rounded-[20px] shadow-sm border border-primary/20 flex items-start gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <h3 className="font-extrabold text-[16px] text-primary">Pre-order Scheduled</h3>
                    <p className="text-[13px] text-primary/80 font-medium mt-1">
                      For {new Date(preOrderDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {preOrderTime}
                    </p>
                 </div>
              </div>
            )}

            {/* Delivery Details (Merged Card) */}
            <div className="bg-card p-4 md:p-5 rounded-[20px] shadow-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[16px] text-foreground">Delivery Details</h3>
                    <p className="text-[12px] text-muted-foreground">How and where to deliver?</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/address')} 
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${availableOrderTypes.length || 1}, minmax(0, 1fr))` }}
                >
                  {availableOrderTypes.map((type) => (
                    <div 
                      key={type}
                      onClick={() => handleDeliveryTypeChange(type)}
                      className={`relative p-2.5 border rounded-[12px] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                        deliveryType === type 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border bg-card hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="font-bold text-[12px]">{type}</span>
                    </div>
                  ))}
                </div>

                {/* Dynamic Fulfillment Information */}
                {deliveryType === 'Door Delivery' && (
                  <div className="mt-4 border-t border-border pt-4">
                    {!isAddressListOpen && selectedAddress ? (
                      <div className="flex items-start justify-between bg-muted p-3 rounded-[12px] border border-border">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-bold text-foreground uppercase tracking-wider">
                               {selectedAddress.type}
                            </span>
                          </div>
                          <p className="text-[13px] text-muted-foreground line-clamp-1">
                            {`${selectedAddress.address1}, ${selectedAddress.address2 || ''}, ${selectedAddress.city}`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={() => setIsAddressListOpen(true)} className="text-[12px] font-bold text-primary hover:underline">Edit</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-[14px] text-foreground">Select Address</h4>
                        </div>
                        {addresses && addresses.length > 0 ? (
                          addresses.map((addr) => (
                            <div 
                              key={addr._id} 
                              className={`relative p-3 border rounded-[12px] cursor-pointer transition-all ${
                                selectedAddress?._id === addr._id 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border bg-card'
                              }`}
                              onClick={() => handleAddressChange(addr)}
                            >
                              <p className="text-[13px] font-bold text-foreground uppercase mb-1"> {addr.type}</p>
                              <p className="text-[12px] text-muted-foreground line-clamp-1">
                                {`${addr.address1}, ${addr.city}, ${addr.state}`}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[12px] text-muted-foreground">No addresses found.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {deliveryType === 'Self Pickup' && selectedOutlet && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="bg-muted p-3 rounded-[12px] border border-border">
                      <h4 className="font-bold text-[13px] text-foreground mb-1">Pickup Outlet</h4>
                      <p className="text-[13px] text-muted-foreground">{selectedOutlet.outletName}</p>
                      <p className="text-[12px] text-muted-foreground mt-1">{selectedOutlet.address}</p>
                    </div>
                  </div>
                )}
                
                {deliveryType === 'Dine In' && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="bg-muted p-3 rounded-[12px] border border-border">
                      <h4 className="font-bold text-[13px] text-foreground mb-1">Table Selection</h4>
                      {tableInfo ? (
                        <p className="text-[13px] text-primary font-bold">Selected Table: {tableInfo.tableName}</p>
                      ) : (
                        <p className="text-[13px] text-muted-foreground">No table selected. Scan QR code on your table.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>



            {/* Choose Payment Method */}
            <div className="bg-card p-4 md:p-5 rounded-[20px] shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[16px] text-foreground">Payment Method</h3>
                  <p className="text-[12px] text-muted-foreground">Choose how you'd like to pay</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                {(!settings?.paymentMode || settings.paymentMode.includes('COD')) && (
                  <div 
                    className={`relative p-3 border rounded-[16px] cursor-pointer transition-all duration-300 ${
                      selectedPaymentMode === 'COD' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card hover:bg-muted'
                    }`}
                    onClick={() => setSelectedPaymentMode('COD')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedPaymentMode === 'COD' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-foreground">Cash on Delivery</h4>
                          <p className="text-[12px] text-muted-foreground">Pay when order arrives</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Online Payment */}
                {(!settings?.paymentMode || settings.paymentMode.includes('Online Payment')) && (
                  <div 
                    className={`relative border rounded-[16px] transition-all duration-300 ${
                      selectedPaymentMode === 'Online Payment' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-border bg-card hover:bg-muted'
                    }`}
                  >
                    <div 
                      className="p-3 cursor-pointer flex items-center justify-between"
                      onClick={() => setSelectedPaymentMode('Online Payment')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedPaymentMode === 'Online Payment' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-foreground">Online Payment</h4>
                          <p className="text-[12px] text-muted-foreground">UPI • Cards • Net Banking</p>
                        </div>
                      </div>
                    </div>

                    {selectedPaymentMode === 'Online Payment' && (
                      <div className="px-3 pb-3 pt-1 border-t border-blue-200">
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {onlineOptions.filter(o => o.type === 'upi' || o.type === 'card').map((opt) => (
                            <div 
                              key={opt.id}
                              onClick={() => setOnlineMethod(opt.name)}
                              className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                                onlineMethod === opt.name ? 'border-blue-500 bg-card' : 'border-border bg-card/50 hover:bg-card'
                              }`}
                            >
                              <span className="text-[11px] font-bold text-foreground">{opt.name}</span>
                              {onlineMethod === opt.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Order Summary */}
          <div className="w-full lg:sticky lg:top-24 flex flex-col gap-4 relative z-10">
            
            <div className="bg-card p-4 md:p-5 rounded-[20px] shadow-sm border border-border">
              <h3 className="font-extrabold text-[18px] text-foreground mb-4">Order Summary</h3>
              
              {/* Coupon Section (Integrated) */}
              <div className="mb-5 pb-5 border-b border-border">
                <DiscountList />
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="text-foreground font-bold">{(org?.currency || '₹').replace(/\$/g, '')}{cart.orderTotal.toFixed(2)}</span>
                </div>

                {cart.deliveryCharge > 0 && (
                  <div className="flex justify-between items-start text-[14px]">
                    <span className="text-muted-foreground font-medium">Delivery</span>
                    <span className="text-foreground font-bold">{(org?.currency || '₹').replace(/\$/g, '')}{cart.deliveryCharge?.toFixed(2) || '0.00'}</span>
                  </div>
                )}

                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-muted-foreground font-medium">Tax</span>
                  <span className="text-foreground font-bold">{(org?.currency || '₹').replace(/\$/g, '')}{cart.totalTax.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-start text-[14px]">
                    <span className="text-green-600 font-bold">Discount</span>
                    <span className="text-green-600 font-bold">-{(org?.currency || '₹').replace(/\$/g, '')}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-border pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[16px] text-foreground">Grand Total</span>
                  <span className="font-bold text-[32px] text-primary leading-none">
                    {(org?.currency || '₹').replace(/\$/g, '')}{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Desktop / Sticky Footer Button */}
              <div className="fixed left-0 right-0 p-4 md:p-0 bg-card md:bg-transparent border-t md:border-t-0 border-border z-50 md:static transition-all duration-300" style={{ bottom: 'var(--floating-nav-height, 0px)' }}>
                <Button 
                  className={`w-full h-[56px] rounded-[16px] px-6 shadow-sm hover:shadow-md transition-all duration-300 border-0 ${
                    selectedPaymentMode === 'Online Payment' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="font-extrabold text-[16px] text-primary-foreground flex items-center justify-center gap-2 w-full">
                      <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="font-extrabold text-[16px] text-primary-foreground flex items-center justify-center gap-2 w-full">
                      {selectedPaymentMode === 'Online Payment' ? 'Proceed to Pay' : 'Proceed to Checkout'} • {(!org?.currency || org.currency === '$') ? '₹' : org.currency.replace(/\$/g, '₹')}{finalTotal.toFixed(2)}
                    </span>
                  )}
                </Button>
                
                {deliveryType === 'Door Delivery' && !selectedAddress && !isProcessing && (
                  <p className="text-destructive text-[11px] font-bold text-center mt-2 hidden md:block">
                    Select a delivery address to continue
                  </p>
                )}
                {deliveryType === 'Dine In' && !tableInfo && !isProcessing && (
                  <p className="text-destructive text-[11px] font-bold text-center mt-2 hidden md:block">
                    Scan a QR code on your table to continue
                  </p>
                )}
                {selectedPaymentMode === 'Online Payment' && !onlineMethod && !isProcessing && (
                  <p className="text-destructive text-[11px] font-bold text-center mt-2 hidden md:block">
                    Select an online payment method
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
