import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { 
 CartCreateRequest, 
 AddToCartPayload, // keeping for updateCart backwards compatibility
 RemoveFromCartPayload, 
 GetCartDetailsPayload,
 CartResponse 
} from '@/types/cart.types';
import type { ApiResponse } from '@/types/api.types';

const normalizePhone = (phone: string | undefined): string => {
  if (!phone || phone === '0000000000') return '0000000000';
  let formatted = phone.replace(/\D/g, '');
  if (formatted.length === 10) {
    formatted = '91' + formatted;
  }
  return formatted;
};

export const cartService = {
  getCartDetails: async (payload: GetCartDetailsPayload): Promise<CartResponse | null> => {
    const requestPayload = { ...payload, customerPhoneNo: normalizePhone(payload.customerPhoneNo) };
    console.log(`[cart API request] /get-cart-details phone: ${requestPayload.customerPhoneNo}`);
    const response = await axiosInstance.post<ApiResponse<CartResponse[]>>(`${ENV.CART_API}/get-cart-details`, requestPayload);
    const data = response.data.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  },

  createCart: async (payload: CartCreateRequest): Promise<any> => {
    const requestPayload = { ...payload, customerPhoneNo: normalizePhone(payload.customerPhoneNo) };
    console.log(`[cart API request] /create phone: ${requestPayload.customerPhoneNo}`);
    const response = await axiosInstance.post(`${ENV.CART_API}/create`, requestPayload);
    return response.data;
  },

  updateCart: async (payload: AddToCartPayload): Promise<any> => {
    const requestPayload = { ...payload, customerPhoneNo: normalizePhone(payload.customerPhoneNo) };
    console.log(`[cart API request] /update phone: ${requestPayload.customerPhoneNo}`);
    const response = await axiosInstance.post(`${ENV.CART_API}/update`, requestPayload);
    return response.data;
  },

  removeFromCart: async (payload: RemoveFromCartPayload): Promise<any> => {
    const requestPayload = { ...payload, customerPhoneNo: normalizePhone(payload.customerPhoneNo) };
    console.log(`[cart API request] /delete/item phone: ${requestPayload.customerPhoneNo}`);
    const response = await axiosInstance.post(`${ENV.CART_API}/delete/item`, requestPayload);
    return response.data;
  }
};
