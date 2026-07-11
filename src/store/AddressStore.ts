import { create } from 'zustand';
import type { Address } from '@/types/customer.types';

interface AddressState {
 addresses: Address[];
 selectedAddress: Address | null;
 defaultAddress: Address | null;
 deliveryAddress: Address | null;
 
 setAddresses: (addresses: Address[]) => void;
 setSelectedAddress: (address: Address | null) => void;
 setDeliveryAddress: (address: Address | null) => void;
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
