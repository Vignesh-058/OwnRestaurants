import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { RewardBalance, RewardTransaction, RedeemPayload, RewardRules } from '@/types/rewards.types';

export const rewardsService = {
  async getBalance(customerId: string): Promise<RewardBalance> {
    try {
      const response = await axiosInstance.get<ApiResponse<RewardBalance>>(
        `${ENV.REWARDS_API}/balance/${customerId}`
      );
      return response.data.data ?? response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('[Rewards] API not found. Returning mock balance.');
        return {
          currentPoints: 1250,
          totalEarned: 2500,
          totalRedeemed: 1250,
          monetaryValue: 125,
          tier: 'Gold Member',
          nextMilestone: 2000,
          expiringPoints: 250,
          expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        };
      }
      throw error;
    }
  },

  async getTransactions(customerId: string): Promise<RewardTransaction[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<RewardTransaction[]>>(
        `${ENV.REWARDS_API}/transactions/${customerId}`
      );
      return response.data.data ?? response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('[Rewards] API not found. Returning mock transactions.');
        return [
          {
            _id: '1',
            type: 'EARNED',
            points: 120,
            orderId: 'ORD-10452',
            description: 'Points earned on order',
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            type: 'REDEEMED',
            points: 500,
            orderId: 'ORD-10400',
            description: 'Redeemed during checkout',
            createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
          },
        ];
      }
      throw error;
    }
  },

  async getRules(): Promise<RewardRules> {
    try {
      const response = await axiosInstance.get<ApiResponse<RewardRules>>(
        `${ENV.REWARDS_API}/rules`
      );
      return response.data.data ?? response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('[Rewards] API not found. Returning mock rules.');
        return {
          pointsPerCurrency: 1,
          redemptionValuePerPoint: 0.1,
          maxRedeemablePoints: 1000,
          minOrderAmountToEarn: 500,
          minOrderAmountToRedeem: 200,
        };
      }
      throw error;
    }
  },

  async redeemPoints(payload: RedeemPayload): Promise<any> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>(
        `${ENV.REWARDS_API}/redeem`,
        payload
      );
      return response.data.data ?? response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('[Rewards] API not found. Simulating successful redemption.');
        return { success: true, message: 'Points redeemed successfully.' };
      }
      throw error;
    }
  },
};
