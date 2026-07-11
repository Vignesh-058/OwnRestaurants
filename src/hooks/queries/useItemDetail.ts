import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { useOutletStore } from '@/store/OutletStore';

export const useItemDetail = (itemId: string | null, variationId?: string) => {
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

 return useQuery({
 queryKey: ['itemDetail', itemId, selectedOutlet?._id, variationId],
 queryFn: () => {
 if (!itemId || !selectedOutlet?._id) {
 throw new Error('Missing required params');
 }
 return productService.getItemDetail(itemId, selectedOutlet._id, variationId);
 },
 enabled: !!itemId && !!selectedOutlet?._id,
 staleTime: 5 * 60 * 1000, // 5 minutes
 });
};
