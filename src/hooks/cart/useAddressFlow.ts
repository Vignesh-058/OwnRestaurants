import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { hasValidDeliveryAddress } from '@/utils/cartPayload';

export const useAddressFlow = () => {
  const [isProcessingAddress, setIsProcessingAddress] = useState(false);
  const queryClient = useQueryClient();

  const handleAddressAndProceed = useCallback(async (onSuccess: () => void) => {
    // If we already have a valid address, proceed immediately
    if (hasValidDeliveryAddress()) {
      onSuccess();
      return;
    }

    const { user } = useAuthStore.getState();
    const organization = useOrganizationStore.getState().organization;
    const locStore = useLocationStore.getState();

    // If guest, they must login or select location manually
    if (!user?.phone || !organization?._id) {
      useLocationModalStore.getState().openModal();
      toast.error('Please login and select a delivery address first.');
      return;
    }

    setIsProcessingAddress(true);
    const toastId = toast.loading('Setting up delivery address...');

    try {
      const lat = locStore.latitude ?? 0;
      const lng = locStore.longitude ?? 0;

      // 1. Fetch addresses
      const addresses = await customerService.getAddresses(organization._id, user.phone, lat, lng);

      if (addresses && addresses.length > 0) {
        // 2. Select the first address if they have saved addresses
        const selectedAddress = addresses[0];
        locStore.setLocation({
          addressId: selectedAddress._id,
        });
        toast.success('Address selected successfully.', { id: toastId });
        
        // Refresh globally
        queryClient.invalidateQueries({ queryKey: ['addresses'] });
        
        // 3. Proceed to cart
        onSuccess();
      } else {
        // 4. No addresses. Create one automatically using current GPS.
        if (!lat || !lng) {
          toast.error('Location not found. Please select an address.', { id: toastId });
          useLocationModalStore.getState().openModal();
          return;
        }

        const createPayload = {
          address1: locStore.address1 || locStore.formattedAddress || 'My Location',
          address2: locStore.address2 || locStore.city || '',
          city: locStore.city || '',
          state: locStore.state || '',
          country: locStore.country || '',
          pincode: locStore.postalCode || '',
          latitude: lat,
          longitude: lng,
          type: 'home' as const,
          belongsTo: organization._id,
          customerPhoneNo: user.phone,
        };

        const newAddressRes = await customerService.createAddress(createPayload);
        const newAddress = (newAddressRes as any).address || newAddressRes;

        if (newAddress && newAddress._id) {
          locStore.setLocation({
            addressId: newAddress._id,
          });
          toast.success('Address saved and selected.', { id: toastId });
          
          queryClient.invalidateQueries({ queryKey: ['addresses'] });
          
          onSuccess();
        } else {
          throw new Error('Address creation failed.');
        }
      }
    } catch (error) {
      console.error('[AddressFlow] Error:', error);
      toast.error('Failed to set up address. Please add it manually.', { id: toastId });
      useLocationModalStore.getState().openModal();
    } finally {
      setIsProcessingAddress(false);
    }
  }, [queryClient]);

  return { handleAddressAndProceed, isProcessingAddress };
};
