import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CalendarDays, Award, Package, Wallet, Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CustomerProfile } from '@/types/customer.types';
import { useOrganizationStore } from '@/store/OrganizationStore';

interface ProfileHeaderProps {
  profile: CustomerProfile | null;
}

import { useOrders } from '@/hooks/queries/useOrders';
import { useAddresses } from '@/hooks/queries/useAddresses';

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { data: ordersData } = useOrders(1);
  const { data: addresses } = useAddresses();
  
  const liveOrdersCount = ordersData?.totalOrders || 0;
  const liveAddressesCount = addresses?.length || 0;

  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');

  const joinDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const ordersCount = liveOrdersCount;
  const { tier, badgeColor } = (() => {
    if (ordersCount > 15) {
      return { 
        tier: 'Platinum Member', 
        badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200' 
      };
    }
    if (ordersCount > 5) {
      return { 
        tier: 'Gold Member', 
        badgeColor: 'bg-amber-50 text-amber-600 border-amber-200' 
      };
    }
    return { 
      tier: 'Silver Member', 
      badgeColor: 'bg-slate-50 text-slate-600 border-slate-200' 
    };
  })();

  const rewardPoints = Math.floor((profile?.totalSpent || 0) * 0.1);

  const stats = [
    {
      label: 'Orders',
      value: ordersCount,
      icon: Package,
      iconColor: 'text-[#FF6B00]',
      bgColor: 'bg-[#FF6B00]/10',
    },
    {
      label: 'Wallet',
      value: rewardPoints,
      prefix: '⭐',
      icon: Wallet,
      iconColor: 'text-[#FF6B00]',
      bgColor: 'bg-[#FF6B00]/10',
    },
    {
      label: 'Favorites',
      value: liveAddressesCount, // Using as mock for favorites if actual count isn't available
      icon: Heart,
      iconColor: 'text-[#FF6B00]',
      bgColor: 'bg-[#FF6B00]/10',
    },
    {
      label: 'Addresses',
      value: liveAddressesCount,
      icon: MapPin,
      iconColor: 'text-[#FF6B00]',
      bgColor: 'bg-[#FF6B00]/10',
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 justify-between">
        
        {/* Left Side: Profile Info */}
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <Avatar className="h-[100px] w-[100px] border-[4px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-white group-hover:scale-105 transition-transform duration-300">
              <AvatarImage src={profile?.avatar} alt={profile?.name || 'User'} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#FF6B00] to-[#E85D00] text-white font-black text-3xl">
                {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-white border border-gray-100 p-1.5 rounded-full shadow-md">
              <Award className="h-4 w-4 text-[#FF6B00]" />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-[28px] font-bold tracking-tight text-[#101828] leading-none">
                {profile?.name || 'Guest Customer'}
              </h1>
              <Badge variant="outline" className={`font-bold rounded-[8px] px-2.5 py-0.5 text-[11px] uppercase border shadow-sm ${badgeColor}`}>
                {tier}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-[14px] font-medium text-[#667085]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <span>+91 {profile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#FF6B00]" />
                <span>Since {joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Stat Cards */}
        <div className="flex flex-wrap lg:flex-nowrap gap-4 shrink-0">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E4E7EC] min-w-[150px] flex-1 lg:flex-none transition-transform hover:-translate-y-1 duration-200"
            >
              <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[22px] font-bold text-[#101828] leading-none mb-1">
                  {stat.prefix}{stat.value.toLocaleString()}
                </span>
                <span className="text-[13px] font-medium text-[#667085]">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};
