import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { Coupon, ApplyCouponPayload, ApplyCouponResponse } from '@/types/coupon.types';

export const couponService = {
  getUserDiscounts: async (outletId: string): Promise<Coupon[]> => {
    if (import.meta.env.DEV) {
      console.warn('[DEV MODE] Bypassing getUserDiscounts API');
      return [];
    }
    const response = await axiosInstance.post<ApiResponse<Coupon[]>>(
      `${ENV.COUPON_API}/get-user-discounts`,
      { outletId }
    );
    const data = response.data.data ?? response.data;
    return Array.isArray(data) ? data : (data as any)?.discounts ?? [];
  },

  applyToCart: async (payload: ApplyCouponPayload): Promise<ApplyCouponResponse> => {
    if (import.meta.env.DEV) {
      console.warn('[DEV MODE] Bypassing applyToCart API');
      return { status: "success" } as any;
    }
    const response = await axiosInstance.post<ApiResponse<ApplyCouponResponse>>(
      `${ENV.COUPON_API}/applyToCart`,
      payload
    );
    return response.data.data ?? (response.data as any);
  },
};
