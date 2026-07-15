import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { useOutletStore } from '@/store/OutletStore';

export const useItemDetail = (itemId: string | null, variationId?: string) => {
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  return useQuery({
    queryKey: ['product-detail', itemId, selectedOutlet?._id, variationId],
    queryFn: async () => {
      if (!itemId || !selectedOutlet?._id) {
        throw new Error('Missing required params');
      }
      console.log('[Product Detail Request]', { itemId, outletId: selectedOutlet._id, variationId });
      
      const data = await productService.getItemDetail(itemId, selectedOutlet._id, variationId);
      
      console.log('[Product Detail Response]', data);
      return data;
    },
    enabled: !!itemId && !!selectedOutlet?._id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
