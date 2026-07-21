import { ArrowDownRight, ArrowUpRight, AlertTriangle, Calendar, Package } from 'lucide-react';
import type { RewardTransaction } from '@/types/rewards.types';

interface TransactionHistoryProps {
  transactions?: RewardTransaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#FFE2CC] shadow-sm text-center">
        <p className="text-[#6B7280]">No reward transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#FFE2CC] shadow-sm">
      <div className="p-6 border-b border-[#FFE2CC] bg-[#FAF8F5]">
        <h3 className="text-lg font-bold text-[#1F2937]">Transaction History</h3>
      </div>
      <div className="divide-y divide-[#FFE2CC]">
        {transactions.map((tx) => (
          <div key={tx._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#FAF8F5]/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === 'EARNED' ? 'bg-emerald-100' :
                tx.type === 'REDEEMED' ? 'bg-amber-100' : 'bg-red-100'
              }`}>
                {tx.type === 'EARNED' && <ArrowUpRight className="h-5 w-5 text-emerald-600" />}
                {tx.type === 'REDEEMED' && <ArrowDownRight className="h-5 w-5 text-amber-600" />}
                {tx.type === 'EXPIRED' && <AlertTriangle className="h-5 w-5 text-red-600" />}
              </div>
              
              <div className="space-y-1">
                <p className="font-bold text-[#1F2937] leading-tight">{tx.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {tx.orderId && (
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5" />
                      <span>Order {tx.orderId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className={`text-right font-black text-lg ${
              tx.type === 'EARNED' ? 'text-emerald-600' :
              tx.type === 'REDEEMED' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {tx.type === 'EARNED' ? '+' : '-'}{tx.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
