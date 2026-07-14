import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';

export const useStoreStatus = (belongsTo: string, outletId: string) => {
 const setStoreStatus = useOutletStore((state) => state.setStoreStatus);

 const locationLoaded = useLocationStore((state) => state.locationLoaded);

 return useQuery({
 queryKey: ['storeStatus', belongsTo, outletId],
 queryFn: async () => {
 console.log('[DEBUG-FLOW] STORE STATUS REQUEST - outletId:', outletId);
 const data = await organizationService.getStoreStatus(belongsTo, outletId);
 console.log('[DEBUG-FLOW] STORE STATUS LOADED:', data.storeStatus);
 setStoreStatus(data);
 return data;
 },
 enabled: !!belongsTo && !!outletId && locationLoaded,
 staleTime: 1000 * 60 * 5, // 5 minutes
 });
};
