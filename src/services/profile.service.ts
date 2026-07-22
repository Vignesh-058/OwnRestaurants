import { orderService } from './order.service';

export interface ProfileStats {
  orders: number;
  spent: number;
  saved: number;
}

export const profileService = {
  getProfileStats: async (_belongsTo: string, _customerPhoneNo: string): Promise<ProfileStats> => {
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

      const excludedStatuses = ['cancelled', 'Cancelled', 'failed', 'Failed', 'rejected', 'Rejected'];

      orders.forEach((order: any) => {
        if (!excludedStatuses.includes(order.status)) {
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
