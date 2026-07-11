import { axiosInstance } from '@/api/axios';
import type { Banner } from '@/types/banner.types';
import type { ApiResponse } from '@/types/api.types';
import { AxiosError } from 'axios';

export const bannerService = {
 async getActiveBanners(belongsTo: string, outletId: string): Promise<Banner[]> {
 try {
 const response = await axiosInstance.post<ApiResponse<Banner[]>>('/banner/get-active', {
 belongsTo,
 outletId
 });
 return response.data.data;
 } catch (error) {
 if (error instanceof AxiosError && error.response?.status === 403) {
 // Safely type-cast the response data to read the custom backend message
 const responseData = error.response.data as { message?: string };
 const message = responseData?.message || '';
 
 // If banners are simply disabled for this outlet, gracefully return an empty array
 if (message.includes('disabled') || message.includes('settings')) {
 console.warn('[BannerService] Banners are disabled for this outlet. Gracefully returning empty array.');
 return [];
 }
 }
 
 if (error instanceof AxiosError) {
 console.error('[BannerService] ❌ Request Failed with status:', error.response?.status);
 console.error('[BannerService] ❌ Response Data:', error.response?.data);
 console.error('[BannerService] ❌ Request Payload:', error.config?.data);
 }
 throw error;
 }
 }
};
