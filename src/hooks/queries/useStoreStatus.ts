import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOutletStore } from '@/store/OutletStore';

export const useStoreStatus = (belongsTo: string, outletId: string) => {
 const setStoreStatus = useOutletStore((state) => state.setStoreStatus);

 return useQuery({
 queryKey: ['storeStatus', belongsTo, outletId],
 queryFn: async () => {
 console.log('[DEBUG-FLOW] STORE STATUS REQUEST - outletId:', outletId);
 const data = await organizationService.getStoreStatus(belongsTo, outletId);
 console.log('[DEBUG-FLOW] STORE STATUS LOADED:', data.storeStatus);
 setStoreStatus(data);
 return data;
 },
 enabled: !!belongsTo && !!outletId,
 staleTime: 1000 * 60 * 5, // 5 minutes
 });
};
