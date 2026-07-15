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
      mode: 'otp',
    };

    if (import.meta.env.DEV) {
      console.log('[DEBUG - Login Request Payload]', JSON.stringify(payload, null, 2));
    }

    try {
      const response = await axiosInstance.post<ApiResponse<{ status: string; message: string }>>(endpoint, payload);
      if (import.meta.env.DEV) {
        console.log('[DEBUG - Login API Response]', JSON.stringify(response.data, null, 2));
      }
      return response.data as any;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        if (error?.response?.data) {
          console.error('[DEBUG - Login Error Response Body]', JSON.stringify(error.response.data, null, 2));
        } else {
          console.error('[DEBUG - Login Error]', error);
        }
      }
      throw error;
    }
  },

  verifyOtp: async (phone: string, otp: string, belongsTo: string): Promise<AuthResponse> => {
    let formattedPhone = phone.startsWith('+') ? phone.slice(1) : phone;
    if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
      formattedPhone = formattedPhone.slice(2);
    }

    if (import.meta.env.DEV) {
      console.log('[DEBUG - OTP value immediately before API call]', otp);
    }

    const payload = {
      phone: formattedPhone,
      otp,
      belongsTo,
    };

    if (import.meta.env.DEV) {
      console.log('[DEBUG - Verify OTP Request Payload]', JSON.stringify(payload, null, 2));
    }

    try {
      const response = await axiosInstance.post<ApiResponse<AuthResponse>>(`${ENV.AUTH_API}/verify-otp`, payload);
      return response.data as any;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        if (error?.response?.data) {
          console.error('[DEBUG - Verify OTP Error Response Body]', JSON.stringify(error.response.data, null, 2));
        } else {
          console.error('[DEBUG - Verify OTP Error]', error);
        }
      }
      throw error;
    }
  },

  getAddresses: async (belongsTo: string, customerPhoneNo: string, lat: number, lng: number, page = 1, limit = 20): Promise<CustomerAddress[]> => {
    try {
      const response = await axiosInstance.post<ApiResponse<CustomerAddress[]>>(`${ENV.ADDRESS_API}/get-addresses?page=${page}&limit=${limit}`, {
        belongsTo,
        customerPhoneNo,
        lat,
        lng,
      });
      return response.data.data || (response.data as any) || [];
    } catch (e: any) {
      console.warn('[CustomerService] getAddresses failed:', e.response?.status);
      throw e;
    }
  },

  createAddress: async (payload: CreateAddressRequest): Promise<CreateAddressResponse> => {
    console.log('[Address] API Request - Create Address', payload);
    const response = await axiosInstance.post<ApiResponse<CreateAddressResponse | any>>(`${ENV.ADDRESS_API}/create-address`, payload);
    console.log('[Address] API Response - Create Address', response.data.data ?? response.data);
    return response.data.data ?? response.data;
  },
};
