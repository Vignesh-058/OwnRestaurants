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

export const cartService = {
  getCartDetails: async (payload: GetCartDetailsPayload): Promise<CartResponse> => {
    const response = await axiosInstance.post<ApiResponse<CartResponse>>(`${ENV.CART_API}/get-cart-details`, payload);
    return response.data.data;
  },

  createCart: async (payload: CartCreateRequest): Promise<any> => {
    const response = await axiosInstance.post(`${ENV.CART_API}/create`, payload);
    return response.data;
  },

  updateCart: async (payload: AddToCartPayload): Promise<any> => {
    const response = await axiosInstance.post(`${ENV.CART_API}/update`, payload);
    return response.data;
  },

  removeFromCart: async (payload: RemoveFromCartPayload): Promise<any> => {
    const response = await axiosInstance.post(`${ENV.CART_API}/delete/item`, payload);
    return response.data;
  }
};
