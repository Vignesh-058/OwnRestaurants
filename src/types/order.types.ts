export type OrderStatus =
 | 'Pending'
 | 'Confirmed'
 | 'Preparing'
 | 'Ready'
 | 'Out For Delivery'
 | 'Delivered'
 | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending';

export type PaymentMode = 'COD' | 'Online' | 'Card' | 'UPI' | 'Wallet';

export type OrderType = 'Door Delivery' | 'Self Pickup' | 'Dine In';

export interface OrderItem {
 itemid?: string;
 _id?: string;
 itemname?: string;
 name?: string;
 quantity: number;
 price: number;
 basePrice?: number;
 sellingPrice?: number;
 addons?: Array<{ name: string; price: number }>;
 image?: string | string[];
 variationName?: string;
}

export interface OrderAddress {
 customerName?: string;
 addressLine1?: string;
 addressLine2?: string;
 address?: string;
 city?: string;
 state?: string;
 pincode?: string;
 landmark?: string;
 addressType?: string;
 latitude?: number;
 longitude?: number;
}

export interface Order {
 _id: string;
 orderNo?: string;
 orderId?: string;
 customerName?: string;
 customerPhone?: string;
 phone?: string;
 status: OrderStatus;
 paymentStatus?: PaymentStatus;
 paymentMode?: PaymentMode;
 orderType?: OrderType;
 items: OrderItem[];
 address?: OrderAddress;
 deliveryAddress?: OrderAddress;
 grandTotal: number;
 totalAmount?: number;
 savedAmount?: number;
 deliveryCharge?: number;
 tax?: number;
 discount?: number;
 itemCount?: number;
 createdAt: string;
 updatedAt?: string;
 belongsTo?: string;
 outletId?: string;
 notes?: string;
}

export interface OrdersApiResponse {
 orders: Order[];
 totalOrders?: number;
 totalPages?: number;
 currentPage?: number;
 hasNextPage?: boolean;
 hasPrevPage?: boolean;
}
