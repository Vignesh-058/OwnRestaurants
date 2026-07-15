import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';

interface OrderCheckoutPayload {
  orderId: string;
  outletId: string;
  customerPhoneNo: string;
  addressId?: string;
  paymentMode?: string;
  orderType?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  onlineMethod?: string;
}

export const useOrderCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OrderCheckoutPayload) => {
      console.log('Checkout Request');
      console.log('Checkout Payload:', payload);
      const res = await cartService.orderCheckout(payload);
      console.log('Checkout Response:', res);
      return res;
    },
    onSuccess: () => {
      console.log('Checkout Success');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
    },
    onError: (error: any) => {
      console.log('Checkout Failure');
      console.error('Order checkout failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to checkout order. Please try again.');
    },
  });
};
