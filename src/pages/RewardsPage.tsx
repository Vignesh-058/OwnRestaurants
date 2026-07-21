import { useRewards } from '@/hooks/queries/useRewards';
import { useAuthStore } from '@/store/AuthStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RewardBalanceCard } from '@/components/rewards/RewardBalanceCard';
import { TransactionHistory } from '@/components/rewards/TransactionHistory';
import { RewardRulesPanel } from '@/components/rewards/RewardRulesPanel';
import { useSettings } from '@/hooks/queries/useSettings';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RewardsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const { data: settings } = useSettings(organization?._id || '', selectedOutlet?._id || '');
  const { balance, transactions, rules, isLoading, isError, refetch } = useRewards();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Feature Flag gating
  if (settings && settings.checkOutSettings.showRewards === false) {
    return <Navigate to="/profile" replace />;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-[2rem]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[300px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      );
    }
    
    if (isError) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[45vh] flex flex-col items-center justify-center text-center p-8 border border-red-500/20 rounded-[2rem] bg-white/70 shadow-lg gap-4"
        >
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground">Couldn't load rewards</h2>
            <p className="text-muted-foreground text-sm mt-1">Unable to load your rewards right now. Please try again.</p>
          </div>
          <Button onClick={() => refetch()} className="rounded-full shadow-premium gap-2 px-6 h-11 font-black text-xs">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </motion.div>
      );
    }

    // Replace rule values with settings values if needed
    const effectiveRules = {
      ...rules!,
      minOrderAmountToEarn: settings?.checkOutSettings.loyaltyMinimumAmount ?? rules?.minOrderAmountToEarn ?? 0,
    };
    
    return (
      <div className="space-y-6">
        <RewardBalanceCard balance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionHistory transactions={transactions} />
          </div>
          
          <div className="lg:col-span-1">
            <RewardRulesPanel rules={effectiveRules} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 min-w-0 space-y-6"
        >
          {/* Header banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 sm:p-8 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-border relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                <Gift className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Rewards & Loyalty</h1>
                <p className="text-muted-foreground text-sm font-normal mt-1">
                  View and manage your loyalty points.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full gap-2 px-5 h-10 bg-card border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all hover:-translate-y-[1px] font-bold text-xs shadow-sm shrink-0"
              onClick={() => refetch()} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
