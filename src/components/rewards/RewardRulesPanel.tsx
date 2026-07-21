import { Settings, Info, ShoppingCart } from 'lucide-react';
import type { RewardRules } from '@/types/rewards.types';

interface RewardRulesPanelProps {
  rules?: RewardRules;
}

export const RewardRulesPanel = ({ rules }: RewardRulesPanelProps) => {
  if (!rules) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#FFE2CC] shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-[#FF6B00]" />
        <h3 className="text-lg font-bold text-[#1F2937]">How it works</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
          <Info className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1F2937] text-sm">Earn Points</p>
            <p className="text-sm text-[#6B7280]">
              You earn {rules.pointsPerCurrency} point for every ₹1 spent on eligible items.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
          <ShoppingCart className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1F2937] text-sm">Minimum Order</p>
            <p className="text-sm text-[#6B7280]">
              Points are awarded for orders over ₹{rules.minOrderAmountToEarn}.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
          <Info className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1F2937] text-sm">Redemption Value</p>
            <p className="text-sm text-[#6B7280]">
              Each point is worth ₹{rules.redemptionValuePerPoint} during checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
