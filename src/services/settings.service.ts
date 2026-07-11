import { axiosInstance } from '@/api/axios';
import type { Settings } from '@/types/settings.types';
import type { ApiResponse } from '@/types/api.types';

export const settingsService = {
 getSettings: async (belongsTo: string, outletId: string): Promise<Settings> => {
 const response = await axiosInstance.post<ApiResponse<Settings>>('/setting/get', {
 belongsTo,
 outletId
 });
 return response.data.data;
 }
};
