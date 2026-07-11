export interface CartAddOnDetail {
 group_id: string;
 addon_item_ids: string[];
}

export interface CartItemPayload {
 itemId: string;
 quantity: number;
 variationId: string;
 addOnDetails: CartAddOnDetail[];
 currency: string;
}

export interface AddToCartPayload {
 items: CartItemPayload[];
 deliveryType: string;
 orderType: string;
 customerName: string;
 customerPhoneNo: string;
 instruction: string;
 addressId?: string;
 outletId: string;
 orderId?: string; // Present on update
}

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

// Responses
export interface CartItem {
 _id: string;
 itemid: {
 _id: string;
 itemname: string;
 sellingPrice: number;
 image: string[];
 dietryType: string;
 };
 quantity: number;
 price: number;
 variation_id?: {
 _id: string;
 name: string;
 };
 addons: any[]; // define stricter if needed
 totalPrice: number;
}

export interface CartResponse {
 _id: string;
 orderId: string;
 items: CartItem[];
 subTotal: number;
 tax: number;
 total: number;
 customerPhoneNo: string;
 outlet: string;
}
