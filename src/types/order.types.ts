export type OrderStatus =
 | 'orderReceived'
 | 'orderPlaced'
 | 'preparing'
 | 'Ready'
 | 'outForDelivery'
 | 'delivered'
 | 'orderCancelled'
 | 'Pending'
 | 'Confirmed'
 | 'Preparing'
 | 'Out For Delivery'
 | 'Delivered'
 | 'Cancelled';

export type PaymentStatus = 'paid' | 'unpaid' | 'failed' | 'Paid' | 'Unpaid' | 'Pending';

export type PaymentMode = 'COD' | 'Online' | 'Card' | 'UPI' | 'Wallet';

export type OrderType = 'Door Delivery' | 'Self Pickup' | 'Dine In';

export type DeliveryStatus = 'Task Created' | 'Picked Up' | 'On The Way' | 'Delivered' | 'Cancelled';

export interface Addon {
 name: string;
 price: number;
 group?: string;
}

export interface DiscountItem {
 name?: string;
 amount?: number;
 code?: string;
 couponName?: string;
}

export interface OrderItem {
 itemid?: string;
 _id?: string;
 itemname?: string;
 name?: string;
 quantity: number;
 price: number;
 basePrice?: number;
 sellingPrice?: number;
 addons?: Addon[];
 addOnDetails?: Addon[];
 image?: string | string[];
 variationName?: string;
 packageCharge?: number;
 tax?: number;
 discount?: number;
 variationId?: string;
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

export interface Delivery {
 partnerName?: string;
 driverName?: string;
 driverPhone?: string;
 status?: DeliveryStatus;
 trackingUrl?: string;
 eta?: string;
 pickupAddress?: string;
 dropAddress?: string;
 deliveryCharge?: number;
 deliveryOtp?: string;
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
 packageCharge?: number;
 itemCount?: number;
 createdAt: string;
 updatedAt?: string;
 belongsTo?: string;
 outletId?: string;
 notes?: string;
 currentDelivery?: Delivery;
 instructions?: string;
 orderStatus?: string;
 transactionId?: string;
 bill?: any;
 subtotal?: number;
 price?: number;
}

export interface Pagination {
 totalOrders: number;
 totalPages: number;
 currentPage: number;
 hasNextPage: boolean;
 hasPrevPage: boolean;
 limit: number;
}

export interface CustomerOrdersResponse {
 data: Order[];
 totalOrders: number;
 pagination: Pagination;
}
