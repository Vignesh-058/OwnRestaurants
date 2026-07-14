import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, CheckCircle2, Lock, Gift, Calendar, Ticket } from 'lucide-react';
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
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-8 xl:gap-12 pb-32 lg:pb-0 items-start">
          
          {/* LEFT COLUMN: Addresses, Pre-Booking, Payment */}
          <div className="flex-1 space-y-6 md:space-y-8 w-full">
            
            {/* Delivery Type */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[18px] text-[#111827]">Delivery Type</h3>
                  <p className="text-[14px] text-[#6B7280] mt-0.5">How would you like to receive your order?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Door Delivery', 'Self Pickup', 'Dine In'].map((type) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={type}
                    onClick={() => setDeliveryType(type)}
                    className={`relative p-4 border-2 rounded-[16px] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                      deliveryType === type 
                        ? 'border-[#FF6B00] bg-[#FFF7ED] shadow-[0_4px_12px_rgba(255,107,0,0.05)] text-[#FF6B00]' 
                        : 'border-[#F1F5F9] bg-white hover:border-[#FFD8B3]/50 hover:bg-[#FFF7ED]/10 text-[#4B5563]'
                    }`}
                  >
                    <span className="font-bold text-[14px]">{type}</span>
                    {deliveryType === type && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6B00]" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[18px] text-[#111827]">Delivery Address</h3>
                    <p className="text-[14px] text-[#6B7280] mt-0.5">Where should we deliver?</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full font-bold border-[#E5E7EB]" size="sm" onClick={() => navigate('/address')}>
                  Add New
                </Button>
              </div>
              
              <div className="space-y-4">
                {addresses && addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={addr._id} 
                      className={`relative p-5 border-2 rounded-[20px] cursor-pointer transition-all duration-300 ${
                        selectedAddress?._id === addr._id 
                          ? 'border-[#FF6B00] bg-[#FFF7ED] shadow-[0_4px_12px_rgba(255,107,0,0.05)]' 
                          : 'border-[#F1F5F9] bg-white hover:border-[#FFD8B3]/50 hover:bg-[#FFF7ED]/10'
                      }`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="pr-12">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-[#111827] text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {addr.type}
                            </span>
                          </div>
                          <p className="text-[14.5px] text-[#4B5563] leading-relaxed line-clamp-2">
                            {`${addr.address1}, ${addr.address2 || ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`}
                          </p>
                        </div>
                        <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedAddress?._id === addr._id ? 'border-[#FF6B00]' : 'border-[#D1D5DB]'
                        }`}>
                          {selectedAddress?._id === addr._id && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              className="w-3 h-3 rounded-full bg-[#FF6B00]" 
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-[#6B7280] text-center py-6 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#E5E7EB]">
                    No saved addresses found.
                  </p>
                )}
              </div>
            </div>

            {/* Pre-Booking (Schedule Order) */}
            {settings?.preBookingEnabled && (
              <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[18px] text-[#111827]">Schedule Order</h3>
                    <p className="text-[14px] text-[#6B7280] mt-0.5">Plan your delivery ahead (Optional)</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[13px] font-bold text-[#4B5563]">Date</label>
                    <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="rounded-[16px] h-14 bg-[#F8FAFC] border-none focus-visible:ring-1 focus-visible:ring-[#FF6B00]" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[13px] font-bold text-[#4B5563]">Time</label>
                    <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="rounded-[16px] h-14 bg-[#F8FAFC] border-none focus-visible:ring-1 focus-visible:ring-[#FF6B00]" />
                  </div>
                </div>
              </div>
            )}

            {/* Choose Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[18px] text-[#111827]">Payment Method</h3>
                  <p className="text-[14px] text-[#6B7280] mt-0.5">Choose how you'd like to pay</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Cash on Delivery */}
                {(!settings?.paymentMode || settings.paymentMode.includes('COD')) && (
                  <motion.div 
                    whileHover={{ scale: selectedPaymentMode === 'COD' ? 1 : 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative p-5 border-2 rounded-[20px] cursor-pointer transition-all duration-300 overflow-hidden ${
                      selectedPaymentMode === 'COD' 
                        ? 'border-[#FF6B00] bg-[#FFF7ED] shadow-[0_4px_12px_rgba(255,107,0,0.05)]' 
                        : 'border-[#F1F5F9] bg-white hover:border-[#FFD8B3]/50 hover:bg-[#FFF7ED]/10'
                    }`}
                    onClick={() => setSelectedPaymentMode('COD')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                          selectedPaymentMode === 'COD' ? 'bg-[#FF6B00] text-white' : 'bg-[#FFF7ED] text-[#FF6B00]'
                        }`}>
                          <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[16px] text-[#111827]">Cash on Delivery</h4>
                          <p className="text-[13px] text-[#6B7280] mt-0.5">Pay when your order arrives</p>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedPaymentMode === 'COD' ? 'border-[#FF6B00]' : 'border-[#D1D5DB]'
                      }`}>
                        {selectedPaymentMode === 'COD' && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Online Payment */}
                {(!settings?.paymentMode || settings.paymentMode.includes('Online Payment')) && (
                  <motion.div 
                    whileHover={{ scale: selectedPaymentMode === 'Online Payment' ? 1 : 1.01 }}
                    className={`relative border-2 rounded-[20px] transition-all duration-300 overflow-hidden ${
                      selectedPaymentMode === 'Online Payment' 
                        ? 'border-[#3B82F6] bg-[#EFF6FF] shadow-[0_4px_12px_rgba(59,130,246,0.05)]' 
                        : 'border-[#F1F5F9] bg-white hover:border-[#BFDBFE]/50 hover:bg-[#EFF6FF]/30'
                    }`}
                  >
                    {/* Header Trigger */}
                    <div 
                      className="p-5 cursor-pointer flex items-center justify-between"
                      onClick={() => setSelectedPaymentMode('Online Payment')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                          selectedPaymentMode === 'Online Payment' ? 'bg-[#3B82F6] text-white' : 'bg-[#EFF6FF] text-[#3B82F6]'
                        }`}>
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[16px] text-[#111827]">Online Payment</h4>
                          <p className="text-[13px] text-[#6B7280] mt-0.5">UPI • Cards • Net Banking • Wallets</p>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedPaymentMode === 'Online Payment' ? 'border-[#3B82F6]' : 'border-[#D1D5DB]'
                      }`}>
                        {selectedPaymentMode === 'Online Payment' && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {selectedPaymentMode === 'Online Payment' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-5 pt-2"
                        >
                          <div className="bg-white rounded-[16px] p-4 border border-[#BFDBFE] space-y-5">
                            
                            {/* UPI Section */}
                            <div>
                              <h5 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3 ml-1">UPI Options</h5>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {onlineOptions.filter(o => o.type === 'upi').map((opt) => (
                                  <div 
                                    key={opt.id}
                                    onClick={() => setOnlineMethod(opt.name)}
                                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                                      onlineMethod === opt.name ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-[#F1F5F9] hover:bg-[#F8FAFC]'
                                    }`}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                                      <Smartphone className="w-4 h-4 text-[#64748B]" />
                                    </div>
                                    <span className="text-[12px] font-bold text-[#334155] text-center">{opt.name}</span>
                                    {onlineMethod === opt.name && (
                                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3B82F6]" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Cards Section */}
                            <div>
                              <h5 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3 ml-1">Cards</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {onlineOptions.filter(o => o.type === 'card').map((opt) => (
                                  <div 
                                    key={opt.id}
                                    onClick={() => setOnlineMethod(opt.name)}
                                    className={`relative p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                                      onlineMethod === opt.name ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-[#F1F5F9] hover:bg-[#F8FAFC]'
                                    }`}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                      <CreditCardIcon className="w-4 h-4 text-[#64748B]" />
                                    </div>
                                    <span className="text-[13px] font-bold text-[#334155]">{opt.name}</span>
                                    {onlineMethod === opt.name && (
                                      <div className="absolute top-1/2 -translate-y-1/2 right-3 w-2 h-2 rounded-full bg-[#3B82F6]" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Wallets Section */}
                            <div>
                              <h5 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3 ml-1">Wallets</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {onlineOptions.filter(o => o.type === 'wallet').map((opt) => (
                                  <div 
                                    key={opt.id}
                                    onClick={() => setOnlineMethod(opt.name)}
                                    className={`relative p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                                      onlineMethod === opt.name ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-[#F1F5F9] hover:bg-[#F8FAFC]'
                                    }`}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                      <Wallet className="w-4 h-4 text-[#64748B]" />
                                    </div>
                                    <span className="text-[13px] font-bold text-[#334155]">{opt.name}</span>
                                    {onlineMethod === opt.name && (
                                      <div className="absolute top-1/2 -translate-y-1/2 right-3 w-2 h-2 rounded-full bg-[#3B82F6]" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

              </div>

              {/* Secure Payments Banner */}
              <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-center gap-2 text-[#059669] mb-4">
                  <Lock className="w-4 h-4" />
                  <span className="font-bold text-[13px] uppercase tracking-wide">100% Safe & Secure Payments</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['Visa', 'Mastercard', 'RuPay', 'UPI', 'Google Pay', 'PhonePe', 'Paytm'].map((badge) => (
                    <span key={badge} className="px-3 py-1 bg-[#F8FAFC] border border-[#E5E7EB] text-[#64748B] text-[11px] font-bold rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & Coupon */}
          <div className="w-full lg:sticky lg:top-24 flex flex-col gap-6 relative z-10">
            
            {/* Coupon Section */}
            <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                  <Ticket className="w-4.5 h-4.5 text-[#FF6B00]" />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#111827]">Have a Coupon?</h3>
              </div>
              
              {!isCouponApplied ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter promo code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-12 rounded-[14px] bg-[#F8FAFC] border-[#E5E7EB] focus-visible:ring-1 focus-visible:ring-[#FF6B00] uppercase font-bold text-[14px]" 
                  />
                  <Button 
                    className="h-12 rounded-[14px] px-6 font-bold bg-[#111827] text-white hover:bg-[#374151]" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-[14px] bg-[#059669]/10 border border-[#059669]/20"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                    <div>
                      <p className="font-bold text-[14px] text-[#059669]">"{couponCode.toUpperCase()}" Applied!</p>
                      <p className="text-[12px] text-[#059669]/80 font-medium mt-0.5">Awesome! You saved money.</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#059669] hover:bg-[#059669]/20 font-bold" onClick={() => { setIsCouponApplied(false); setCouponCode(''); }}>
                    Remove
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Order Summary Box */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
              <h3 className="font-extrabold text-[20px] text-[#111827] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-[#6B7280] font-medium">Item Total</span>
                  <span className="text-[#111827] font-bold">{org?.currency || '₹'}{cart.orderTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-[#6B7280] font-medium">Delivery Charge</span>
                  <span className="text-[#111827] font-bold">{org?.currency || '₹'}{cart.deliveryCharge?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex justify-between items-start text-[14px]">
                  <span className="text-[#6B7280] font-medium">Taxes (GST)</span>
                  <span className="text-[#111827] font-bold">{org?.currency || '₹'}{cart.totalTax.toFixed(2)}</span>
                </div>

                {isCouponApplied && (
                  <div className="flex justify-between items-start text-[14px]">
                    <span className="text-[#059669] font-bold">Coupon Discount</span>
                    <span className="text-[#059669] font-bold">-{org?.currency || '₹'}50.00</span>
                  </div>
                )}
              </div>

              {/* Rewards Hint */}
              {settings?.checkOutSettings?.showRewards && cartGrandTotal < (settings.checkOutSettings.loyaltyMinimumAmount || 0) && (
                <div className="mb-6 p-4 rounded-[16px] bg-[#FFF7ED] border border-[#FFD8B3]/50 flex items-start gap-3">
                  <Gift className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-bold text-[#111827]">Unlock Rewards</p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5 leading-snug">
                      Add {org?.currency || '₹'}{(settings.checkOutSettings.loyaltyMinimumAmount - cartGrandTotal).toFixed(2)} more to unlock rewards for this order.
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t border-[#F1F5F9] pt-5 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[16px] text-[#6B7280]">Grand Total</span>
                  <div className="text-right">
                    <span className="block text-[12px] text-[#94A3B8] font-medium mb-1">Inclusive of all taxes</span>
                    <span className="font-black text-[28px] text-[#FF6B00] leading-none">
                      {org?.currency || '₹'}{(cartGrandTotal - (isCouponApplied ? 50 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop / Sticky Footer Button */}
              <div className="fixed bottom-0 left-0 right-0 p-4 md:p-0 bg-white md:bg-transparent border-t md:border-t-0 border-[#E5E7EB] z-50 md:static">
                <Button 
                  className={`w-full h-14 md:h-[60px] rounded-full text-[17px] font-extrabold text-white shadow-[0_8px_25px_rgba(255,107,0,0.25)] hover:-translate-y-1 transition-all duration-300 border-0 ${
                    selectedPaymentMode === 'Online Payment' ? 'bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_8px_25px_rgba(59,130,246,0.25)]' : 'bg-[#FF6B00] hover:bg-[#E65C00]'
                  }`}
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || isProcessing || (selectedPaymentMode === 'Online Payment' && !onlineMethod)}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    selectedPaymentMode === 'Online Payment' 
                      ? `Proceed to Pay • ${org?.currency || '₹'}{(cartGrandTotal - (isCouponApplied ? 50 : 0)).toFixed(2)}`
                      : `Place Order • ${org?.currency || '₹'}{(cartGrandTotal - (isCouponApplied ? 50 : 0)).toFixed(2)}`
                  )}
                </Button>
                
                {(!selectedAddress || (selectedPaymentMode === 'Online Payment' && !onlineMethod)) && (
                  <p className="text-[#EF4444] text-[12px] font-bold text-center mt-3 hidden md:block">
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
