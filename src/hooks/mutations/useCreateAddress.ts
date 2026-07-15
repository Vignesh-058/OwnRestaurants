import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { CreateAddressRequest } from '@/types/customer.types';
import { toast } from 'sonner';

export const useCreateAddress = () => {
 const queryClient = useQueryClient();
 const { user } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);

 return useMutation({
 mutationFn: async (payload: Omit<CreateAddressRequest, 'belongsTo' | 'customerPhoneNo'>) => {
 if (!organization?._id) {
 throw new Error('Organization missing');
 }
 const fullPayload: CreateAddressRequest = {
   ...payload,
   belongsTo: organization._id,
   customerPhoneNo: user?.phone || '0000000000',
 };
 return customerService.createAddress(fullPayload);
 },
 onSuccess: () => {
 // Invalidate addresses to trigger refetch
 queryClient.invalidateQueries({ queryKey: ['addresses', user?.phone, organization?._id] });
 },
 onError: (error: any) => {
 console.error('[useCreateAddress] Error:', error);
 toast.error('Unable to save address.');
 }
 });
};
