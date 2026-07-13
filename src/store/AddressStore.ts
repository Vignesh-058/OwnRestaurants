import { create } from 'zustand';
import type { CustomerAddress } from '@/types/customer.types';

interface AddressState {
 addresses: CustomerAddress[];
 selectedAddress: CustomerAddress | null;
 defaultAddress: CustomerAddress | null;
 deliveryAddress: CustomerAddress | null;
 
 setAddresses: (addresses: CustomerAddress[]) => void;
 setSelectedAddress: (address: CustomerAddress | null) => void;
 setDeliveryAddress: (address: CustomerAddress | null) => void;
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
}));
