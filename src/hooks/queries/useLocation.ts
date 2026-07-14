import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { useLocationStore } from '@/store/LocationStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useAuthStore } from '@/store/AuthStore';
import { useEffect, useCallback } from 'react';

export const useGeoLocation = () => {
 const { latitude, longitude, setLocation, setLoading, setError, locationLoaded } = useLocationStore();
 const belongsTo = useOrganizationStore((state) => state.organization?._id);

 const query = useQuery({
 queryKey: ['geoLocation', latitude, longitude, belongsTo],
 queryFn: async () => {
 if (!latitude || !longitude || !belongsTo) return null;
 console.log('[DEBUG] Geo API Request:', { latitude, longitude, belongsTo });
 const data = await locationService.getCustomerGeoLocation({ latitude, longitude, belongsTo });
 console.log('[DEBUG] Geo API Response:', data);
 return data;
 },
 enabled: !!latitude && !!longitude && !!belongsTo && !locationLoaded && useAuthStore.getState().isAuthenticated,
 staleTime: Infinity,
 });

 useEffect(() => {
 if (query.isLoading) setLoading(true);
 if (query.isError) {
 setError('Unable to fetch your address.');
 }
 if (query.data) {
 const data = query.data;

 const newState = {
 latitude: data.latitude || latitude,
 longitude: data.longitude || longitude,
 placeId: data.placeId || undefined,
 city: data.city,
 state: data.state,
 country: data.country,
 postalCode: data.postalCode,
 formattedAddress: data.formattedAddress,
 locationLoaded: true
 };

 console.log('[DEBUG] Global Store Values (New Location State):', newState);

 setLocation(newState);
 }
 }, [query.data, query.isLoading, query.isError, latitude, longitude, setLoading, setError, setLocation]);

 return query;
};

// Utility to fire the browser location prompt
export const useRequestBrowserLocation = () => {
 const { setLocation, setPermissionStatus, setError, setLoading } = useLocationStore();

 return useCallback(() => {
 if (!('geolocation' in navigator)) {
 setError('Geolocation is not supported by your browser.');
 return;
 }

 setLoading(true);
 navigator.geolocation.getCurrentPosition(
 (position) => {
 setPermissionStatus(true);
 const newState = {
 latitude: position.coords.latitude,
 longitude: position.coords.longitude,
 locationLoaded: false, // Forces the API to fetch the address again for the new coordinates
 };
 console.log('[DEBUG] RequestBrowserLocation - Current Coordinates:', newState);
 setLocation(newState);
 },
 () => {
 setPermissionStatus(false);
 setLoading(false);
 setError('Location permission is required to find nearby restaurants.');
 setLocation({ locationLoaded: true });
 },
 { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
 );
 }, [setLocation, setPermissionStatus, setError, setLoading]);
};
