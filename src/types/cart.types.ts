export interface AddOnDetail {
 group_id: string;
 addon_item_ids: string[];
}

export interface CartItemRequest {
 itemId: string;
 quantity: number;
 variationId: string;
 addOnDetails: AddOnDetail[];
 currency: string;
}

export interface CartCreateRequest {
 items: CartItemRequest[];
 deliveryType: string;
 orderType: string;
 customerName: string;
 customerPhoneNo: string;
 instruction: string;
 addressId?: string;
 outletId: string;
 orderId?: string; // Present on update
}

// Aliases for backwards compatibility with update cart which isn't part of this prompt
export type CartAddOnDetail = AddOnDetail;
export type CartItemPayload = CartItemRequest;
export type AddToCartPayload = CartCreateRequest;

export interface RemoveFromCartPayload {
 outletId: string;
 orderId: string;
 itemid: string;
 customerPhoneNo: string;
 customerName: string;
}

export interface GetCartDetailsPayload {
 customerPhoneNo: string;
 outletId: string;
}

export type PaymentMode = 'ONLINE' | 'COD' | string;
export type OrderType = 'Door Delivery' | 'Pick Up' | string;

export interface DiscountDetails {
 couponName?: string;
 discountAmount: number;
}

export interface Loyalty {
 expectLoyaltyPoints: number;
}

export interface Address {
 _id?: string;
 customerName?: string;
 addressLine1?: string;
 addressLine2?: string;
 city?: string;
 state?: string;
 country?: string;
 pincode?: string;
 landmark?: string;
 addressType?: string;
 latitude?: number;
 longitude?: number;
}

export interface Customer {
 _id: string;
 phone: string;
 name?: string;
}

export interface CartItem {
 _id?: string;
 product_retailer_id: string;
 name: string;
 variationId?: string;
 quantity: number;
 item_price: number;
 itemTotal: number;
 addons?: any[];
 stockStatus?: string;
}

export interface OrderSummary {
 subTotal: number;
 savedAmount: number;
 deliveryCharge: number;
 packageCharge: number;
 tax: number;
 discount: number;
 grandTotal: number;
}

export interface CartResponse {
 _id: string;
 orderId: string;
 items: CartItem[];
 orderTotal: number;
 savedAmount: number;
 deliveryCharge: number;
 totalPackageCharge: number;
 totalTax: number;
 paymentMode: string;
 orderType: string;
 customerAddress: string | null;
 addressId: string | null;
 checkoutEnable: boolean;
 checkOutMessage: string;
}
