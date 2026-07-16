import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Search, Loader2, Home, Briefcase, ChevronLeft, AlertCircle, CheckCircle2, Plus
} from 'lucide-react';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { useRequestBrowserLocation } from '@/hooks/queries/useLocation';
import { useAddressSearch } from '@/hooks/queries/useAddressSearch';
import { useCreateAddress } from '@/hooks/mutations/useCreateAddress';
import { useAddresses } from '@/hooks/queries/useAddresses';
import { locationService } from '@/services/location.service';
import type { AddressType, CustomerAddress } from '@/types/customer.types';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/AuthStore';

// Helper function to generate readable title
const getReadableTitle = (addr: CustomerAddress) => {
  if ((addr as any).title) return (addr as any).title;
  
  const part1 = (addr.address1 || '').trim();
  // If the first part is purely numeric or very short, combine it
  if (/^\d+$/.test(part1) || part1.length <= 3) {
    const part2 = (addr.address2 || '').split(',')[0].trim();
    if (part1 && part2) return `${part1}, ${part2}`;
    if (part2) return part2;
  }
  
  if (part1) return part1;
  return 'Saved Address';
};

const AddressIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'home': return <Home className="w-5 h-5" />;
    case 'work': return <Briefcase className="w-5 h-5" />;
    default: return <MapPin className="w-5 h-5" />;
  }
};

export const LocationSelectorModal = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { isOpen, closeModal, openModal } = useLocationModalStore();
  const { setLocation, loading: isLocating, permissionGranted, locationLoaded } = useLocationStore();

  
  const [view, setView] = useState<'search' | 'add-address'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { data: addressesData, isLoading: isLoadingAddresses, isSuccess } = useAddresses();
  const savedAddresses = addressesData || [];

  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!hasAutoOpened.current) {
      hasAutoOpened.current = true;
      if (!locationLoaded && !isOpen) {
        openModal();
      }
    }
  }, [locationLoaded, isSuccess, addressesData, isOpen, openModal, user, isAuthenticated]);

  const [pendingAddress, setPendingAddress] = useState<any>(null);
  const [address1, setAddress1] = useState('');
  const [landMark, setLandMark] = useState('');
  const [type, setType] = useState<AddressType>('home');
  const [validationError, setValidationError] = useState('');

  const { data: searchResults, isLoading: isSearching } = useAddressSearch(searchQuery);
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const requestBrowserLocation = useRequestBrowserLocation();

  useEffect(() => {
    if (isOpen) {
      setView('search');
      setValidationError('');
      setAddress1('');
      setLandMark('');
      setPendingAddress(null);
      setSelectedAddressId(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleUseCurrentLocation = () => {
    requestBrowserLocation();
    closeModal();
  };

  const handleSelectSearchResult = async (result: any) => {
    try {
      
      // Backend handles Google Maps / Geocoding, just send the entered string
      const response = await locationService.getCustomerLatLng({ 
        enteredAddress: result.description || result.formatted_address || result.name || JSON.stringify(result),
        belongsTo: user?.organizationId || ''
      });
      
      setPendingAddress({
        latitude: response.latitude,
        longitude: response.longitude,
        placeId: response.placeId,
        city: response.city,
        state: response.state,
        country: response.country,
        postalCode: response.postalCode,
        formattedAddress: response.formattedAddress,
      });
      setView('add-address');
    } catch (err) {
      console.error(err);
      setValidationError('Failed to resolve address location.');
    } finally {
      
    }
  };

  const handleSelectSavedAddress = (addr: CustomerAddress) => {
    setSelectedAddressId(addr._id);
  };

  const handleContinue = () => {
    if (!selectedAddressId) return;
    const addr = savedAddresses.find(a => a._id === selectedAddressId);
    if (!addr) return;
    
    // Do NOT set latitude and longitude here to prevent customer addresses from being used for outlet filtering
    setLocation({
      addressId: addr._id,
      address1: addr.address1,
      address2: addr.address2,
      street: addr.address2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.pincode,
      country: addr.country,
      formattedAddress: [addr.address1, addr.address2, addr.city].filter(Boolean).join(', '),
    });
    
    closeModal();
  };

  const handleSaveAddress = () => {
    if (!address1.trim()) {
      setValidationError('House / Flat No is required.');
      return;
    }

    const payload = {
      address1,
      address2: pendingAddress.street || pendingAddress.city,
      city: pendingAddress.city || '',
      state: pendingAddress.state || '',
      country: pendingAddress.country || '',
      pincode: pendingAddress.postalCode || '',
      latitude: pendingAddress.latitude,
      longitude: pendingAddress.longitude,
      landMark,
      type
    };

    if (!user) {
      // Guest bypass: Just set the local location state without making API call
      setLocation({
        addressId: null,
        address1: payload.address1,
        address2: payload.address2,
        street: payload.address2,
        city: payload.city,
        state: payload.state,
        postalCode: payload.pincode,
        country: payload.country,
        formattedAddress: [payload.address1, payload.address2, payload.city].filter(Boolean).join(', '),
      });
      closeModal();
      return;
    }

    createAddress(payload, {
      onSuccess: (data) => {
        const finalAddr = data.address || payload;
        setLocation({
          addressId: finalAddr._id || null,
          address1: payload.address1,
          address2: payload.address2,
          street: payload.address2,
          city: payload.city,
          state: payload.state,
          postalCode: payload.pincode,
          country: payload.country,
          formattedAddress: [payload.address1, payload.address2, payload.city].filter(Boolean).join(', '),
        });
        closeModal();
      }
    });
  };

  if (!isAuthenticated || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-slate-900 border border-white/10 w-full md:w-[90%] lg:max-w-[700px] h-[95vh] md:h-auto max-h-[85vh] rounded-t-[24px] md:rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-10 flex flex-col relative"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {view === 'add-address' && (
                <button onClick={() => setView('search')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <ChevronLeft className="h-6 w-6 text-slate-400" />
                </button>
              )}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                  {view === 'search' ? 'Select Delivery Address' : 'Add New Address'}
                </h2>
                <p className="text-[14px] text-slate-400 font-medium mt-1 leading-tight">
                  {view === 'search' ? 'Choose your preferred delivery address to continue.' : 'Enter specific details for this location'}
                </p>
              </div>
            </div>
            <button 
              onClick={closeModal}
              className="h-10 w-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {view === 'search' ? (
              <div className="p-4 space-y-4">
                {/* Search Bar */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by area, street or landmark..."
                    className="w-full h-[48px] pl-12 pr-4 bg-slate-800/50 border border-white/10 shadow-sm rounded-2xl text-[16px] font-medium focus:outline-none focus:border-primary focus:bg-slate-900 transition-all text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Search Results */}
                {searchQuery.trim().length >= 3 ? (
                  <div className="space-y-4">
                    <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Search Results</h3>
                    <div className="space-y-2">
                      {isSearching ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : (searchResults?.results?.length ?? 0) > 0 ? (
                        searchResults?.results?.map((loc: any, idx: number) => (
                          <button 
                            key={idx}
                            onClick={() => handleSelectSearchResult(loc)}
                            className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-start gap-4 group"
                          >
                            <div className="mt-0.5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                              <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div>
                              <span className="font-bold text-[15px] text-slate-900 dark:text-white block leading-tight">
                                {loc.address_components?.[0]?.long_name || loc.formatted_address.split(',')[0]}
                              </span>
                              <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed line-clamp-2">
                                {loc.formatted_address}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 text-[15px] font-medium text-slate-500">
                          No matching addresses found.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Current Location Action */}
                    <div className="space-y-4">
                      {permissionGranted === false ? (
                        <div className="flex flex-col gap-3 p-5 bg-slate-800 text-orange-400 rounded-[18px] border border-orange-500/20 shadow-md">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-[15px]">Location Permission Required</h4>
                              <p className="text-[14px] font-medium leading-relaxed mt-1 opacity-90">
                                Allow location access to find nearby restaurants and calculate accurate delivery estimates.
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Button size="sm" onClick={handleUseCurrentLocation} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">Enable Location</Button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={handleUseCurrentLocation}
                          disabled={isLocating}
                          className="w-full text-left p-5 bg-slate-800/50 hover:bg-slate-800 text-orange-400 border border-white/10 hover:border-orange-500/30 rounded-[18px] flex items-center justify-between transition-all duration-300 group disabled:opacity-75"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-0.5">
                              {isLocating ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <MapPin className="h-5 w-5 stroke-[2.5]" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-[15px] block">{isLocating ? 'Locating...' : 'Use Current Location'}</span>
                              <span className="text-[13px] font-medium text-slate-400 block mt-0.5">Using GPS to find your address</span>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Saved Addresses */}
                    <div className="space-y-4">
                      <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider px-1">Saved Addresses</h3>
                      
                      {isLoadingAddresses ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : savedAddresses.length > 0 ? (
                        <div className="space-y-[10px]">
                          {savedAddresses.map((addr: CustomerAddress) => {
                            const isSelected = selectedAddressId === addr._id;
                            const readableTitle = getReadableTitle(addr);
                            
                            // Construct full address
                            const addressParts = [addr.address1, addr.address2, addr.city, addr.state ? `${addr.state} - ${addr.pincode}` : addr.pincode].filter(Boolean);
                            const fullAddressStr = addressParts.join(', ');
                            const secondaryInfo = [addr.address2?.split(',')[0], addr.city, addr.state].filter(Boolean).join(', ');

                            return (
                              <motion.button 
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                key={addr._id}
                                onClick={() => handleSelectSavedAddress(addr)}
                                className={`w-full text-left p-4 rounded-[16px] transition-all flex items-start gap-2.5 group relative overflow-hidden ${
                                  isSelected 
                                    ? 'bg-primary/10 border border-primary shadow-md' 
                                    : 'bg-slate-800/80 border border-white/10 hover:border-white/20 hover:shadow-lg hover:bg-slate-800/90'
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-4 right-4 text-primary">
                                    <CheckCircle2 className="w-5 h-5" />
                                  </div>
                                )}
                                
                                <div className={`mt-0.5 p-3 rounded-full transition-colors ${isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                                  <AddressIcon type={addr.type} />
                                </div>
                                <div className="flex-1 pr-6">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-bold text-[11px] tracking-widest text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full uppercase border border-white/5">
                                      {addr.type}
                                    </span>
                                  </div>
                                  <span className="font-semibold text-[18px] text-white block mb-1.5 leading-tight">
                                    {readableTitle}
                                  </span>
                                  <span className="text-[15px] font-medium text-slate-300 leading-relaxed line-clamp-3 mb-2 whitespace-pre-wrap">
                                    {fullAddressStr}
                                  </span>
                                  <span className="text-[13px] font-medium text-slate-400 block pt-2 border-t border-white/10">
                                    {secondaryInfo}
                                  </span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 px-4 bg-slate-800/30 rounded-[18px] border border-white/10 flex flex-col items-center shadow-inner">
                          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-8 h-8 text-slate-500" />
                          </div>
                          <h4 className="text-[16px] font-bold text-white mb-1.5">No Saved Addresses</h4>
                          <p className="text-[14px] text-slate-400 font-medium mb-6">Add your first delivery address to continue.</p>
                          <Button 
                            onClick={() => setView('add-address')}
                            variant="outline"
                            className="h-12 px-6 rounded-xl border-white/10 hover:bg-slate-800 hover:text-white text-[14px] font-bold text-slate-300 transition-all"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Address
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Add Address Form */
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-[15px] text-slate-900 dark:text-white mb-1">
                    {pendingAddress?.street || pendingAddress?.city}
                  </div>
                  <div className="text-[13px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {pendingAddress?.formattedAddress}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">House / Flat No *</label>
                    <input 
                      type="text"
                      value={address1}
                      onChange={(e) => {
                        setAddress1(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      placeholder="E.g. Flat 401, Galaxy Apts"
                      className={`w-full h-14 px-4 bg-white dark:bg-slate-900 border rounded-2xl text-[15px] font-medium focus:outline-none focus:ring-4 transition-all ${validationError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500/50' : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/10'}`}
                    />
                    {validationError && <p className="text-[13px] text-red-500 font-bold mt-2 px-1">{validationError}</p>}
                  </div>

                  <div>
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">Landmark (Optional)</label>
                    <input 
                      type="text"
                      value={landMark}
                      onChange={(e) => setLandMark(e.target.value)}
                      placeholder="E.g. Near Apollo Hospital"
                      className="w-full h-14 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl text-[15px] font-medium focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">Save As</label>
                    <div className="flex gap-3">
                      {(
                        [
                          { id: 'home', label: 'Home', icon: Home },
                          { id: 'work', label: 'Work', icon: Briefcase },
                          { id: 'other', label: 'Other', icon: MapPin }
                        ] as { id: AddressType, label: string, icon: any }[]
                      ).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setType(t.id)}
                          className={`flex-1 h-12 rounded-xl border flex items-center justify-center gap-2 text-[14px] font-bold transition-all ${
                            type === t.id 
                              ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <t.icon className="h-4 w-4" />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-6 border-t border-white/10 bg-slate-900/80 backdrop-blur-md shrink-0">
            {view === 'search' ? (
              <div className="flex flex-col gap-4">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleContinue}
                    disabled={!selectedAddressId}
                    className="w-full h-[48px] rounded-2xl bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white text-[16px] font-bold shadow-[0_8px_20px_-6px_rgba(255,107,0,0.4)] disabled:opacity-50 disabled:shadow-none transition-all group relative overflow-hidden"
                  >
                    Continue
                  </Button>
                </motion.div>
                
                <Button 
                  onClick={() => setView('add-address')}
                  variant="outline"
                  className="w-full h-[48px] rounded-2xl border-white/10 hover:bg-slate-800 hover:text-white text-[16px] font-bold text-slate-300 transition-all bg-transparent"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Address
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button 
                  onClick={() => setView('search')}
                  variant="outline"
                  className="flex-1 h-[56px] rounded-[16px] border-white/10 hover:bg-slate-800 text-[15px] font-bold text-white transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveAddress}
                  disabled={isCreating}
                  className="flex-1 h-[56px] rounded-[16px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-[16px] font-bold shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] disabled:opacity-70 transition-all"
                >
                  {isCreating && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                  Save Address
                </Button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
