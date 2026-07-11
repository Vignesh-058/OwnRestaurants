import { axiosInstance } from '@/api/axios';
import type { ItemDetail } from '@/types/product.types';
import type { ApiResponse } from '@/types/api.types';

export const productService = {
 getItemDetail: async (itemId: string, outletId: string, variationId?: string): Promise<ItemDetail> => {
 const payload: Record<string, string> = {
 itemId,
 outletId
 };
 if (variationId) {
 payload.variationid = variationId;
 }

 const response = await axiosInstance.post<ApiResponse<ItemDetail>>('/item/getItemDetail', payload);
 return response.data.data;
 }
};
