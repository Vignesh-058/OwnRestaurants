/**
 * coupon.service.ts
 * Re-exports discount service functions under legacy coupon naming.
 * The actual API calls are handled by discount.service.ts.
 * This file exists for backwards compatibility with hooks that import couponService.
 */
import { getUserDiscounts, applyDiscountToCart } from '@/services/discount.service';

export const couponService = {
  getUserDiscounts,
  applyToCart: applyDiscountToCart,
};
