import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Package, MapPin, Ticket, Heart, Wallet, CreditCard, 
  HelpCircle, Info, LogOut, Bell, Globe, Moon
} from 'lucide-react';
import { useAuthStore } from '@/store/AuthStore';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { LogoutDialog } from '@/components/auth/LogoutDialog';

interface ProfileMenuProps {
  onTabChange?: (tabId: string) => void;
  activeTab?: string;
}

export const ProfileMenu = ({ onTabChange, activeTab }: ProfileMenuProps) => {
  const { logout } = useAuthStore();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const menuItems = [
    { id: 'offers', icon: Ticket, title: 'Offers & Coupons' },
    { id: 'orders', icon: Package, title: 'Orders' },
    { id: 'addresses', icon: MapPin, title: 'Addresses' },
    { id: 'favorites', icon: Heart, title: 'Wishlist' },
    { id: 'rewards', icon: Wallet, title: 'Rewards' },
    { id: 'payments', icon: CreditCard, title: 'Payments' },
    { id: 'help', icon: HelpCircle, title: 'Help' },
    { id: 'about', icon: Info, title: 'About' },
  ];

  const handleLanguageChange = () => {
    setLanguage(prev => prev === 'English' ? 'Español' : 'English');
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Navigation Cards */}
      <div className="flex flex-col space-y-3">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "flex items-center gap-4 w-full h-[60px] px-5 rounded-[16px] transition-all duration-200 text-left group",
                isActive 
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-[0_4px_16px_rgba(255,107,0,0.3)] hover:-translate-y-0.5" 
                  : "bg-white text-[#101828] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-[#FFF7ED] hover:-translate-y-0.5"
              )}
            >
              <item.icon 
                className={cn(
                  "w-[22px] h-[22px] transition-colors", 
                  isActive ? "text-white" : "text-[#667085] group-hover:text-[#FF6B00]"
                )} 
              />
              <span className="font-bold text-[16px]">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E4E7EC]">
        <h4 className="font-bold text-[16px] text-[#101828] mb-4">Settings</h4>
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-[18px] h-[18px] text-[#667085]" />
              <span className="font-medium text-[15px] text-[#101828]">Notifications</span>
            </div>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-[18px] h-[18px] text-[#667085]" />
              <span className="font-medium text-[15px] text-[#101828]">Language</span>
            </div>
            <button onClick={handleLanguageChange} className="text-[#FF6B00] font-bold text-[14px]">
              {language}
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-auto pt-4">
        <button 
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center justify-center gap-3 w-full h-[60px] rounded-[16px] bg-white border border-red-100 text-red-500 font-bold text-[16px] transition-all duration-200 hover:bg-red-50 hover:-translate-y-0.5 shadow-sm"
        >
          <LogOut className="w-[20px] h-[20px]" />
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
