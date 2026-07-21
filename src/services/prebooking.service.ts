import { axiosInstance } from '@/api/axios';
import type { GetActivePreBookingPayload, GetActivePreBookingResponse } from '@/types/prebooking.types';

export const preBookingService = {
  getActiveCampaigns: async (payload: GetActivePreBookingPayload): Promise<GetActivePreBookingResponse> => {
    const response = await axiosInstance.post('/preBooking/getActive', payload);
    return response.data;
  }
};
