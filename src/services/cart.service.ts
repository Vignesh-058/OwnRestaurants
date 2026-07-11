import { axiosInstance } from '@/api/axios';
import type { 
 AddToCartPayload, 
 RemoveFromCartPayload, 
 GetCartDetailsPayload,
 CartResponse 
} from '@/types/cart.types';
import type { ApiResponse } from '@/types/api.types';

export const cartService = {
 getCartDetails: async (payload: GetCartDetailsPayload): Promise<CartResponse> => {
 const response = await axiosInstance.post<ApiResponse<CartResponse>>('/cart/get-cart-details', payload);
 return response.data.data;
 },

 createCart: async (payload: AddToCartPayload): Promise<any> => {
 const response = await axiosInstance.post('/cart/create', payload);
 return response.data;
 },

 updateCart: async (payload: AddToCartPayload): Promise<any> => {
 const response = await axiosInstance.post('/cart/update', payload);
 return response.data;
 },

 removeFromCart: async (payload: RemoveFromCartPayload): Promise<any> => {
 const response = await axiosInstance.post('/cart/delete/item', payload);
 return response.data;
 }
};
