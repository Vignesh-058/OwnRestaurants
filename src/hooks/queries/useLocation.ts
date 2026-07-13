import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { useLocationStore } from '@/store/LocationStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useEffect, useCallback } from 'react';
import { getCurrentPosition } from '@/utils/testLocation';
export const extractAddressParts = (components: any[]) => {
 let streetNumber = '', route = '', locality = '', city = '', state = '', country = '', postalCode = '';

 components.forEach((comp) => {
 const types = comp.types;
 if (types.includes('street_number')) streetNumber = comp.long_name;
 if (types.includes('route')) route = comp.long_name;
 if (types.includes('sublocality') || types.includes('sublocality_level_1')) locality = comp.long_name;
 if (types.includes('locality')) city = comp.long_name;
 if (types.includes('administrative_area_level_1')) state = comp.long_name;
 if (types.includes('country')) country = comp.long_name;
 if (types.includes('postal_code')) postalCode = comp.long_name;
 });

 const street = [streetNumber, route, locality].filter(Boolean).join(', ');
 const formattedAddress = [street, city, state, postalCode].filter(Boolean).join(', ');

 return { street, city, state, country, postalCode, formattedAddress };
};

export const useGeoLocation = () => {
 const { latitude, longitude, setLocation, setLoading, setError, locationLoaded } = useLocationStore();
 const belongsTo = useOrganizationStore((state) => state.organization?._id);

 const query = useQuery({
 queryKey: ['geoLocation', latitude, longitude, belongsTo],
 queryFn: async () => {
 if (!latitude || !longitude || !belongsTo) return null;
 const data = await locationService.getCustomerGeoLocation({ latitude, longitude, belongsTo });
 return data;
 },
 enabled: !!latitude && !!longitude && !!belongsTo && !locationLoaded,
 staleTime: Infinity,
 });

 useEffect(() => {
 if (query.isLoading) setLoading(true);
 if (query.isError) {
 setError('Unable to fetch your address.');
 }
 if (query.data?.results?.[0]) {
 const result = query.data.results[0];
 const parts = extractAddressParts(result.address_components);
 
 setLocation({
 latitude,
 longitude,
 placeId: result.place_id,
 ...parts,
 });
 }
 }, [query.data, query.isLoading, query.isError]);

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
 getCurrentPosition(
 (position) => {
 setPermissionStatus(true);
 setLocation({
 latitude: position.coords.latitude,
 longitude: position.coords.longitude,
 locationLoaded: false, // Forces the API to fetch the address again for the new coordinates
 });
 },
 () => {
 setPermissionStatus(false);
 setLoading(false);
 setError('Location permission is required to find nearby restaurants.');
 },
 { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
 );
 }, [setLocation, setPermissionStatus, setError, setLoading]);
};
