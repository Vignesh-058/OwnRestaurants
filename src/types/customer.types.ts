export interface Customer {
 _id: string;
 phone: string;
 name?: string;
 email?: string;
 avatar?: string;
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

export interface Address {
 _id: string;
 customerName: string;
 addressLine1: string;
 addressLine2?: string;
 city: string;
 state: string;
 country: string;
 pincode: string;
 landmark?: string;
 addressType: 'Home' | 'Work' | 'Other';
 isDefault?: boolean;
 latitude?: number;
 longitude?: number;
 createdAt?: string;
 lastUsedAt?: string;
}

export interface CreateAddressPayload {
 customerName: string;
 addressLine1: string;
 addressLine2?: string;
 city: string;
 state: string;
 country: string;
 pincode: string;
 landmark?: string;
 addressType: 'Home' | 'Work' | 'Other';
 latitude?: number;
 longitude?: number;
}
