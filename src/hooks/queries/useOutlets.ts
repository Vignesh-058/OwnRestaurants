import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';
import { useOutletModalStore } from '@/store/OutletModalStore';
import { useAuthStore } from '@/store/AuthStore';
import { useEffect } from 'react';

export const useOutlets = (belongsTo: string) => {
  const setOutlets = useOutletStore((state) => state.setOutlets);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);
  const latitude = useLocationStore((state) => state.latitude);
  const longitude = useLocationStore((state) => state.longitude);
  const locationLoaded = useLocationStore((state) => state.locationLoaded);
  
  // Safe state access to prevent infinite renders
  const openModal = useOutletModalStore((state) => state.openModal);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['outlets', belongsTo, latitude, longitude],
    queryFn: async () => {
      const data = await organizationService.getOutlets(belongsTo, latitude || undefined, longitude || undefined);
      console.log('[OUTLETS] Backend returned outlets', data.outlets);
      return data;
    },
    enabled: !!belongsTo && locationLoaded && isAuthenticated,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    if (query.data?.outlets) {
      setOutlets(query.data.outlets);
      
      if (!selectedOutlet) {
        if (query.data.outlets.length === 1) {
          const firstOutlet = query.data.outlets[0];
          console.log('[OUTLET] Automatically selected the only available outlet', firstOutlet.outletName);
          setSelectedOutlet(firstOutlet);
        } else {
          console.log(`[OUTLETS] Backend returned ${query.data.outlets.length} outlets. Prompting manual selection.`);
          openModal();
        }
      }
    }
  }, [query.data, setOutlets, setSelectedOutlet, selectedOutlet, openModal, latitude, longitude]);

  return query;
};
