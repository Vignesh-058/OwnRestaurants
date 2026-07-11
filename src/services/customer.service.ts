import { axiosInstance } from '@/api/axios';
import type { Address, CreateAddressPayload } from '@/types/customer.types';
import type { ApiResponse } from '@/types/api.types';

export const customerService = {
 login: async (phone: string, belongsTo: string): Promise<any> => {
 const formattedPhone = phone.startsWith('+91') ? phone.slice(1) : phone.startsWith('91') ? phone : `91${phone}`;

 const endpoint = '/customer/login';
 const payload = {
 phone: formattedPhone,
 belongsTo,
 mode: 'otp'
 };
 
 console.log("--- BEFORE AXIOS POST ---");
 console.log("Original Phone:", phone);
 console.log("Formatted Phone:", formattedPhone);
 console.log("OTP Payload:", payload);
 console.log("Endpoint:", endpoint);
 console.log("Headers:", axiosInstance.defaults.headers);
 
 try {
 const response = await axiosInstance.post<ApiResponse<any>>(endpoint, payload);
 
 console.log("--- AFTER AXIOS POST ---");
 console.log("Status:", response.status);
 console.log("Response:", response.data);
 
 return response.data;
 } catch (error: any) {
 console.error("Axios Exception in login:", error);
 throw error;
 }
 },

 verifyOtp: async (phone: string, otp: string, belongsTo: string): Promise<any> => {
 const formattedPhone = phone.startsWith('+91') ? phone.slice(1) : phone.startsWith('91') ? phone : `91${phone}`;

 const payload = {
 phone: formattedPhone,
 otp,
 belongsTo
 };

 console.log("--- BEFORE AXIOS POST ---");
 console.log("Original Phone:", phone);
 console.log("Formatted Phone:", formattedPhone);
 console.log("OTP Payload:", payload);

 const response = await axiosInstance.post<ApiResponse<any>>('/customer/verify-otp', payload);
 return response.data;
 },

 getAddresses: async (belongsTo: string): Promise<Address[]> => {
 try {
 const response = await axiosInstance.get<ApiResponse<Address[]>>(`/customer/get-addresses?belongsTo=${belongsTo}`);
 return response.data.data || response.data || [];
 } catch (e: any) {
 console.warn('[CustomerService] getAddresses failed:', e.response?.status);
 throw e;
 }
 },

 createAddress: async (payload: CreateAddressPayload, belongsTo: string): Promise<Address> => {
 const response = await axiosInstance.post<ApiResponse<Address>>('/customer/create-address', {
 ...payload,
 belongsTo
 });
 return response.data.data;
 }
};
