import { useState } from 'react';
import { 
  Package, MapPinned, TicketPercent, Wallet, CreditCard, 
  HelpCircle, Info, LogOut, Bell, Globe, UserRound, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { LogoutDialog } from '@/components/auth/LogoutDialog';

interface ProfileMenuProps {
  onTabChange?: (tabId: string) => void;
  activeTab?: string;
}

export const ProfileMenu = ({ onTabChange, activeTab }: ProfileMenuProps) => {
  const { logout } = useAuthStore();
  const organization = useOrganizationStore((state) => state.organization);
  const profileConfig = organization?.theme?.config?.profile?.config;
  const showOrders = profileConfig?.showOrderHistory ?? true;
  const showAddresses = profileConfig?.showSavedAddresses ?? true;
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
  const menuItems = [
    { id: 'about', icon: UserRound, title: 'Profile Information', subtitle: 'View your account details' },
    showOrders ? { id: 'orders', icon: Package, title: 'Order History', subtitle: 'Track your recent orders' } : null,
    showAddresses ? { id: 'addresses', icon: MapPinned, title: 'Manage Addresses', subtitle: 'Add or edit delivery addresses' } : null,
    { id: 'offers', icon: TicketPercent, title: 'Offers & Coupons', subtitle: 'Available discounts and rewards' },
  ].filter(Boolean) as Array<{ id: string, icon: any, title: string, subtitle: string }>;

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col space-y-3 w-full">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 text-left group border border-transparent shadow-sm",
                isActive 
                  ? "bg-[#FFF4EB] border-orange-100 shadow-md" 
                  : "bg-white hover:bg-[#FFF4EB] hover:shadow-md hover:border-orange-100"
              )}
            >
              <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 transition-colors duration-300 bg-[#FFF4EB] text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-[16px] text-[#1F2937] leading-tight">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="text-[14px] font-normal text-[#6B7280] mt-0.5">
                    {item.subtitle}
                  </span>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#FF6B00] transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Sign Out Button */}
      <div className="mt-4 pt-4">
        <button 
          onClick={() => setIsLogoutOpen(true)}
          className="group flex items-center justify-center gap-2 w-full h-[54px] rounded-[16px] bg-white border border-[#FF6B00] text-[#FF6B00] font-bold text-[16px] transition-all duration-300 hover:bg-[#FF6B00] hover:text-white shadow-sm hover:shadow-md"
        >
          <LogOut className="w-5 h-5 group-hover:text-white transition-colors" />
          Sign Out
        </button>
      </div>

      <LogoutDialog 
        isOpen={isLogoutOpen} 
        onOpenChange={setIsLogoutOpen} 
        onConfirm={() => {
          logout();
          setIsLogoutOpen(false);
        }} 
      />
    </div>
  );
};
