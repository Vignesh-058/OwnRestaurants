import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { toast } from 'sonner';
import { locationService } from '@/services/location.service';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { isValidMongoId } from '@/utils/cartPayload';
import { useAddressStore } from '@/store/AddressStore';
import type { CartCreateRequest } from '@/types/cart.types';

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  const { setOrderId } = useCartStore();
  return useMutation({
    mutationFn: async (payload: CartCreateRequest) => {
      console.log('[Cart] Update Payload:', JSON.stringify(payload, null, 2));
      
      const state = useCartStore.getState();
      const p = payload as any;
      const isPreOrder = !!(state.preBookingId || p.preBookingId);

      if (isPreOrder && payload.deliveryType === 'Door Delivery') {
        const org = useOrganizationStore.getState().organization;
        const addrStore = useAddressStore.getState();
        const locStore = useLocationStore.getState();
        const activeAddr: any = addrStore.selectedAddress || addrStore.deliveryAddress || state.customerAddress;

        const addressId = activeAddr?._id || payload.addressId || locStore.addressId || state.addressId;
        const latitude = activeAddr?.latitude ?? p.latitude ?? locStore.latitude;
        const longitude = activeAddr?.longitude ?? p.longitude ?? locStore.longitude;
        const pincode = activeAddr?.pincode || activeAddr?.zipCode || locStore.postalCode;
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

      return cartService.updateCart(payload);
    },
    onSuccess: async (data) => {
      console.log('[Cart] API Success (updateCart):', data);

      // Persist orderId from response
      const newOrderId = data?.data?.order?.orderId || data?.data?.orderId || data?.data?._id;
      if (newOrderId) {
        setOrderId(newOrderId);
      }

      // Invalidate and immediately refetch cart query
      console.log('[Cart] Query Invalidated');
      await queryClient.invalidateQueries({ queryKey: ['cart'] });

      // After refetch, useCart's queryFn calls setCart — store is updated via the query
      console.log('[Cart] Refetch Success');
    },
    onError: (error: any) => {
      console.error('[Cart] API Error (updateCart):', error);
      const status = error?.response?.status;
      if (status === 401) return;
      const message = error instanceof Error ? error.message : (error?.response?.data?.message || 'Unable to update cart.');
      toast.error(message);
    }
  });
};
