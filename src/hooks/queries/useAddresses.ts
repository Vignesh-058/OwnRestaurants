import { useQuery } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useAddressStore } from '@/store/AddressStore';

export const useAddresses = () => {
 const { user } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);
 const setAddresses = useAddressStore((state) => state.setAddresses);

 return useQuery({
 queryKey: ['addresses', user?.phone, organization?._id],
 queryFn: async () => {
 if (!user?.phone || !organization?._id) return [];
 const data = await customerService.getAddresses(organization._id);
 setAddresses(data);
 return data;
 },
 enabled: !!user?.phone && !!organization?._id,
 staleTime: 5 * 60 * 1000, // 5 minutes
 });
};
