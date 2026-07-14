import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';
import { useEffect } from 'react';

export const useOutlets = (belongsTo: string) => {
 const setOutlets = useOutletStore((state) => state.setOutlets);
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);
 const latitude = useLocationStore((state) => state.latitude);
 const longitude = useLocationStore((state) => state.longitude);
 const locationLoaded = useLocationStore((state) => state.locationLoaded);

 const query = useQuery({
 queryKey: ['outlets', belongsTo, latitude, longitude],
 queryFn: async () => {
 console.log('[DEBUG-FLOW] OUTLETS REQUEST - belongsTo:', belongsTo, 'lat:', latitude, 'lng:', longitude);
 const data = await organizationService.getOutlets(belongsTo, latitude || undefined, longitude || undefined);
 console.log('[DEBUG-FLOW] OUTLETS FETCHED - count:', data.outlets?.length);
 return data;
 },
 enabled: !!belongsTo && locationLoaded,
 staleTime: 1000 * 60 * 30, // 30 minutes
 });

 useEffect(() => {
 if (query.data?.outlets) {
 setOutlets(query.data.outlets);
 // Auto-select nearest outlet when location is loaded and sorted
 if (locationLoaded && !selectedOutlet && query.data.outlets.length > 0) {
 const activeOutlet = query.data.outlets.find(o => o.isActive) || query.data.outlets[0];
 console.log('[DEBUG-FLOW] AUTO-SELECTING OUTLET:', activeOutlet._id);
 setSelectedOutlet(activeOutlet);
 }
 }
 }, [query.data, setOutlets, setSelectedOutlet, locationLoaded, selectedOutlet]);

 return query;
};
