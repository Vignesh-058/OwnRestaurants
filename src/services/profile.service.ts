import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';

import { orderService } from './order.service';

export interface ProfileStats {
  orders: number;
  spent: number;
  saved: number;
}

export const profileService = {
  getProfileStats: async (belongsTo: string, customerPhoneNo: string): Promise<ProfileStats> => {
    try {
      // Future dedicated API Endpoint could be used here
      // const response = await axiosInstance.get(`${ENV.CUSTOMER_API}/stats`, { params: { belongsTo, customerPhoneNo } });
      // return response.data;

      // Realtime calculation using existing Orders API
      const response = await orderService.getOrdersByCustomer(1, 1000);
      const orders = response.data || [];

      let completedOrders = 0;
      let totalSpent = 0;
      let totalSaved = 0;

      const completedStatuses = ['delivered', 'Delivered', 'Completed', 'completed'];

      orders.forEach((order: any) => {
        if (completedStatuses.includes(order.status)) {
          completedOrders += 1;
          totalSpent += (order.grandTotal || order.totalAmount || 0);
          totalSaved += (order.savedAmount || 0);
        }
      });

      return {
        orders: completedOrders,
        spent: totalSpent,
        saved: totalSaved,
      };
    } catch (error) {
      console.error('[ProfileService] getProfileStats failed:', error);
      throw error;
    }
  },
};
