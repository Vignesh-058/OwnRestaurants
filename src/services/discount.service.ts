import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { Coupon, ApplyCouponPayload } from '@/types/coupon.types';

export const getUserDiscounts = async (outletId: string): Promise<Coupon[]> => {
  const payload = { outletId };
  console.log('[Discount] API Request – getUserDiscounts', payload);
  const response = await axiosInstance.post<ApiResponse<Coupon[]>>(
    `${ENV.COUPON_API}/get-user-discounts`,
    payload
  );
  
  const data = response.data.data ?? response.data;
  console.log('[Discount] API Response – getUserDiscounts', data);
  return Array.isArray(data) ? data : (data as any)?.discounts ?? [];
};

export const applyDiscountToCart = async (payload: ApplyCouponPayload): Promise<any> => {
  console.log('[Discount] Apply Discount Payload', payload);
  const response = await axiosInstance.post<ApiResponse<any>>(
    `${ENV.COUPON_API}/applyToCart`,
    payload
  );
  
  const data = response.data.data ?? response.data;
  console.log('[Discount] Apply Discount Response', data);
  return data;
};
