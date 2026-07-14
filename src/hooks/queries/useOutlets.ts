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
      console.log('[LOCATION] Current browser location:', { lat: latitude, lng: longitude });
      
      const data = await organizationService.getOutlets(belongsTo, latitude || undefined, longitude || undefined);
      
      console.log('[DEBUG] Number of outlets returned:', data.outlets.length);
      console.log('[OUTLETS] Complete outlet list:', data.outlets);
      return data;
    },
    enabled: !!belongsTo && locationLoaded && isAuthenticated,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    if (query.data?.outlets) {
      setOutlets(query.data.outlets);
      
      console.log('Available Outlets', query.data.outlets);

      if (!selectedOutlet && query.data.outlets.length > 0) {
        // Only auto-select if we successfully obtained GPS coordinates
        if (latitude && longitude) {
          const firstOutlet = query.data.outlets[0];
          console.log('Automatically Selected Nearest Outlet:', firstOutlet.outletName);
          console.log('Selected Outlet ID:', firstOutlet._id);
          console.log('Outlet selection popup skipped');
          setSelectedOutlet(firstOutlet);
        } else {
          // Location denied or unavailable, force manual selection
          console.log('Location unavailable, prompting user for manual outlet selection');
          openModal();
        }
      }
    }
  }, [query.data, setOutlets, setSelectedOutlet, selectedOutlet, openModal, latitude, longitude]);

  return query;
};
