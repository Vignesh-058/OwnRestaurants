import { create } from 'zustand';
import type { CustomerAddress } from '@/types/customer.types';
import { useLocationStore } from '@/store/LocationStore';
import { useCartStore } from '@/store/CartStore';

interface AddressState {
  addresses: CustomerAddress[];
  selectedAddress: CustomerAddress | null;
  defaultAddress: CustomerAddress | null;
  deliveryAddress: CustomerAddress | null;
  
  setAddresses: (addresses: CustomerAddress[]) => void;
  setSelectedAddress: (address: CustomerAddress | null) => void;
  setDeliveryAddress: (address: CustomerAddress | null) => void;
  selectAndUseAddressForDelivery: (address: CustomerAddress) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [],
  selectedAddress: null,
  defaultAddress: null,
  deliveryAddress: null,
  
  setAddresses: (addresses) => {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0] || null;
    set({ addresses, defaultAddress: defaultAddr });
  },
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  selectAndUseAddressForDelivery: (address) => {
    console.log('[DEBUG Address Selection] Clicked Address:', address);

    // 1. Synchronously update AddressStore
    set({ selectedAddress: address, deliveryAddress: address });

    // 2. Synchronously update LocationStore
    useLocationStore.getState().setLocation({
      addressId: address._id,
      address1: address.address1,
      address2: address.address2,
      street: address.address2,
      city: address.city,
      state: address.state,
      postalCode: address.pincode,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude,
      formattedAddress: [address.address1, address.address2, address.city].filter(Boolean).join(', '),
    });

    // 3. Synchronously update CartStore
    useCartStore.setState({
      customerAddress: address as any,
      addressId: address._id,
    });

    console.log('[DEBUG Address Selection] Updated Stores with Address:', {
      AddressStore: { selectedAddress: address, deliveryAddress: address },
      LocationStore: useLocationStore.getState(),
      CartStore: {
        customerAddress: useCartStore.getState().customerAddress,
        addressId: useCartStore.getState().addressId,
      }
    });
  },
}));
