import { useMutation } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { ApiErrorParser } from '@/utils/ApiErrorParser';
import { toast } from 'sonner';

export const useLogin = () => {
 return useMutation({
 mutationFn: ({ phone, belongsTo }: { phone: string; belongsTo: string }) => {
 return customerService.login(phone, belongsTo);
 },
 onError: (error) => {
 const parsed = ApiErrorParser(error);
 toast.error(parsed.message || 'Failed to send OTP.');
 },
 });
};

export const useVerifyOtp = () => {
 const setAuth = useAuthStore((state) => state.setAuth);

 return useMutation({
 mutationFn: ({ phone, otp, belongsTo }: { phone: string; otp: string; belongsTo: string }) => {
 return customerService.verifyOtp(phone, otp, belongsTo);
 },
    onSuccess: (data: any) => {
      const customer = data.customer || data.user || {};
      const token = data.token || data.accessToken || '';
      setAuth(true, customer, token);
    },
 onError: (error) => {
 const parsed = ApiErrorParser(error);
 toast.error(parsed.message || 'Invalid OTP.');
 },
 });
};
