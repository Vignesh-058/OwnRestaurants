import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Package, 
 MapPin, 
 Ticket, 
 Settings, 
 HelpCircle, 
 LogOut, 
 ChevronRight,
 User as UserIcon,
 Sparkles
} from 'lucide-react';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { LogoutDialog } from '@/components/auth/LogoutDialog';

export const AccountPanel = () => {
 const { user, logout } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);
 const currency = organization?.currency || '₹';
 const [isLogoutOpen, setIsLogoutOpen] = useState(false);

 // Dynamically compute stats from user details
 const ordersCount = user?.ordersCount || 0;
 const spentAmount = Math.floor(user?.totalSpent || 0);
 const savedAddressesCount = user?.savedAddressesCount || 0;

 const menuItems = [
 {
 icon: UserIcon,
 title: 'Profile Information',
 subtitle: 'View your account details',
 href: '/profile',
 gradient: 'from-primary to-primary',
 },
 {
 icon: Package,
 title: 'Order History',
 subtitle: 'View and track previous purchases',
 href: '/profile/orders',
 gradient: 'from-primary to-primary',
 },
 {
 icon: MapPin,
 title: 'Manage Addresses',
 subtitle: 'Add or edit delivery addresses',
 href: '/profile/addresses',
 gradient: 'from-emerald-500 to-teal-500',
 },
 {
 icon: Ticket,
 title: 'Offers & Coupons',
 subtitle: 'Available discounts and rewards',
 href: '/offers',
 gradient: 'from-amber-500 to-orange-500',
 },
 {
 icon: Settings,
 title: 'Settings',
 subtitle: 'Account preferences',
 href: '/profile',
 gradient: 'from-purple-500 to-indigo-500',
 },
 {
 icon: HelpCircle,
 title: 'Help & Support',
 subtitle: 'FAQs and support tickets',
 href: '/support',
 gradient: 'from-slate-500 to-slate-700',
 },
 ];

 return (
 <>
 <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="h-[48px] w-[48px] border-2 border-[rgba(255,255,255,0.05)] bg-foreground cursor-pointer hover:border-primary transition-all duration-300 shadow-sm overflow-hidden">
        <AvatarImage src={user?.avatar} alt={user?.name || 'User'} className="object-cover" />
        <AvatarFallback className="bg-transparent text-muted-foreground font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
 
 <DropdownMenuContent 
 align="end" 
 className="w-[340px] sm:w-[380px] p-0 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-foreground shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-2.5 overflow-hidden"
 >
 <AnimatePresence>
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.25 }}
 >
 {/* User Header */}
 <DropdownMenuLabel className="p-6 flex items-center gap-5 relative overflow-hidden bg-transparent">
 <div className="absolute top-1/2 left-6 w-24 h-24 bg-primary/25 rounded-full blur-[35px] pointer-events-none -translate-y-1/2" />
 
 <Avatar className="h-[70px] w-[70px] border-[3px] border-[rgba(255,255,255,0.1)] shadow-md z-10">
 <AvatarImage src={user?.avatar} alt={user?.name || 'User'} className="object-cover" />
 <AvatarFallback className="bg-gradient-to-br from-primary to-primary text-white font-black text-2xl">
 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
 </AvatarFallback>
 </Avatar>
 
 <div className="flex flex-col space-y-1 relative z-10">
 <p className="text-[13px] font-medium text-border">Welcome Back 👋</p>
 <div className="flex items-center gap-2">
 <p className="text-[18px] font-bold leading-tight text-[#FFFFFF]">{user?.name || 'Guest User'}</p>
 {ordersCount > 10 && (
 <span className="text-[10px] bg-primary/15 text-primary border border-primary/30 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
 <Sparkles className="h-2.5 w-2.5" /> Elite
 </span>
 )}
 </div>
 <p className="text-[14px] font-medium text-[#FFFFFF] mt-0.5">+91 {user?.phone || 'No Phone'}</p>
 {user?.email && <p className="text-[12px] font-normal text-muted-foreground truncate max-w-[200px] mt-0.5">{user.email}</p>}
 </div>
 </DropdownMenuLabel>
 
 <Separator className="bg-[rgba(255,255,255,0.08)] mx-5 w-auto" />
 
 {/* Stats capsule row */}
 <div className="p-5 grid grid-cols-3 gap-3 relative z-10">
 <Card className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-foreground hover:-translate-y-1 hover:border-primary/40 transition-all duration-250 shadow-sm cursor-pointer group">
 <CardContent className="p-3.5 flex flex-col items-center justify-center text-center h-full">
 <span className="text-[22px] mb-1.5 leading-none group-hover:scale-110 transition-transform duration-250">📦</span>
 <span className="font-bold text-[15px] text-[#FFFFFF]">{ordersCount}</span>
 <span className="text-[11px] font-medium text-border mt-0.5 tracking-wide">Orders</span>
 </CardContent>
 </Card>
 <Card className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-foreground hover:-translate-y-1 hover:border-primary/40 transition-all duration-250 shadow-sm cursor-pointer group">
 <CardContent className="p-3.5 flex flex-col items-center justify-center text-center h-full">
 <span className="text-[22px] mb-1.5 leading-none group-hover:scale-110 transition-transform duration-250">💰</span>
 <span className="font-bold text-[15px] text-[#FFFFFF] truncate max-w-full">
 {currency}{spentAmount}
 </span>
 <span className="text-[11px] font-medium text-border mt-0.5 tracking-wide">Spent</span>
 </CardContent>
 </Card>
 <Card className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-foreground hover:-translate-y-1 hover:border-primary/40 transition-all duration-250 shadow-sm cursor-pointer group">
 <CardContent className="p-3.5 flex flex-col items-center justify-center text-center h-full">
 <span className="text-[22px] mb-1.5 leading-none group-hover:scale-110 transition-transform duration-250">📍</span>
 <span className="font-bold text-[15px] text-[#FFFFFF]">{savedAddressesCount}</span>
 <span className="text-[11px] font-medium text-border mt-0.5 tracking-wide">Saved</span>
 </CardContent>
 </Card>
 </div>
 
 <Separator className="bg-[rgba(255,255,255,0.08)] mx-5 w-auto" />
 
 {/* Account Menu */}
 <div className="px-3 py-4 max-h-[320px] overflow-y-auto scrollbar-none space-y-2 relative z-10">
 {menuItems.map((item, index) => (
 <DropdownMenuItem key={index} asChild className="p-0 focus:bg-transparent cursor-pointer">
 <Link 
 to={item.href}
 className="flex items-center w-full h-[70px] px-4 rounded-[16px] hover:bg-muted-foreground hover:translate-x-1 transition-all duration-250 group"
 >
 <div className={`h-[42px] w-[42px] rounded-[12px] bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-250 shrink-0 shadow-sm`}>
 <item.icon className="h-5 w-5" />
 </div>
 <div className="flex-1 flex flex-col text-left justify-center">
 <span className="text-[15px] font-[600] text-[#FFFFFF] transition-colors">{item.title}</span>
 <span className="text-[13px] text-muted-foreground mt-0.5 leading-none">{item.subtitle}</span>
 </div>
 <ChevronRight className="h-5 w-5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-[#FFFFFF] transition-all duration-250" />
 </Link>
 </DropdownMenuItem>
 ))}
 </div>
 
 <Separator className="bg-[rgba(255,255,255,0.08)] mx-5 w-auto mb-2" />
 
 {/* Sign Out Trigger */}
 <div className="px-5 pb-5 pt-1 relative z-10">
 <DropdownMenuItem 
 onSelect={(e) => {
 e.preventDefault();
 setIsLogoutOpen(true);
 }}
 className="flex items-center w-full h-[52px] rounded-[14px] text-[#FFFFFF] border border-primary hover:bg-primary hover:text-[#FFFFFF] focus:bg-primary focus:text-[#FFFFFF] transition-all duration-250 cursor-pointer font-[600] text-[15px] justify-center gap-2 shadow-sm group"
 >
 <LogOut className="h-5 w-5 text-primary group-hover:text-[#FFFFFF] transition-colors duration-250" />
 Sign Out
 </DropdownMenuItem>
 </div>
 </motion.div>
 </AnimatePresence>
 </DropdownMenuContent>
 </DropdownMenu>

 <LogoutDialog 
 isOpen={isLogoutOpen} 
 onOpenChange={setIsLogoutOpen} 
 onConfirm={() => {
 setIsLogoutOpen(false);
 logout();
 }} 
 />
 </>
 );
};
