import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coupon } from '@/types/coupon.types';

interface CouponState {
 appliedCoupon: Coupon | null;
 appliedCouponCode: string | null;
 discountAmount: number;
 savings: number;
 discountedTotal: number | null;

 setAppliedCoupon: (coupon: Coupon | null, code: string | null, discount: number, total: number | null) => void;
 clearCoupon: () => void;
}

export const useCouponStore = create<CouponState>()(
 persist(
 (set) => ({
 appliedCoupon: null,
 appliedCouponCode: null,
 discountAmount: 0,
 savings: 0,
 discountedTotal: null,

 setAppliedCoupon: (coupon, code, discount, total) =>
 set({
 appliedCoupon: coupon,
 appliedCouponCode: code,
 discountAmount: discount,
 savings: discount,
 discountedTotal: total,
 }),

 clearCoupon: () =>
 set({
 appliedCoupon: null,
 appliedCouponCode: null,
 discountAmount: 0,
 savings: 0,
 discountedTotal: null,
 }),
 }),
 { name: 'coupon-storage' }
 )
);
