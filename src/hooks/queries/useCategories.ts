import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const useCategories = () => {
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const storeStatus = useOutletStore((state) => state.storeStatus);
 const organization = useOrganizationStore((state) => state.organization);

 return useQuery({
    queryKey: ['categories-v2', selectedOutlet?._id, organization?._id],
    queryFn: async () => {
      const outletId = selectedOutlet?._id || '';
      const orgId = organization?._id || '';
      const payload = { belongsTo: orgId, outletId };
      console.log('Category API Payload', payload);
      const data = await categoryService.getCategories(outletId, orgId);
      console.log('[DEBUG-FLOW] CATEGORIES FETCHED - count:', data?.length);
      return data;
    },
    enabled: !!selectedOutlet?._id && !!organization?._id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });
};
