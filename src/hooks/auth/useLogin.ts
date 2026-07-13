import { useMutation } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { toast } from 'sonner';
import { useOrganizationStore } from '@/store/OrganizationStore';

import { APP_CONFIG } from '@/constants';

export const useLogin = () => {
 const organizationId = useOrganizationStore(state => state.organization?._id) || APP_CONFIG.belongsTo;

 return useMutation({
 mutationFn: (phone: string) => {
 if (!organizationId) throw new Error('Organization not found');
 return customerService.login(phone, organizationId);
 },
 onSuccess: () => {
  // Navigation handled by component
  },
 onError: (error: any) => {
 const status = error.response?.status;
 const message = error.response?.data?.message || error.response?.data?.error;
 
 if (status === 400 && message) {
 toast.error(message);
 } else {
 toast.error('Failed to send OTP. Please try again.');
 }
 }
 });
};
