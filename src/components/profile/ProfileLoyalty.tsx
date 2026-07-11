import { Card, CardContent } from '@/components/ui/card';
import { Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CustomerProfile } from '@/types/customer.types';

interface ProfileLoyaltyProps {
 profile: CustomerProfile | null;
}

export const ProfileLoyalty = ({ profile }: ProfileLoyaltyProps) => {
 const ordersCount = profile?.ordersCount || 0;
 const rewardPoints = Math.floor((profile?.totalSpent || 0) * 0.1);

 // Compute membership levels & targets
 const { currentTier, nextTier, targetPoints, progress, colorGradient } = (() => {
 if (ordersCount > 15) {
 return {
 currentTier: 'Platinum Elite',
 nextTier: 'Max Tier Reached',
 targetPoints: rewardPoints,
 progress: 100,
 colorGradient: 'from-indigo-600 to-pink-500'
 };
 }
 if (ordersCount > 5) {
 const nextTierPoints = 1500;
 const progressPercent = Math.min((rewardPoints / nextTierPoints) * 100, 95);
 return {
 currentTier: 'Gold Club',
 nextTier: 'Platinum Elite',
 targetPoints: nextTierPoints,
 progress: progressPercent,
 colorGradient: 'from-amber-500 to-orange-500'
 };
 }
 const nextTierPoints = 500;
 const progressPercent = Math.min((rewardPoints / nextTierPoints) * 100, 95);
 return {
 currentTier: 'Silver Member',
 nextTier: 'Gold Club',
 targetPoints: nextTierPoints,
 progress: progressPercent,
 colorGradient: 'from-slate-400 to-zinc-600'
 };
 })();

 return (
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 >
 <Card className="rounded-[2rem] border border-border/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden relative">
 
 {/* Abstract design elements */}
 <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
 
 <CardContent className="p-8">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 
 {/* Left side info */}
 <div className="space-y-4 flex-1 w-full">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
 <Award className="h-5.5 w-5.5 text-primary" />
 </div>
 <div>
 <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Loyalty Club</h4>
 <span className="text-[18px] font-semibold text-foreground block mt-1.5">{currentTier} status</span>
 </div>
 </div>

 {/* Progress bar */}
 <div className="space-y-2">
 <div className="flex justify-between text-sm font-medium text-slate-300">
 <span>Progress to {nextTier}</span>
 <span>{Math.round(progress)}%</span>
 </div>
 <div className="h-3 w-full bg-muted dark:bg-white/5 rounded-full overflow-hidden border border-border/40 dark:border-white/5 relative p-0.5">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${progress}%` }}
 transition={{ duration: 1.2, ease: 'easeOut' }}
 className={`h-full bg-gradient-to-r ${colorGradient} rounded-full`}
 />
 </div>
 </div>
 </div>

 {/* Right side balance */}
 <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-[1.5rem] p-6 shadow-lg border border-slate-800 flex flex-col items-center justify-center shrink-0 min-w-[200px] w-full md:w-auto relative overflow-hidden">
 <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
 <Star className="h-6 w-6 text-amber-400 fill-current animate-pulse mb-2" />
 <span className="text-2xl font-black tracking-tight">{rewardPoints}</span>
 <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Available Points</span>
 {ordersCount <= 15 && (
 <span className="text-[11px] text-slate-400 font-medium mt-3 block text-center max-w-[160px]">
 Spend {targetPoints - rewardPoints} more points for next tier
 </span>
 )}
 </div>

 </div>
 </CardContent>
 </Card>
 </motion.div>
 );
};
