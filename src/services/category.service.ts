import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { Category } from '@/types/category.types';
import type { ApiResponse } from '@/types/api.types';

export const categoryService = {
 getCategories: async (outletId: string, belongsTo: string): Promise<Category[]> => {
 try {
 const response = await axiosInstance.post<ApiResponse<Category[]>>(`${ENV.CATEGORY_API}/getCategory`, {
 outletId,
 belongsTo
 });
 const raw = response.data;
 const data = (raw as any)?.data !== undefined ? (raw as any).data : raw;
 const categories = Array.isArray(data) ? data : (data?.categories || data?.items || (raw as any)?.categories || []);
 
 return categories.map((cat: any) => ({
 ...cat,
 items: Array.isArray(cat.items) ? cat.items : (Array.isArray(cat.products) ? cat.products : [])
 }));
 } catch (error: any) {
 if (error.response?.status === 400 || error.response?.status === 404) {
 console.warn(`[CategoryService] API Request Failed: ${error.response?.status} - ${error.response?.data?.message || 'No categories found'}`);
 return [];
 }
 console.error('[CategoryService] API Request Failed with unhandled error:', error.response?.status, error.response?.data);
 throw error;
 }
 }
};
