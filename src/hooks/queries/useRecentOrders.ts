import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const useRecentOrders = () => {
 const { isAuthenticated } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);

 return useQuery({
 queryKey: ['orders', organization?._id],
 queryFn: async () => {
 if (!organization?._id) {
 throw new Error('Organization required');
 }
 return orderService.getOrdersByCustomer(1, 5);
 },
 enabled: isAuthenticated && !!organization?._id,
 staleTime: 5 * 60 * 1000,
 });
};
