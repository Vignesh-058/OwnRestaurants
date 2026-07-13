import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { CustomerAddress, CreateAddressRequest, CreateAddressResponse, AuthResponse } from '@/types/customer.types';
import type { ApiResponse } from '@/types/api.types';

export const customerService = {
  login: async (phone: string, belongsTo: string): Promise<{ status: string; message: string }> => {
    // Backend bug workaround: /login crashes with 502 if 91 is included
    let formattedPhone = phone.startsWith('+') ? phone.slice(1) : phone;
    if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
      formattedPhone = formattedPhone.slice(2);
    }

    const endpoint = `${ENV.AUTH_API}/login`;
    const payload = {
      phone: formattedPhone,
      belongsTo,
      mode: 'otp'
    };
    
    try {
      const response = await axiosInstance.post<ApiResponse<{ status: string; message: string }>>(endpoint, payload);
      return response.data as any; // Backend returns status/message in root or data depending on version
    } catch (error: any) {
      throw error;
    }
  },

  verifyOtp: async (phone: string, otp: string, belongsTo: string): Promise<AuthResponse> => {
    // Backend bug workaround: /verify-otp crashes with 502 if 91 is NOT included
    let formattedPhone = phone.startsWith('+') ? phone.slice(1) : phone;
    if (formattedPhone.length === 10) {
      formattedPhone = `91${formattedPhone}`;
    }

    const payload = {
      phone: formattedPhone,
      otp,
      belongsTo
    };

    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(`${ENV.AUTH_API}/verify-otp`, payload);
    return response.data as any; // Backend returns token in root or data
  },

  getAddresses: async (belongsTo: string, customerPhoneNo: string, lat: number, lng: number, page: number = 1, limit: number = 20): Promise<CustomerAddress[]> => {
    if (import.meta.env.DEV) {
      console.warn('[DEV MODE] Bypassing getAddresses API and returning mock data');
      return [{
        _id: "mock-address-id",
        street: "Development Mock Street",
        city: "Thiruvarur",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "610001",
        formattedAddress: "Development Mock Address, Thiruvarur, Tamil Nadu 610001",
        lat: 10.7681,
        lng: 79.6433,
        type: "Home",
        isDefault: true
      }] as unknown as CustomerAddress[];
    }

    try {
      const response = await axiosInstance.post<ApiResponse<CustomerAddress[]>>(`${ENV.ADDRESS_API}/get-addresses?page=${page}&limit=${limit}`, {
        belongsTo,
        customerPhoneNo,
        lat,
        lng
      });
      return response.data.data || (response.data as any) || [];
    } catch (e: any) {
      console.warn('[CustomerService] getAddresses failed:', e.response?.status);
      throw e;
    }
  },

  createAddress: async (payload: CreateAddressRequest): Promise<CreateAddressResponse> => {
    if (import.meta.env.DEV) {
      console.warn('[DEV MODE] Bypassing createAddress API and returning mock success');
      return { _id: "mock-new-address", ...payload } as any;
    }
    
    const response = await axiosInstance.post<ApiResponse<CreateAddressResponse | any>>(`${ENV.ADDRESS_API}/create-address`, payload);
    return response.data.data ?? response.data;
  }
};
