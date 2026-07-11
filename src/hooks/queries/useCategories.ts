import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const useCategories = () => {
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const organization = useOrganizationStore((state) => state.organization);

 return useQuery({
 queryKey: ['categories-v2', selectedOutlet?._id, organization?._id],
 queryFn: () => {
 if (!selectedOutlet?._id || !organization?._id) {
 return [];
 }
 console.log("Category Request:", {
 belongsTo: organization._id,
 outletId: selectedOutlet._id
 });
 return categoryService.getCategories(selectedOutlet._id, organization._id);
 },
 enabled: !!selectedOutlet?._id && !!organization?._id,
 staleTime: 5 * 60 * 1000, // 5 minutes
 retry: false
 });
};
