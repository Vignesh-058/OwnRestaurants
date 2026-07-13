export interface DiscountCode {
  code: string;
  discountId: string;
  outletId: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
  assignedAt: string;
}

export interface Customer {
 _id: string;
 phone: string;
 name?: string;
 email?: string;
 avatar?: string;
 customerType?: string;
 newCustomer?: boolean;
 orderedOutlets?: string[];
 totalOrders?: number;
 orderTotals?: number;
 lastOrderedOutlet?: string;
 lastOrderedDate?: string;
 lastVisitedDate?: string;
 discountCodes?: DiscountCode[];
 // Keep for backward compatibility in ProfileStats
 ordersCount?: number;
 totalSpent?: number;
 savedAddressesCount?: number;
}

export interface AuthResponse {
 token?: string;
 accessToken?: string;
 refreshToken?: string;
 customer?: Customer;
 user?: Customer;
 session?: any;
}

export interface CustomerProfile extends Customer {
 ordersCount?: number;
 totalSpent?: number;
 savedAddressesCount?: number;
 createdAt?: string;
}

export type AddressType = 'home' | 'work' | 'other';

export interface CustomerAddress {
 _id: string;
 customerName: string;
 address1: string; // House/Flat No
 address2?: string; // Street/Area
 city: string;
 state: string;
 country: string;
 pincode: string;
 landMark?: string;
 type: AddressType;
 isDefault?: boolean;
 latitude: number;
 longitude: number;
 createdAt?: string;
 lastUsedAt?: string;
}

export interface CreateAddressRequest {
 address1: string;
 address2: string;
 city: string;
 state: string;
 country: string;
 pincode: string;
 latitude: number;
 longitude: number;
 landMark?: string;
 type: AddressType;
}

export interface CreateAddressResponse {
 status: string;
 message: string;
 address: CustomerAddress;
}
