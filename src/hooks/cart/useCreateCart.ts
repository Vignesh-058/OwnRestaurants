import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { toast } from 'sonner';
import { locationService } from '@/services/location.service';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useLocationStore } from '@/store/LocationStore';
import { isValidMongoId } from '@/utils/cartPayload';
import { useAddressStore } from '@/store/AddressStore';
import type { CartCreateRequest } from '@/types/cart.types';

export const useCreateCart = () => {
 const queryClient = useQueryClient();
 const { setOrderId } = useCartStore();

 return useMutation({
 mutationFn: async (payload: CartCreateRequest) => {
      const state = useCartStore.getState();
      const isPreOrder = !!(state.preBookingId || payload.preBookingId);

      if (isPreOrder && payload.deliveryType === 'Door Delivery') {
        const org = useOrganizationStore.getState().organization;
        const addrStore = useAddressStore.getState();
        const locStore = useLocationStore.getState();
        const activeAddr = addrStore.selectedAddress || addrStore.deliveryAddress || state.customerAddress;

        const addressId = activeAddr?._id || payload.addressId || locStore.addressId || state.addressId;
        const latitude = activeAddr?.latitude ?? payload.latitude ?? locStore.latitude;
        const longitude = activeAddr?.longitude ?? payload.longitude ?? locStore.longitude;
        const pincode = activeAddr?.pincode || (activeAddr as any)?.zipCode || locStore.postalCode;
        const stateName = activeAddr?.state || locStore.state;
        const countryName = activeAddr?.country || locStore.country;
        const city = activeAddr?.city || locStore.city;
        const addressStr = activeAddr?.address1 || locStore.formattedAddress || activeAddr?.address || activeAddr?.street;

        // Step 4: Validate at least one of pincode, state, or country is present
        if (!pincode && !stateName && !countryName) {
          toast.error('The selected address is incomplete. Please select or update your delivery address.');
          useLocationModalStore.getState().openModal();
          throw new Error('The selected address is incomplete. Please select or update your delivery address.');
        }

        const checkPayload: any = {
          belongsTo: org?._id || '',
          outletId: payload.outletId,
        };

        if (isValidMongoId(addressId)) checkPayload.addressId = addressId;
        if (latitude !== undefined && latitude !== null) checkPayload.latitude = latitude;
        if (longitude !== undefined && longitude !== null) checkPayload.longitude = longitude;
        if (pincode) checkPayload.pincode = pincode;
        if (stateName) checkPayload.state = stateName;
        if (countryName) checkPayload.country = countryName;
        if (city) checkPayload.city = city;
        if (addressStr) checkPayload.address = addressStr;

        // Step 5: Temporary Debug Logging
        console.log('[DEBUG Delivery Check Payload]:', JSON.stringify(checkPayload, null, 2));

        try {
          const res = await locationService.checkDeliveryAvailability(checkPayload);
          console.log('[DEBUG Delivery Check Response]:', res);
        } catch (error: any) {
          console.error('[DEBUG Delivery Check Failure]:', error);
          throw new Error(error?.response?.data?.message || 'Delivery is unavailable for this location.');
        }
      }
      return cartService.createCart(payload);
  },
 onSuccess: (data) => {
 // Extract orderId from the response to save in global state
 const newOrderId = data?.data?.order?.orderId || data?.data?.orderId || data?.data?._id;
 if (newOrderId) {
 setOrderId(newOrderId);
 }
 
 // Instantly refresh global cart
 queryClient.invalidateQueries({ queryKey: ['cart'] });
 },
 onError: (error: any, variables: CartCreateRequest) => {
 const errorMsg = error?.response?.data?.message?.toLowerCase() || '';

 if (errorMsg.includes('item not found')) {
 toast.error('Selected item is unavailable.');
 } else if (errorMsg.includes('address not found')) {
 toast.error('Please select a valid delivery address.');
 useLocationModalStore.getState().openModal();
 } else if (errorMsg.includes('outlet not found')) {
 queryClient.invalidateQueries({ queryKey: ['nearby-outlets'] });
 toast.error('Outlet not found. Reloading nearby outlets...');
 } else {
 // Generic / Validation / Network Error
  const message = error instanceof Error ? error.message : (errorMsg || 'Unable to add item to cart. Please try again.');
  toast.error(message, {
 action: {
 label: 'Retry',
 onClick: () => queryClient.getMutationCache().build(queryClient, { mutationFn: (val: CartCreateRequest) => cartService.createCart(val) }).execute(variables)
 }
 });
 }
 }
 });
};
