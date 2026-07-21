import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Coins, Star, Calendar } from 'lucide-react';
import type { RewardBalance } from '@/types/rewards.types';
import { Progress } from '@/components/ui/progress';

interface RewardBalanceCardProps {
  balance?: RewardBalance;
}

export const RewardBalanceCard = ({ balance }: RewardBalanceCardProps) => {
  if (!balance) return null;

  const progress = balance.nextMilestone 
    ? Math.min((balance.currentPoints / balance.nextMilestone) * 100, 100) 
    : 100;

  return (
    <Card className="rounded-[2rem] overflow-hidden border-[#FFE2CC] shadow-xl relative bg-[#FFFFFF]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/10 via-transparent to-transparent opacity-50" />
      <div className="absolute right-0 top-0 h-64 w-64 bg-[#F59E0B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 flex-1 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF4EB] border border-[#FF6B00]/20 rounded-full">
              <Trophy className="h-5 w-5 text-[#FF6B00]" />
              <span className="font-bold text-[#FF6B00] text-sm uppercase tracking-widest">
                {balance.tier || 'Member'}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#6B7280] mb-1">Available Points</p>
              <div className="flex items-end gap-3">
                <h2 className="text-5xl font-black text-[#1F2937] tracking-tight">
                  {balance.currentPoints.toLocaleString()}
                </h2>
                {balance.monetaryValue && (
                  <span className="text-lg font-bold text-[#22C55E] mb-1">
                    ≈ ₹{balance.monetaryValue}
                  </span>
                )}
              </div>
            </div>

            {balance.nextMilestone && (
              <div className="pt-2 space-y-2 max-w-md">
                <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                  <span>Next Milestone</span>
                  <span>{balance.nextMilestone.toLocaleString()} pts</span>
                </div>
                <Progress value={progress} className="h-2 bg-[#FAF8F5] border border-[#FFE2CC]" indicatorClassName="bg-gradient-to-r from-[#FF6B00] to-[#F59E0B]" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 md:min-w-[240px]">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#FFE2CC]">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Star className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7280]">Total Earned</p>
                  <p className="font-black text-[#1F2937] text-lg">{balance.totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#FFE2CC]">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Coins className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7280]">Total Redeemed</p>
                  <p className="font-black text-[#1F2937] text-lg">{balance.totalRedeemed.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {balance.expiringPoints && balance.expiryDate && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <Calendar className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700 leading-snug">
                    {balance.expiringPoints} points expire on
                  </p>
                  <p className="text-xs text-red-600 font-medium">
                    {new Date(balance.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
