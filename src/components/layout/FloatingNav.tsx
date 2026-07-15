import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Tag, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/AuthStore';

export const FloatingNav = () => {
 const location = useLocation();
 const { isAuthenticated } = useAuthStore();
 const currentPath = location.pathname;

 if (!isAuthenticated) return null;

 const tabs = [
 {
 id: 'home',
 label: 'Home',
 path: '/',
 icon: Home,
 },
 {
 id: 'menu',
 label: 'Menu',
 path: '/menu-ref', // custom placeholder to distinguish Menu from Home active state
 icon: Compass,
 },
 {
 id: 'offers',
 label: 'Offers',
 path: '/offers',
 icon: Tag,
 },
 {
 id: 'orders',
 label: 'Orders',
 path: isAuthenticated ? '/orders' : '/login',
 icon: Receipt,
 },
 ];

 // Helper to determine active state
 const isActive = (tabId: string, path: string) => {
 if (tabId === 'menu') {
 return false; // Menu scrolling behavior is handled via click
 }
 if (path === '/') {
 return currentPath === '/';
 }
 return currentPath.startsWith(path);
 };

 const handleMenuClick = (e: React.MouseEvent) => {
 if (currentPath === '/') {
 e.preventDefault();
 const shopEl = document.getElementById('shop');
 if (shopEl) {
 shopEl.scrollIntoView({ behavior: 'smooth' });
 }
 } else {
 // Allow default navigation to "/"
 }
 };

 return (
 <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-auto pointer-events-none md:hidden">
 <nav className="pointer-events-auto bg-black/85 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/10 px-3 py-2 rounded-full flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
 {tabs.map((tab) => {
 const active = isActive(tab.id, tab.path);
 const Icon = tab.icon;
 const isMenu = tab.id === 'menu';

 return (
 <Link
 key={tab.id}
 to={isMenu ? '/' : tab.path}
 onClick={isMenu ? handleMenuClick : undefined}
 className="relative flex items-center justify-center transition-all duration-300 focus:outline-none"
 >
 {active && (
 <motion.div
 layoutId="active-nav-pill-mobile"
 className="absolute inset-0 bg-[#FF6B00] rounded-full shadow-[0_0_15px_rgba(255,107,0,0.4)]"
 transition={{ type: 'spring', stiffness: 380, damping: 30 }}
 />
 )}

 <div
 className={cn(
 "relative z-10 flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-colors duration-300",
 active ? "text-white font-bold" : "text-white/60 hover:text-white"
 )}
 >
 <Icon className={cn("h-5 w-5", active ? "stroke-[2.5]" : "stroke-[2]")} />
 {active && (
 <span className="text-xs tracking-wide font-semibold pr-0.5">
 {tab.label}
 </span>
 )}
 </div>
 </Link>
 );
 })}
 </nav>
 </div>
 );
};
