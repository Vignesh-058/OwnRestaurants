import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';
import { useOrganizationStore } from '@/store/OrganizationStore';

import { APP_CONFIG } from '@/constants';

interface VerifyOTPPayload {
 phone: string;
 otp: string;
}

export const useVerifyOTP = () => {
 const setAuth = useAuthStore(state => state.setAuth);
 const organizationId = useOrganizationStore(state => state.organization?._id) || APP_CONFIG.belongsTo;
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: ({ phone, otp }: VerifyOTPPayload) => {
 if (!organizationId) throw new Error('Organization not found');
 return customerService.verifyOtp(phone, otp, organizationId);
 },
 onSuccess: (data) => {
 console.log("[VERIFY OTP] Backend Response Data:", data);

 // Support various backend formats (nested inside data.data or root data)
 const rawToken = data?.accessToken || data?.data?.accessToken || data?.token || data?.data?.token;
 
 let extractedToken = '';
 if (typeof rawToken === 'string') {
 extractedToken = rawToken;
 } else if (rawToken && typeof rawToken === 'object') {
 extractedToken = rawToken.token || rawToken.accessToken || rawToken.value || '';
 }

 const extractedCustomer = data?.customer || data?.user || data?.data?.customer || data?.data?.user;

 if (extractedToken && extractedCustomer) {
 setAuth(true, extractedCustomer, extractedToken);
 
 // Invalidate specific queries when user logs in
 queryClient.invalidateQueries({ queryKey: ['profile'] });
 queryClient.invalidateQueries({ queryKey: ['cart'] });
 queryClient.invalidateQueries({ queryKey: ['orders'] });
 
 toast.success('Successfully logged in!');
 } else {
 console.error("[VERIFY OTP] Missing token or customer in response. Data received:", data);
 toast.error('Invalid response from server.');
 }
 },
 onError: () => {
 toast.error('Invalid OTP. Please try again.');
 }
 });
};
