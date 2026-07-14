import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, CheckCircle2, Lock, Gift, Calendar, Ticket, Plus } from 'lucide-react';
import { Wallet, CreditCard as CreditCardIcon, Banknote, Smartphone } from 'lucide-react'; 
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
import { isValidMongoId } from '@/utils/cartPayload';
import { orderService } from '@/services/order.service';
import { toast } from 'sonner';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [deliveryType, setDeliveryType] = useState<string>('Door Delivery');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const settings = useSettingsStore((state) => state.settings);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>(settings?.defaultPaymentMode || 'COD');
  
  // Specific selection for online payment subtypes
  const [onlineMethod, setOnlineMethod] = useState<string | null>(null);

  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const { data: cart, isLoading: isCartLoading, isError: isCartError } = useCartDetails({
    customerPhoneNo: user?.phone || '0000000000',
    outletId: selectedOutlet?._id || ''
  });
  const { data: addresses, isLoading: isAddrLoading } = useAddresses();

  const cartGrandTotal = cart ? (cart.orderTotal + (cart.deliveryCharge || 0) + (cart.totalTax || 0)) : 0;
  const finalTotal = cartGrandTotal - (isCouponApplied ? 50 : 0);

  const handlePlaceOrder = async () => {
    if (!deliveryType) {
      toast.error('Please select a delivery type.');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address.');
      return;
    }
    
    if (selectedPaymentMode === 'Online Payment' && !onlineMethod) {
      toast.error('Please select an online payment method');
      return;
    }

    // Prepare payload for when the Place Order API is integrated
    const payload: any = {
      items: cart?.items?.map((item: any) => ({
        itemId: item.product_retailer_id,
        quantity: item.quantity,
        price: item.item_price,
        variation_id: item.variationId,
        addons: item.addons
      })) || [],
      deliveryType,
      orderType: deliveryType,
      customerName: user?.name || (user as any)?.firstName || 'Guest',
      customerPhoneNo: user?.phone || '0000000000',
      outletId: selectedOutlet?._id,
      paymentMode: selectedPaymentMode,
    };

    if (onlineMethod) payload.onlineMethod = onlineMethod;
    if (scheduleDate) payload.scheduleDate = scheduleDate;
    if (scheduleTime) payload.scheduleTime = scheduleTime;
    if (isCouponApplied && couponCode) payload.couponCode = couponCode;

    if (selectedAddress) {
      if (isValidMongoId(selectedAddress._id)) {
        payload.addressId = selectedAddress._id;
      } else {
        const lat = Number(selectedAddress.latitude);
        const lng = Number(selectedAddress.longitude);
        
        if (!selectedAddress.address1 || !selectedAddress.city || !selectedAddress.state || !selectedAddress.country || !selectedAddress.pincode || isNaN(lat) || isNaN(lng)) {
          toast.error('Incomplete delivery address. Please provide all required fields including valid location.');
          return;
        }

        payload.address1 = selectedAddress.address1;
        payload.address2 = selectedAddress.address2 || '';
        payload.city = selectedAddress.city;
        payload.state = selectedAddress.state;
        payload.country = selectedAddress.country;
        payload.pincode = selectedAddress.pincode;
        payload.latitude = lat;
        payload.longitude = lng;
      }
    }

    setIsProcessing(true);
    
    try {
      // Print the exact request payload as requested
      console.log('--- EXACT PLACE ORDER PAYLOAD ---');
      console.log('selectedAddress:', selectedAddress);
      console.log('request payload:', JSON.stringify(payload, null, 2));
      console.log('---------------------------------');
      
      const response = await orderService.placeOrder(payload);
      console.log('API response:', response);
      
      clearCart();
      if (selectedPaymentMode === 'COD') {
        toast.success("Order Placed Successfully!");
        navigate('/orders');
      } else {
        toast.success(`Redirecting to ${onlineMethod} Gateway...`);
        navigate('/orders');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to place order.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setIsCouponApplied(true);
      toast.success("Coupon applied successfully!");
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
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center p-4 sm:px-6 md:px-8 h-[72px]">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-[#F1F5F9]">
            <ChevronLeft className="h-6 w-6 text-[#111827]" />
          </Button>
          <h1 className="ml-4 font-extrabold text-[20px] text-[#111827] flex-1">Checkout</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:grid lg:grid-cols-[65fr_35fr] md:grid-cols-[70fr_30fr] gap-5 xl:gap-6 pb-32 lg:pb-0 items-start">
          
          {/* LEFT COLUMN: Addresses, Pre-Booking, Payment */}
          <div className="flex-1 space-y-6 md:space-y-8 w-full">
            
            {/* Delivery Details (Merged Card) */}
            <div className="bg-white p-4 md:p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[16px] text-[#111827]">Delivery Details</h3>
                    <p className="text-[12px] text-[#6B7280]">How and where to deliver?</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/address')} 
                  className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center hover:bg-[#FF6B00] hover:text-white text-[#FF6B00] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Delivery Type Compact */}
                <div className="grid grid-cols-3 gap-2">
                  {['Door Delivery', 'Self Pickup', 'Dine In'].map((type) => (
                    <div 
                      key={type}
                      onClick={() => setDeliveryType(type)}
                      className={`relative p-2.5 border rounded-[12px] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                        deliveryType === type 
                          ? 'border-[#FF6B00] bg-[#FFF7ED] text-[#FF6B00]' 
                          : 'border-[#F1F5F9] bg-white hover:bg-[#F8FAFC] text-[#4B5563]'
                      }`}
                    >
                      <span className="font-bold text-[12px]">{type}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Compact View */}
                {deliveryType === 'Door Delivery' && (
                  <div className="mt-4 border-t border-[#F1F5F9] pt-4">
                    {!isAddressListOpen && selectedAddress ? (
                      <div className="flex items-start justify-between bg-[#F8FAFC] p-3 rounded-[12px] border border-[#E5E7EB]">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-bold text-[#111827] uppercase tracking-wider">
                              🏠 {selectedAddress.type}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#4B5563] line-clamp-1">
                            {`${selectedAddress.address1}, ${selectedAddress.address2 || ''}, ${selectedAddress.city}`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={() => setIsAddressListOpen(true)} className="text-[12px] font-bold text-[#FF6B00] hover:underline">Edit</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-[14px] text-[#111827]">Select Address</h4>
                        </div>
                        {addresses && addresses.length > 0 ? (
                          addresses.map((addr) => (
                            <div 
                              key={addr._id} 
                              className={`relative p-3 border rounded-[12px] cursor-pointer transition-all ${
                                selectedAddress?._id === addr._id 
                                  ? 'border-[#FF6B00] bg-[#FFF7ED]' 
                                  : 'border-[#E5E7EB] bg-white'
                              }`}
                              onClick={() => {
                                setSelectedAddress(addr);
                                setIsAddressListOpen(false);
                              }}
                            >
                              <p className="text-[13px] font-bold text-[#111827] uppercase mb-1">🏠 {addr.type}</p>
                              <p className="text-[12px] text-[#4B5563] line-clamp-1">
                                {`${addr.address1}, ${addr.city}, ${addr.state}`}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[12px] text-[#6B7280]">No addresses found.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pre-Booking (Schedule Order) */}
            {settings?.preBookingEnabled && (
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9] overflow-hidden">
                <div 
                  className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC]"
                  onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#FF6B00]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[16px] text-[#111827]">Schedule Order <span className="font-normal text-[12px] text-[#6B7280]">(Optional)</span></h3>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${isScheduleOpen ? 'rotate-180' : ''}`}>▼</div>
                </div>
                
                {isScheduleOpen && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2 border-t border-[#F1F5F9]">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 space-y-1">
                        <label className="text-[12px] font-bold text-[#4B5563]">Date</label>
                        <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="rounded-[12px] h-11 bg-[#F8FAFC] border-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] text-[13px]" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[12px] font-bold text-[#4B5563]">Time</label>
                        <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="rounded-[12px] h-11 bg-[#F8FAFC] border-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] text-[13px]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Choose Payment Method */}
            <div className="bg-white p-4 md:p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[16px] text-[#111827]">Payment Method</h3>
                  <p className="text-[12px] text-[#6B7280]">Choose how you'd like to pay</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                {(!settings?.paymentMode || settings.paymentMode.includes('COD')) && (
                  <div 
                    className={`relative p-3 border rounded-[16px] cursor-pointer transition-all duration-300 ${
                      selectedPaymentMode === 'COD' 
                        ? 'border-[#FF6B00] bg-[#FFF7ED]' 
                        : 'border-[#F1F5F9] bg-white hover:bg-[#F8FAFC]'
                    }`}
                    onClick={() => setSelectedPaymentMode('COD')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedPaymentMode === 'COD' ? 'bg-[#FF6B00] text-white' : 'bg-[#FFF7ED] text-[#FF6B00]'
                        }`}>
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-[#111827]">Cash on Delivery</h4>
                          <p className="text-[12px] text-[#6B7280]">Pay when order arrives</p>
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
                        ? 'border-[#3B82F6] bg-[#EFF6FF]' 
                        : 'border-[#F1F5F9] bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div 
                      className="p-3 cursor-pointer flex items-center justify-between"
                      onClick={() => setSelectedPaymentMode('Online Payment')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedPaymentMode === 'Online Payment' ? 'bg-[#3B82F6] text-white' : 'bg-[#EFF6FF] text-[#3B82F6]'
                        }`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-[#111827]">Online Payment</h4>
                          <p className="text-[12px] text-[#6B7280]">UPI • Cards • Net Banking</p>
                        </div>
                      </div>
                    </div>

                    {selectedPaymentMode === 'Online Payment' && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#BFDBFE]">
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {onlineOptions.filter(o => o.type === 'upi' || o.type === 'card').map((opt) => (
                            <div 
                              key={opt.id}
                              onClick={() => setOnlineMethod(opt.name)}
                              className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                                onlineMethod === opt.name ? 'border-[#3B82F6] bg-white' : 'border-[#F1F5F9] bg-white/50 hover:bg-white'
                              }`}
                            >
                              <span className="text-[11px] font-bold text-[#334155]">{opt.name}</span>
                              {onlineMethod === opt.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
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
            
            <div className="bg-white p-4 md:p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <h3 className="font-extrabold text-[18px] text-[#111827] mb-4">Order Summary</h3>
              
              {/* Coupon Section (Integrated) */}
              <div className="mb-5 pb-5 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-[13px] font-bold text-[#111827]">Have a Coupon?</span>
                </div>
                {!isCouponApplied ? (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter promo code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-10 rounded-[10px] bg-[#F8FAFC] border-[#E5E7EB] focus-visible:ring-1 focus-visible:ring-[#FF6B00] uppercase font-bold text-[12px]" 
                    />
                    <Button 
                      className="h-10 rounded-[10px] px-4 font-bold bg-[#111827] text-white hover:bg-[#374151] text-[12px]" 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#059669]/10 border border-[#059669]/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <p className="font-bold text-[12px] text-[#059669]">"{couponCode.toUpperCase()}" Applied!</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[#059669] hover:bg-[#059669]/20 font-bold text-[11px] px-2" onClick={() => { setIsCouponApplied(false); setCouponCode(''); }}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-[#6B7280] font-medium">Subtotal</span>
                  <span className="text-[#111827] font-bold">{org?.currency || '₹'}{cart.orderTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-[#6B7280] font-medium">Delivery</span>
                  <span className="text-[#111827] font-bold">{org?.currency || '₹'}{cart.deliveryCharge?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-[#6B7280] font-medium">Tax</span>
                  <span className="text-[#111827] font-bold">{org?.currency || '₹'}{cart.totalTax.toFixed(2)}</span>
                </div>

                {isCouponApplied && (
                  <div className="flex justify-between items-start text-[14px]">
                    <span className="text-[#059669] font-bold">Discount</span>
                    <span className="text-[#059669] font-bold">-{org?.currency || '₹'}50.00</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-[#E5E7EB] pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[16px] text-[#111827]">Grand Total</span>
                  <span className="font-bold text-[32px] text-[#FF6B00] leading-none">
                    {org?.currency || '₹'}{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Desktop / Sticky Footer Button */}
              <div className="fixed bottom-0 left-0 right-0 p-4 md:p-0 bg-white md:bg-transparent border-t md:border-t-0 border-[#E5E7EB] z-50 md:static">
                <Button 
                  className={`w-full h-[56px] rounded-[16px] px-6 shadow-[0_8px_24px_rgba(255,107,0,0.25)] hover:shadow-[0_12px_28px_rgba(255,107,0,0.35)] hover:-translate-y-1 transition-all duration-300 border-0 ${
                    selectedPaymentMode === 'Online Payment' ? 'bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_8px_24px_rgba(59,130,246,0.25)]' : 'bg-[#FF6B00] hover:bg-[#E65C00]'
                  }`}
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || isProcessing || (selectedPaymentMode === 'Online Payment' && !onlineMethod)}
                >
                  {isProcessing ? (
                    <span className="font-extrabold text-[16px] text-white flex items-center justify-center w-full">Processing...</span>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-[16px] text-white">
                        {selectedPaymentMode === 'Online Payment' ? 'Proceed to Pay' : 'Proceed to Checkout'}
                      </span>
                      <span className="font-bold text-[18px] text-white bg-white/20 px-3 py-1 rounded-[10px]">
                        {org?.currency || '₹'}{finalTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                </Button>
                
                {(!selectedAddress || (selectedPaymentMode === 'Online Payment' && !onlineMethod)) && (
                  <p className="text-[#EF4444] text-[11px] font-bold text-center mt-2 hidden md:block">
                    {!selectedAddress ? 'Select a delivery address to continue' : 'Select an online payment method'}
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
