import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { CreateAddressPayload } from '@/types/customer.types';
import { toast } from 'sonner';

export const useCreateAddress = () => {
 const queryClient = useQueryClient();
 const { user } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);

 return useMutation({
 mutationFn: async (payload: CreateAddressPayload) => {
 if (!user?.phone || !organization?._id) {
 throw new Error('Authentication or Organization missing');
 }
 return customerService.createAddress(payload, organization._id);
 },
 onSuccess: () => {
 toast.success('Address saved successfully!');
 // Invalidate addresses to trigger refetch
 queryClient.invalidateQueries({ queryKey: ['addresses', user?.phone, organization?._id] });
 },
 onError: (error: any) => {
 console.error('[useCreateAddress] Error:', error);
 toast.error(error?.response?.data?.message || 'Failed to save address. Please try again.');
 }
 });
};
