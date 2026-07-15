import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, MapPin, CreditCard, Sparkles } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { motion } from 'framer-motion';
import type { CustomerProfile } from '@/types/customer.types';

// Animated Count-Up component
const AnimatedCounter = ({ value, prefix = '', duration = 1000 }: { value: number; prefix?: string; duration?: number }) => {
 const [count, setCount] = useState(0);

 useEffect(() => {
 if (value <= 0) {
 setCount(0);
 return;
 }
 let startTime: number | null = null;
 const animate = (timestamp: number) => {
 if (!startTime) startTime = timestamp;
 const progress = Math.min((timestamp - startTime) / duration, 1);
 setCount(Math.floor(progress * value));
 if (progress < 1) {
 requestAnimationFrame(animate);
 }
 };
 requestAnimationFrame(animate);
 }, [value, duration]);

 return <>{prefix}{count.toLocaleString()}</>;
};

interface ProfileStatsProps {
  profile: CustomerProfile | null;
  showTotalSpent?: boolean;
  showTotalOrder?: boolean;
}

import { useOrders } from '@/hooks/queries/useOrders';
import { useAddresses } from '@/hooks/queries/useAddresses';

export const ProfileStats = ({ profile, showTotalSpent = true, showTotalOrder = true }: ProfileStatsProps) => {
  const { data: ordersData } = useOrders(1);
  const { data: addresses } = useAddresses();
  
  const liveOrdersCount = ordersData?.totalOrders || 0;
  const liveAddressesCount = addresses?.length || 0;

  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');

  // Dynamically compute mock rewards points based on spending
  const rewardPoints = Math.floor((profile?.totalSpent || 0) * 0.1);

  const allStats = [
  {
  title: 'Total Orders',
  value: liveOrdersCount,
  prefix: '',
  icon: Package,
  gradient: 'from-[#FF6B00]/10 to-[#E85D00]/10',
  iconColor: 'text-[#FF6B00]',
  show: showTotalOrder,
  },
  {
  title: 'Amount Spent',
  value: Math.floor(profile?.totalSpent || 0),
  prefix: currency,
  icon: CreditCard,
  gradient: 'from-emerald-500/10 to-teal-500/10',
  iconColor: 'text-emerald-500',
  show: showTotalSpent,
  },
  {
  title: 'Saved Addresses',
  value: liveAddressesCount,
  prefix: '',
  icon: MapPin,
  gradient: 'from-purple-500/10 to-pink-500/10',
  iconColor: 'text-purple-500',
  show: true,
  },
  {
  title: 'Reward Points',
  value: rewardPoints,
  prefix: '⭐ ',
  icon: Sparkles,
  gradient: 'from-amber-500/10 to-orange-500/10',
  iconColor: 'text-amber-500',
  show: false,
  }
  ];

  const stats = allStats.filter(s => s.show);

  if (stats.length === 0) return null;

  return (
  <motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  >
  <Card className="rounded-[2rem] border border-border/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden">
  <CardContent className="p-8">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y-2 sm:divide-y-0 sm:gap-8 divide-border/20 lg:divide-x lg:divide-border/40">
  {stats.map((stat, i) => (
  <div 
  key={i} 
  className={`pt-6 sm:pt-0 sm:px-4 flex flex-col items-center text-center group transition-all duration-300 first:pt-0`}
  >
  {/* Statistics Icon */}
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} ${stat.iconColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
  <stat.icon className="w-5.5 h-5.5" />
  </div>
  
  {/* Stats Counter */}
  <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-1 tracking-tight">
  <AnimatedCounter value={stat.value} prefix={stat.prefix} />
  </h3>
  
  {/* Subtitle */}
  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
  {stat.title}
  </p>
  </div>
  ))}
  </div>
  </CardContent>
  </Card>
  </motion.div>
  );
};
