import { axiosInstance } from '@/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { Order, OrdersApiResponse } from '@/types/order.types';

export const orderService = {
 getOrdersByCustomer: async (page = 1, limit = 20): Promise<OrdersApiResponse> => {
 const response = await axiosInstance.get<ApiResponse<any>>(
 `/order/get-all-order-by-customer?page=${page}&limit=${limit}`
 );
 const payload = response.data.data ?? response.data;
 const orders: Order[] = Array.isArray(payload)
 ? payload
 : payload?.orders ?? [];
 return {
 orders,
 totalOrders: payload?.totalOrders,
 totalPages: payload?.totalPages,
 currentPage: payload?.currentPage ?? page,
 hasNextPage: payload?.hasNextPage,
 hasPrevPage: payload?.hasPrevPage,
 };
 },

 getOrderById: async (orderId: string): Promise<Order> => {
 const response = await axiosInstance.get<ApiResponse<Order>>(`/order/${orderId}`);
 return response.data.data;
 },
};
