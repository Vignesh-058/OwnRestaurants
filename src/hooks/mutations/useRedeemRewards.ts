import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardsService } from '@/services/rewards.service';
import { toast } from 'sonner';
import type { RedeemPayload } from '@/types/rewards.types';
import { useAuthStore } from '@/store/AuthStore';

export const useRedeemRewards = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: RedeemPayload) => {
      return rewardsService.redeemPoints(payload);
    },
    onSuccess: () => {
      toast.success('Points redeemed successfully!');
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ['rewards-balance', user._id] });
        queryClient.invalidateQueries({ queryKey: ['rewards-transactions', user._id] });
      }
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to redeem points';
      toast.error(msg);
    }
  });
};
