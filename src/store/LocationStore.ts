import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/storage';

export type PermissionStatus = 'prompt' | 'granted' | 'denied';

interface LocationState {
 lat: number | null;
 lng: number | null;
 address: string | null;
 permissionStatus: PermissionStatus;
 setLocation: (lat: number, lng: number, address?: string) => void;
 setPermissionStatus: (status: PermissionStatus) => void;
 clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
 persist(
 (set) => ({
 lat: null,
 lng: null,
 address: null,
 permissionStatus: 'prompt',
 setLocation: (lat, lng, address = 'Selected Location') => 
 set({ lat, lng, address, permissionStatus: 'granted' }),
 setPermissionStatus: (status) => set({ permissionStatus: status }),
 clearLocation: () => set({ lat: null, lng: null, address: null, permissionStatus: 'prompt' }),
 }),
 {
 name: STORAGE_KEYS.LOCATION,
 }
 )
);
