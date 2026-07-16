import { useState } from 'react';
import { 
  Package, MapPin, Ticket, Wallet, CreditCard, 
  HelpCircle, Info, LogOut, Bell, Globe
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
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const menuItems = [
    { id: 'offers', icon: Ticket, title: 'Offers & Coupons' },
    showOrders ? { id: 'orders', icon: Package, title: 'Orders' } : null,
    showAddresses ? { id: 'addresses', icon: MapPin, title: 'Addresses' } : null,
    { id: 'rewards', icon: Wallet, title: 'Rewards' },
    { id: 'payments', icon: CreditCard, title: 'Payments' },
    { id: 'help', icon: HelpCircle, title: 'Help' },
    { id: 'about', icon: Info, title: 'About' },
  ].filter(Boolean) as Array<{ id: string, icon: any, title: string }>;

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
                  ? "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5" 
                  : "bg-card text-foreground shadow-sm hover:bg-primary/10 hover:-translate-y-0.5"
              )}
            >
              <item.icon 
                className={cn(
                  "w-[22px] h-[22px] transition-colors", 
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
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
      <div className="bg-card rounded-[20px] p-5 shadow-sm border border-border">
        <h4 className="font-bold text-[16px] text-foreground mb-4">Settings</h4>
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="font-medium text-[15px] text-foreground">Notifications</span>
            </div>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="font-medium text-[15px] text-foreground">Language</span>
            </div>
            <button onClick={handleLanguageChange} className="text-primary font-bold text-[14px]">
              {language}
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-auto pt-4">
        <button 
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center justify-center gap-3 w-full h-[60px] rounded-[16px] bg-card border border-destructive/20 text-destructive font-bold text-[16px] transition-all duration-200 hover:bg-destructive/10 hover:-translate-y-0.5 shadow-sm"
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
