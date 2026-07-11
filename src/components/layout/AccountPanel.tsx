import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Package, 
 MapPin, 
 Ticket, 
 Heart, 
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
 gradient: 'from-blue-500 to-indigo-500',
 },
 {
 icon: Package,
 title: 'Order History',
 subtitle: 'View and track previous purchases',
 href: '/profile/orders',
 gradient: 'from-sky-500 to-blue-500',
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
 icon: Heart,
 title: 'Favorites',
 subtitle: 'View your wishlist items',
 href: '/wishlist',
 gradient: 'from-pink-500 to-rose-500',
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
 <Avatar className="h-9 w-9 border border-border/80 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all shadow-sm">
 <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
 <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-extrabold">
 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
 </AvatarFallback>
 </Avatar>
 </DropdownMenuTrigger>
 
 <DropdownMenuContent 
 align="end" 
 className="w-[340px] sm:w-[360px] p-0 rounded-[2rem] border border-border/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] mt-2.5 overflow-hidden"
 >
 <AnimatePresence>
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.2 }}
 >
 {/* User Header with dynamic membership gradient */}
 <DropdownMenuLabel className="p-5 flex items-center gap-4 bg-muted/40 dark:bg-slate-950/40 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
 
 <Avatar className="h-14 w-14 border-2 border-background shadow-md">
 <AvatarImage src={user?.avatar} alt={user?.name || 'User'} className="object-cover" />
 <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-black text-lg">
 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
 </AvatarFallback>
 </Avatar>
 
 <div className="flex flex-col space-y-1 relative z-10">
 <div className="flex items-center gap-2">
 <p className="text-base font-extrabold leading-none text-foreground">{user?.name || 'Guest User'}</p>
 {ordersCount > 10 && (
 <span className="text-[8px] bg-primary/15 text-primary border border-primary/25 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider flex items-center gap-0.5 shrink-0">
 <Sparkles className="h-2 w-2" /> Elite
 </span>
 )}
 </div>
 <p className="text-xs font-semibold text-muted-foreground">+91 {user?.phone || 'No Phone'}</p>
 {user?.email && <p className="text-[11px] font-medium text-muted-foreground/80 truncate max-w-[190px]">{user.email}</p>}
 </div>
 </DropdownMenuLabel>
 
 <Separator className="bg-border/60 dark:bg-white/5" />
 
 {/* Stats capsule row */}
 <div className="p-4 grid grid-cols-3 gap-2.5">
 <Card className="rounded-2xl border-border/80 dark:border-white/5 bg-background dark:bg-slate-950/40 hover:bg-muted/50 transition-colors shadow-sm">
 <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
 <span className="text-lg mb-1 leading-none">📦</span>
 <span className="font-extrabold text-sm text-foreground">{ordersCount}</span>
 <span className="text-[9px] uppercase font-black text-muted-foreground mt-0.5 tracking-wider">Orders</span>
 </CardContent>
 </Card>
 <Card className="rounded-2xl border-border/80 dark:border-white/5 bg-background dark:bg-slate-950/40 hover:bg-muted/50 transition-colors shadow-sm">
 <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
 <span className="text-lg mb-1 leading-none">💰</span>
 <span className="font-extrabold text-sm text-foreground truncate max-w-full">
 {currency}{spentAmount}
 </span>
 <span className="text-[9px] uppercase font-black text-muted-foreground mt-0.5 tracking-wider">Spent</span>
 </CardContent>
 </Card>
 <Card className="rounded-2xl border-border/80 dark:border-white/5 bg-background dark:bg-slate-950/40 hover:bg-muted/50 transition-colors shadow-sm">
 <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
 <span className="text-lg mb-1 leading-none">📍</span>
 <span className="font-extrabold text-sm text-foreground">{savedAddressesCount}</span>
 <span className="text-[9px] uppercase font-black text-muted-foreground mt-0.5 tracking-wider">Saved</span>
 </CardContent>
 </Card>
 </div>
 
 <Separator className="bg-border/60 dark:bg-white/5" />
 
 {/* Account Menu */}
 <div className="p-2.5 max-h-[280px] overflow-y-auto scrollbar-none space-y-1">
 {menuItems.map((item, index) => (
 <DropdownMenuItem key={index} asChild className="p-0 focus:bg-transparent cursor-pointer">
 <Link 
 to={item.href}
 className="flex items-center w-full px-3 py-2.5 rounded-2xl hover:bg-muted/50 dark:hover:bg-white/5 transition-colors group"
 >
 <div className={`h-8.5 w-8.5 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center mr-3 group-hover:scale-105 transition-transform shrink-0 shadow-sm`}>
 <item.icon className="h-4 w-4" />
 </div>
 <div className="flex-1 flex flex-col text-left">
 <span className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">{item.title}</span>
 <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 leading-none">{item.subtitle}</span>
 </div>
 <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors opacity-50 group-hover:opacity-100" />
 </Link>
 </DropdownMenuItem>
 ))}
 </div>
 
 <Separator className="bg-border/60 dark:bg-white/5" />
 
 {/* Sign Out Trigger */}
 <div className="p-2.5">
 <DropdownMenuItem 
 onSelect={(e) => {
 e.preventDefault();
 setIsLogoutOpen(true);
 }}
 className="flex items-center w-full px-4 py-3 rounded-2xl text-destructive border border-red-500/20 hover:bg-red-500/5 hover:text-red-500 focus:bg-red-500/5 focus:text-red-500 transition-all cursor-pointer font-bold text-xs justify-center gap-1.5 shadow-sm"
 >
 <LogOut className="h-4 w-4" />
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
