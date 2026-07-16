import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { AddressPreview } from '@/components/profile/AddressPreview';
import { RecentOrders } from '@/components/profile/RecentOrders';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyOffers = () => (
  <div className="bg-card rounded-[24px] shadow-sm border border-border p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
      <Gift className="w-12 h-12 text-primary" />
    </div>
    <h3 className="text-[24px] font-bold text-foreground mb-2">No Offers Available</h3>
    <p className="text-muted-foreground text-[15px] max-w-[300px] mb-8 leading-relaxed">
      There are currently no active coupons or offers for your account. Check back later!
    </p>
    <Button 
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-[48px] px-8 rounded-full shadow-sm hover:shadow-md transition-all"
      onClick={() => window.location.href = '/products'}
    >
      Browse Products
    </Button>
  </div>
);

const PremiumCardWrapper = ({ children, title, subtitle }: { children: React.ReactNode, title?: string, subtitle?: string }) => (
  <div className="bg-card rounded-[24px] shadow-sm border border-border p-6 lg:p-8">
    {(title || subtitle) && (
      <div className="mb-6 pb-6 border-b border-border">
        {title && <h2 className="text-[22px] font-bold text-foreground leading-tight">{title}</h2>}
        {subtitle && <p className="text-[14px] text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('offers');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[24px] font-bold text-foreground">Offers & Coupons</h2>
                <p className="text-muted-foreground text-[14px]">View and apply your available discounts.</p>
              </div>
              <Button variant="outline" className="h-10 rounded-full bg-card border-border text-foreground font-bold">
                Refresh
              </Button>
            </div>
            <EmptyOffers />
          </div>
        );
      case 'orders':
        return (
          <PremiumCardWrapper title="My Orders" subtitle="Track and view your past orders">
            <RecentOrders />
          </PremiumCardWrapper>
        );
      case 'addresses':
        return (
          <PremiumCardWrapper title="Saved Addresses" subtitle="Manage your delivery locations">
            <AddressPreview />
          </PremiumCardWrapper>
        );
      case 'about':
        return (
          <PremiumCardWrapper title="Personal Information" subtitle="Manage your profile details">
            <ProfileInfo profile={user || null} />
          </PremiumCardWrapper>
        );
      default:
        return (
          <div className="bg-card rounded-[24px] shadow-sm border border-border p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
            <h3 className="text-[20px] font-bold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground text-[15px]">This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[40px] flex flex-col space-y-[32px]">
        
        {/* Profile Header (Top) */}
        <ProfileHeader profile={user || null} />
        
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-[32px] items-start">
          
          {/* Left Sidebar Menu */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-28">
            <ProfileMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
          
        </div>

      </div>
    </div>
  );
};
