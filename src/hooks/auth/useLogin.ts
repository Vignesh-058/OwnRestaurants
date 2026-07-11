import { useMutation } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { toast } from 'sonner';
import { useOrganizationStore } from '@/store/OrganizationStore';

import { APP_CONFIG } from '@/constants';

export const useLogin = () => {
 const organizationId = useOrganizationStore(state => state.organization?._id) || APP_CONFIG.belongsTo;

 return useMutation({
 mutationFn: (phone: string) => {
 console.log("Continue clicked");
 console.log("Payload:", { phone, belongsTo: organizationId });

 if (!organizationId) throw new Error('Organization not found');
 return customerService.login(phone, organizationId);
 },
 onError: (error) => {
 console.error("OTP Error:", error);
 toast.error('Failed to send OTP. Please try again.');
 }
 });
};
