import { create } from 'zustand';
import type { Outlet, StoreStatusResponse } from '@/types/organization.types';

interface OutletState {
 outlets: Outlet[];
 selectedOutlet: Outlet | null;
 storeStatus: StoreStatusResponse | null;
 deliveryMode: 'delivery' | 'pickup' | null;
 setOutlets: (outlets: Outlet[]) => void;
 setSelectedOutlet: (outlet: Outlet) => void;
 setStoreStatus: (status: StoreStatusResponse) => void;
 setDeliveryMode: (mode: 'delivery' | 'pickup') => void;
}

export const useOutletStore = create<OutletState>((set) => ({
 outlets: [],
 selectedOutlet: null,
 storeStatus: null,
 deliveryMode: null,
 setOutlets: (outlets) => set({ outlets }),
 setSelectedOutlet: (outlet) => set({ selectedOutlet: outlet }),
 setStoreStatus: (status) => set({ storeStatus: status }),
 setDeliveryMode: (mode) => set({ deliveryMode: mode }),
}));

// Force Vite HMR Cache Invalidations
