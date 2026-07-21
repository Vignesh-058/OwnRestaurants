export interface RewardTransaction {
  _id: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED';
  points: number;
  orderId?: string;
  description: string;
  createdAt: string;
}

export interface RewardBalance {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  monetaryValue?: number;
  tier?: 'Silver' | 'Gold' | 'Platinum' | string;
  nextMilestone?: number;
  expiringPoints?: number;
  expiryDate?: string;
}

export interface RewardRules {
  pointsPerCurrency: number;
  redemptionValuePerPoint: number;
  maxRedeemablePoints: number;
  minOrderAmountToEarn: number;
  minOrderAmountToRedeem: number;
}

export interface RedeemPayload {
  customerId: string;
  outletId: string;
  points: number;
  orderId?: string;
}
