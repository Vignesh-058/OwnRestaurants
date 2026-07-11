import { axiosInstance } from '@/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { Coupon, ApplyCouponPayload, ApplyCouponResponse } from '@/types/coupon.types';

export const couponService = {
 getUserDiscounts: async (belongsTo: string, outletId?: string): Promise<Coupon[]> => {
 const params = new URLSearchParams({ belongsTo });
 if (outletId) params.append('outletId', outletId);

 const response = await axiosInstance.get<ApiResponse<Coupon[]>>(
 `/discount/get-user-discounts?${params.toString()}`
 );
 const data = response.data.data ?? response.data;
 return Array.isArray(data) ? data : (data as any)?.discounts ?? [];
 },

 applyToCart: async (payload: ApplyCouponPayload): Promise<ApplyCouponResponse> => {
 const response = await axiosInstance.post<ApiResponse<ApplyCouponResponse>>(
 '/discount/applyToCart',
 payload
 );
 return response.data.data ?? (response.data as any);
 },
};
