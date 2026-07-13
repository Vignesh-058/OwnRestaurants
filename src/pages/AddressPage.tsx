import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { useAddresses } from '@/hooks/queries/useAddresses';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { AddressList } from '@/components/address/AddressList';
import { AddressDialog } from '@/components/address/AddressDialog';
import { EmptyAddress } from '@/components/address/EmptyAddress';
import { AddressSkeleton } from '@/components/address/AddressSkeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AddressPage = () => {
 const navigate = useNavigate();
 const { isAuthenticated } = useAuthStore();
 const { data: addresses, isLoading, isError, refetch } = useAddresses();

 useEffect(() => {
 window.scrollTo(0, 0);
 }, []);

 if (!isAuthenticated) {
 navigate('/login', { replace: true });
 return null;
 }

 const renderContent = () => {
 if (isLoading) return <AddressSkeleton />;

 if (isError) {
 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="min-h-[45vh] flex flex-col items-center justify-center p-8 border border-red-500/20 dark:border-red-500/10 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-lg gap-4"
 >
 <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
 <AlertCircle className="h-7 w-7" />
 </div>
 <div>
 <h2 className="text-xl font-black text-foreground">Oops! Something went wrong</h2>
 <p className="text-muted-foreground text-sm mt-1">We couldn't load your delivery addresses.</p>
 </div>
 <Button onClick={() => refetch()} className="rounded-full shadow-premium gap-2 px-6 h-11 font-black text-xs">
 <RefreshCw className="w-4 h-4" />
 Try Again
 </Button>
 </motion.div>
 );
 }

 if (!addresses || addresses.length === 0) {
 return <EmptyAddress onAddAddress={() => document.getElementById('add-address-trigger')?.click()} />;
 }

 return <AddressList addresses={addresses} />;
 };

 return (
 <div className="bg-background min-h-screen py-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Left Sidebar (Desktop Menu) */}
 <div className="hidden lg:block w-[320px] shrink-0 sticky top-28 h-fit space-y-6">
 <div className="px-2 mb-2">
 <h2 className="text-2xl font-black text-foreground tracking-tight">My Account</h2>
 </div>
 <ProfileMenu />
 </div>

 {/* Main Content Area */}
 <motion.div 
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="flex-1 min-w-0 flex flex-col space-y-6"
 >
 {/* Header banner */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-border/80 dark:border-white/10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
 
 <div className="flex items-center gap-4 relative z-10">
 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-[#FF6B00]/20 text-primary flex items-center justify-center shadow-inner">
 <MapPin className="h-7 w-7" />
 </div>
 <div>
 <h1 className="text-2xl font-black tracking-tight text-foreground">Manage Addresses</h1>
 <p className="text-muted-foreground text-xs font-semibold mt-1">
 Manage your delivery addresses and presets
 </p>
 </div>
 </div>
 
 <div id="add-address-trigger-container" className="relative z-10 shrink-0">
 <AddressDialog />
 </div>
 </div>
 
 <div className="lg:hidden">
 <h2 className="text-xl font-black text-foreground mb-4 px-2">Account Menu</h2>
 <ProfileMenu />
 </div>

 <div className="relative">
 <AnimatePresence mode="wait">
 {renderContent()}
 </AnimatePresence>
 </div>
 </motion.div>
 </div>

 </div>
 </div>
 );
};
