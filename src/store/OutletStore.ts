import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Outlet, StoreStatusResponse } from '@/types/organization.types';
import { getQueryClient } from '@/components/providers/QueryProvider';

interface OutletState {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  selectedOutletId: string | null;
  storeStatus: StoreStatusResponse | null;
  deliveryMode: 'delivery' | 'pickup' | null;
  setOutlets: (outlets: Outlet[]) => void;
  setSelectedOutlet: (outlet: Outlet) => void;
  setStoreStatus: (status: StoreStatusResponse) => void;
  setDeliveryMode: (mode: 'delivery' | 'pickup') => void;
}

export const useOutletStore = create<OutletState>()(
  persist(
    (set) => ({
      outlets: [],
      selectedOutlet: null,
      selectedOutletId: null,
      storeStatus: null,
      deliveryMode: null,
      setOutlets: (outlets) => set({ outlets }),
      setSelectedOutlet: (outlet) => {
        console.log('[OUTLET CHANGE EVENT] User switched to outlet:', outlet.outletName);
        set({ selectedOutlet: outlet, selectedOutletId: outlet._id });

        // Invalidate related queries to trigger a refetch
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({ queryKey: ['categories-v2'] });
        queryClient.invalidateQueries({ queryKey: ['itemDetail'] });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['settings'] });
        queryClient.invalidateQueries({ queryKey: ['storeStatus'] });
      },
      setStoreStatus: (status) => set({ storeStatus: status }),
      setDeliveryMode: (mode) => set({ deliveryMode: mode }),
    }),
    {
      name: 'outlet-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist selectedOutlet and selectedOutletId
      partialize: (state) => ({
        selectedOutlet: state.selectedOutlet,
        selectedOutletId: state.selectedOutletId,
      }),
    }
  )
);
