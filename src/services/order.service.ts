import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { Order, CustomerOrdersResponse } from '@/types/order.types';

export const orderService = {
  getOrdersByCustomer: async (page = 1, limit = 20): Promise<CustomerOrdersResponse> => {
    if (import.meta.env.DEV) {
      console.warn('[DEV MODE] Bypassing getOrdersByCustomer API');
      return {
        data: [],
        totalOrders: 0,
        pagination: { totalOrders: 0, totalPages: 1, currentPage: 1, hasNextPage: false, hasPrevPage: false, limit }
      };
    }
    const response = await axiosInstance.post<ApiResponse<CustomerOrdersResponse | any>>(
      `${ENV.ORDER_API}/get-all-order-by-customer?page=${page}&limit=${limit}`,
      {}
    );
    const payload = response.data.data ?? response.data;
    const orders: Order[] = Array.isArray(payload)
      ? payload
      : payload?.orders ?? payload?.data ?? [];
    
    const totalOrders = payload?.totalOrders ?? payload?.pagination?.totalOrders ?? orders.length;
    const totalPages = payload?.totalPages ?? payload?.pagination?.totalPages ?? 1;
    const currentPage = payload?.currentPage ?? payload?.pagination?.currentPage ?? page;
    const hasNextPage = payload?.hasNextPage ?? payload?.pagination?.hasNextPage ?? false;
    const hasPrevPage = payload?.hasPrevPage ?? payload?.pagination?.hasPrevPage ?? false;

    return {
      data: orders,
      totalOrders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        limit,
      }
    };
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    if (ENV.DEV_MODE) {
      console.warn('[DEV MODE] Bypassing getOrderById API');
      return { _id: orderId, orderStatus: "Placed" } as any;
    }
    const response = await axiosInstance.get<ApiResponse<Order>>(`${ENV.ORDER_API}/${orderId}`);
    return response.data.data;
  },

  placeOrder: async (payload: any): Promise<any> => {
    console.log('[DEBUG - Place Order Payload]', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<ApiResponse<any>>(`${ENV.ORDER_API}/place-order`, payload);
    return response.data;
  }
};
