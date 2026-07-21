import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Wallet, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CustomerProfile } from '@/types/customer.types';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useProfileStats } from '@/hooks/queries/useProfileStats';

interface ProfileHeaderProps {
  profile: CustomerProfile | null;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const organization = useOrganizationStore((state) => state.organization);
  const currency = organization?.currency || '₹';
  
  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError } = useProfileStats();

  const stats = [
    {
      label: 'Orders',
      value: statsData?.orders,
      prefix: '',
      icon: <Package className="w-6 h-6" />,
    },
    {
      label: 'Spent',
      value: statsData?.spent,
      prefix: currency,
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      label: 'Saved',
      value: statsData?.saved, 
      prefix: currency,
      icon: <Gift className="w-6 h-6" />,
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Top Profile Info */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm flex items-center gap-6 border border-orange-100">
        <div className="shrink-0">
          <Avatar className="h-[90px] w-[90px] md:h-[100px] md:w-[100px] shadow-sm">
            <AvatarImage src={profile?.avatar} alt={profile?.name || 'User'} className="object-cover" />
            <AvatarFallback className="bg-[#FFF4EB] text-[#FF6B00] font-black text-3xl md:text-4xl">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col space-y-1">
          <h1 className="text-[24px] font-bold tracking-tight text-[#1F2937] leading-tight">
            {profile?.name || 'Guest Customer'}
          </h1>
          <div className="flex flex-col text-[14px] font-normal text-[#6B7280] mt-1 gap-1">
            <span>+91 {profile?.phone || 'Not provided'}</span>
            <span>{profile?.email || `${profile?.name?.toLowerCase().replace(/\s/g, '') || 'user'}@gmail.com`}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - 3 columns */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="group flex flex-col items-center justify-center bg-white rounded-2xl p-6 shadow-sm border border-orange-100 transition-all duration-300 hover:bg-[#FFF4EB] hover:shadow-lg text-center"
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#FFF4EB] flex items-center justify-center mb-3 group-hover:bg-[#FF6B00] transition-colors duration-300 text-[#FF6B00] group-hover:text-white">
              {stat.icon}
            </div>
            
            {isStatsLoading ? (
              <Skeleton className="h-6 w-16 mb-1 bg-orange-100" />
            ) : (
              <span className="text-[22px] font-bold text-[#1F2937] leading-none mb-1">
                {isStatsError || stat.value === undefined ? '--' : `${stat.prefix}${stat.value.toLocaleString()}`}
              </span>
            )}

            <span className="text-[14px] font-normal text-[#6B7280]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
