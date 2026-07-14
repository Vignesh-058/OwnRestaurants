import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useLocationStore } from '@/store/LocationStore';

export const useCategories = () => {
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const storeStatus = useOutletStore((state) => state.storeStatus);
 const organization = useOrganizationStore((state) => state.organization);
 const locationLoaded = useLocationStore((state) => state.locationLoaded);

 return useQuery({
    queryKey: ['categories-v2', selectedOutlet?._id, organization?._id],
    queryFn: async () => {
      if (!selectedOutlet?._id || !organization?._id) {
        return [];
      }
      console.log('[DEBUG-FLOW] CATEGORIES REQUEST - outletId:', selectedOutlet._id);
      const data = await categoryService.getCategories(selectedOutlet._id, organization._id);
      console.log('[DEBUG-FLOW] CATEGORIES FETCHED - count:', data?.length);
      return data;
    },
    enabled: !!selectedOutlet?._id && !!organization?._id && locationLoaded,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });
};
