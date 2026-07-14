import { useCoupons } from '@/hooks/queries/useCoupons';
import { useAuthStore } from '@/store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CouponList } from '@/components/discount/CouponList';
import { CouponSkeleton } from '@/components/discount/CouponSkeleton';
import { EmptyCoupons } from '@/components/discount/EmptyCoupons';
import { AppliedCoupon } from '@/components/discount/AppliedCoupon';
import { Button } from '@/components/ui/button';
import { RefreshCw, Gift, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CouponsPage = () => {
 const navigate = useNavigate();
 const { isAuthenticated } = useAuthStore();
 const { data: coupons, isLoading, isError, refetch } = useCoupons();

 useEffect(() => {
 window.scrollTo(0, 0);
 }, []);

 if (!isAuthenticated) {
 navigate('/login', { replace: true });
 return null;
 }

 const renderContent = () => {
 if (isLoading) return <CouponSkeleton />;
 
 if (isError) {
 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="min-h-[45vh] flex flex-col items-center justify-center text-center p-8 border border-red-500/20 dark:border-red-500/10 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-lg gap-4"
 >
 <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
 <AlertCircle className="h-7 w-7" />
 </div>
 <div>
 <h2 className="text-xl font-black text-foreground">Couldn't load coupons</h2>
 <p className="text-muted-foreground text-sm mt-1">Something went wrong while fetching offers.</p>
 </div>
 <Button onClick={() => refetch()} className="rounded-full shadow-premium gap-2 px-6 h-11 font-black text-xs">
 <RefreshCw className="h-4 w-4" /> Try Again
 </Button>
 </motion.div>
 );
 }
 
 if (!coupons?.length) return <EmptyCoupons />;
 return <CouponList coupons={coupons} />;
 };

 return (
 <div className="bg-background min-h-screen py-10">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Main area */}
 <motion.div 
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="flex-1 min-w-0 space-y-6"
 >
 {/* Header banner */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 sm:p-8 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-border relative overflow-hidden">
 
 <div className="flex items-center gap-4 relative z-10">
 <div className="h-14 w-14 rounded-2xl bg-[#FFF3E8] text-primary flex items-center justify-center">
 <Gift className="h-7 w-7" />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-foreground">Offers & Coupons</h1>
 <p className="text-muted-foreground text-sm font-normal mt-1">
 {coupons?.length ? `${coupons.length} active discount coupon${coupons.length > 1 ? 's' : ''} available` : 'Browse exclusive discount codes'}
 </p>
 </div>
 </div>
 <Button 
 variant="outline" 
 className="rounded-full gap-2 px-5 h-10 bg-white border-primary text-primary hover:bg-primary hover:text-white transition-all hover:-translate-y-[1px] font-bold text-xs shadow-sm shrink-0"
 onClick={() => refetch()} 
 disabled={isLoading}
 >
 <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
 Refresh
 </Button>
 </div>

 {/* Applied coupon banner */}
 <AppliedCoupon />

 {/* Coupons grid */}
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
