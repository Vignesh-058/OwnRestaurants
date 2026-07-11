export type DiscountType = 'Percentage' | 'Fixed' | 'FlatOff' | 'BuyXGetY';
export type CouponStatus = 'Available' | 'Applied' | 'Expired' | 'Used' | 'Disabled';

export interface Coupon {
 _id: string;
 code: string;
 name?: string;
 description?: string;
 discountType: DiscountType | string;
 discountValue: number;
 minOrderAmount?: number;
 maxDiscount?: number;
 maxDiscountAmount?: number;
 expiryDate?: string;
 validTill?: string;
 isActive?: boolean;
 usageLimit?: number;
 usedCount?: number;
 belongsTo?: string;
 outletId?: string;
 status?: CouponStatus;
}

export interface ApplyCouponPayload {
 couponCode: string;
 orderId: string;
 outletId: string;
 belongsTo: string;
}

export interface ApplyCouponResponse {
 discountAmount?: number;
 discount?: number;
 savings?: number;
 grandTotal?: number;
 total?: number;
 message?: string;
 couponCode?: string;
 code?: string;
}
