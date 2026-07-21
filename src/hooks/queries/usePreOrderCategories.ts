import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';

interface UsePreOrderCategoriesParams {
  preBookId: string;
  preOrderDate: string;
  preOrderTime: string;
}

export const usePreOrderCategories = (params: UsePreOrderCategoriesParams) => {
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const belongsTo = org?._id || '';
  const outletId = selectedOutlet?._id || '';

  const { preBookId, preOrderDate, preOrderTime } = params;

  return useQuery({
    queryKey: ['preOrderCategories', belongsTo, outletId, preBookId, preOrderDate, preOrderTime],
    queryFn: () => categoryService.getPreOrderCategories({
      belongsTo,
      outletId,
      preBookId,
      preOrderDate,
      preOrderTime,
    }),
    enabled: !!belongsTo && !!outletId && !!preBookId && !!preOrderDate && !!preOrderTime,
    staleTime: 5 * 60 * 1000,
  });
};
