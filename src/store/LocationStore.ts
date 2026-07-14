import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/storage';
import type { LocationState } from '@/types/location.types';

export const useLocationStore = create<LocationState>()(
 persist(
 (set) => ({
 latitude: null,
 longitude: null,
 formattedAddress: null,
 addressId: null,
 address1: null,
 address2: null,
 street: null,
 city: null,
 state: null,
 country: null,
 postalCode: null,
 placeId: null,
 locationLoaded: false,
 permissionGranted: null,
 loading: false,
 error: null,

 setLocation: (locationData) =>
 set((state) => ({
 ...state,
 ...locationData,
 locationLoaded: locationData.locationLoaded !== undefined ? locationData.locationLoaded : true,
 permissionGranted: true,
 error: null,
 loading: false,
 })),
 setPermissionStatus: (granted) => set({ permissionGranted: granted }),
 setLoading: (loading) => set({ loading }),
 setError: (error) => set({ error, loading: false }),
 clearLocation: () =>
 set({
 latitude: null,
 longitude: null,
 formattedAddress: null,
 addressId: null,
 address1: null,
 address2: null,
 street: null,
 city: null,
 state: null,
 country: null,
 postalCode: null,
 placeId: null,
 locationLoaded: false,
 permissionGranted: null,
 loading: false,
 error: null,
 }),
 }),
 {
 name: STORAGE_KEYS.LOCATION,
 }
 )
);
