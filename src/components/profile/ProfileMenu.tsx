import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
 MapPin, Package, Ticket, HelpCircle, 
 LogOut, ChevronRight, Heart, Wallet, CreditCard, 
 Info, Bell, Globe
} from 'lucide-react';
import { LogoutDialog } from '@/components/auth/LogoutDialog';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';

export const ProfileMenu = () => {
 const { logout } = useAuthStore();
 const location = useLocation();
 
 const [isLogoutOpen, setIsLogoutOpen] = useState(false);
 const [notificationsEnabled, setNotificationsEnabled] = useState(true);
 const [language, setLanguage] = useState('English');

 const quickActions = [
 { 
 icon: Package, 
 title: 'My Orders', 
 subtitle: 'Track and view past orders', 
 href: '/profile/orders',
 gradient: 'from-blue-500 to-indigo-500'
 },
 { 
 icon: MapPin, 
 title: 'Saved Addresses', 
 subtitle: 'Manage delivery locations', 
 href: '/profile/addresses',
 gradient: 'from-emerald-500 to-teal-500'
 },
 { 
 icon: Heart, 
 title: 'Favorites', 
 subtitle: 'Browse your wishlist items', 
 href: '/wishlist',
 gradient: 'from-pink-500 to-rose-500'
 },
 { 
 icon: Ticket, 
 title: 'Offers & Coupons', 
 subtitle: 'View active promo discounts', 
 href: '/offers',
 gradient: 'from-amber-500 to-orange-500'
 },
 { 
 icon: Wallet, 
 title: 'Rewards & Wallet', 
 subtitle: 'Check points and credits', 
 href: '/profile',
 gradient: 'from-purple-500 to-indigo-500'
 },
 { 
 icon: CreditCard, 
 title: 'Payment Methods', 
 subtitle: 'Manage cards and UPI profiles', 
 href: '/profile',
 gradient: 'from-violet-500 to-fuchsia-500'
 },
 { 
 icon: HelpCircle, 
 title: 'Help & Support', 
 subtitle: 'Connect with order assistance', 
 href: '/support',
 gradient: 'from-sky-500 to-blue-500'
 },
 { 
 icon: Info, 
 title: 'About', 
 subtitle: 'Platform version and terms', 
 href: '/profile',
 gradient: 'from-slate-500 to-slate-700'
 }
 ];

 const handleToggleNotifications = () => {
 setNotificationsEnabled(!notificationsEnabled);
 toast.success(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
 };

 const handleLanguageChange = () => {
 const nextLang = language === 'English' ? 'Español' : 'English';
 setLanguage(nextLang);
 toast.success(`Language set to ${nextLang}`);
 };

 return (
 <div className="space-y-6 w-full">
 {/* 1. Quick Action Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
 {quickActions.map((action, i) => {
 const isActive = location.pathname === action.href;
 return (
 <NavLink 
 key={i} 
 to={action.href}
 end={action.href === '/profile'}
 className={`
 flex items-center w-full p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-2xl border transition-all duration-300 group shadow-sm hover:shadow-md
 ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border/60 dark:border-white/5 hover:border-primary/20'}
 `}
 >
 {/* Gradient Icon container */}
 <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${action.gradient} text-white flex items-center justify-center shrink-0 mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
 <action.icon className="h-5.5 w-5.5" />
 </div>
 
 <div className="flex-1 text-left min-w-0">
 <h4 className="font-extrabold text-sm text-foreground leading-tight truncate">{action.title}</h4>
 <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 truncate leading-none">{action.subtitle}</p>
 </div>

 <ChevronRight className={`h-4.5 w-4.5 transition-all text-muted-foreground group-hover:text-primary group-hover:translate-x-1 shrink-0 ${isActive ? 'text-primary' : ''}`} />
 </NavLink>
 );
 })}
 </div>

 {/* 2. Grouped Settings Section */}
 <Card className="rounded-[1.8rem] border border-border/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-sm">
 <CardContent className="p-5 space-y-4">
 <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Settings & Preferences</h3>
 
 <div className="space-y-2">

 {/* Notifications Toggle */}
 <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 transition-colors">
 <div className="flex items-center gap-3">
 <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
 <Bell className="h-4.5 w-4.5" />
 </div>
 <Label className="text-xs font-extrabold text-foreground">Notifications</Label>
 </div>
 <button 
 onClick={handleToggleNotifications}
 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notificationsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
 >
 <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-5.5' : 'translate-x-1'}`} />
 </button>
 </div>

 {/* Language Selector */}
 <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 transition-colors">
 <div className="flex items-center gap-3">
 <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
 <Globe className="h-4.5 w-4.5" />
 </div>
 <Label className="text-xs font-extrabold text-foreground">Language</Label>
 </div>
 <button 
 onClick={handleLanguageChange}
 className="text-xs font-black text-primary hover:underline bg-muted px-2.5 py-1 rounded-full"
 >
 {language}
 </button>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* 3. Danger Zone Sign Out Button */}
 <div className="pt-2">
 <button 
 onClick={() => setIsLogoutOpen(true)}
 className="w-full h-12 bg-transparent border border-red-500/35 hover:bg-red-500/5 text-red-500 hover:text-red-600 rounded-2xl flex items-center justify-center gap-2 transition-all font-extrabold text-xs shadow-sm"
 >
 <LogOut className="h-4.5 w-4.5" />
 Sign Out of Account
 </button>
 </div>

 <LogoutDialog 
 isOpen={isLogoutOpen} 
 onOpenChange={setIsLogoutOpen} 
 onConfirm={() => {
 setIsLogoutOpen(false);
 logout();
 }} 
 />
 </div>
 );
};
