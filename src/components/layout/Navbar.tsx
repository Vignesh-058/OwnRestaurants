import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
 ShoppingCart, Search, Heart, Mic, ChevronDown, MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/CartStore';
import { useWishlistStore } from '@/store/WishlistStore';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { AccountPanel } from '@/components/layout/AccountPanel';
import { cn } from '@/lib/utils';

export const Navbar = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const currentPath = location.pathname;

 const cartDetails = useCartStore((state) => state.cartDetails);
 const cartItems = cartDetails?.items || [];
 const cartTotal = cartDetails?.total || 0;
 const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

 const wishlistCount = useWishlistStore((state) => state.items.length);
 const { isAuthenticated, user } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);
 const currency = organization?.currency || '₹';
 
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

 const openLocationModal = useLocationModalStore((state) => state.openModal);
 const userLocationAddress = useLocationStore((state) => state.address);

 const [isSearchFocused, setIsSearchFocused] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const searchRef = useRef<HTMLDivElement>(null);

 const [showWishlistTooltip, setShowWishlistTooltip] = useState(false);

 // Close dropdowns on click outside
 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
 setIsSearchFocused(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const navLinks = [
 { id: 'explore', label: 'Explore', path: '/' },
 { id: 'offers', label: 'Offers', path: '/offers' },
 { id: 'orders', label: 'Orders', path: '/profile/orders' }
 ];

 const handleSearchSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (searchQuery.trim()) {
 navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
 setIsSearchFocused(false);
 }
 };

 const activeTabId = (() => {
 if (currentPath === '/') return 'explore';
 if (currentPath.startsWith('/offers')) return 'offers';
 if (currentPath.startsWith('/orders') || currentPath.startsWith('/profile/orders')) return 'orders';
 return '';
 })();

 return (
 <header className="w-full sticky top-0 z-50 bg-white/78 dark:bg-slate-900/78 backdrop-blur-[22px] border-b border-border/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.03)] py-3.5 px-4 md:px-8 transition-colors">
 <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
 
 {/* LEFT SECTION: Logo & Brand Name */}
 <div className="flex items-center gap-5 shrink-0">
 <Link to="/" className="flex items-center gap-2.5 group">
 <div className="h-9 w-9 bg-primary-gradient rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 overflow-hidden shrink-0">
 <ShoppingCart className="h-4.5 w-4.5 text-white stroke-[2.5]" />
 </div>
 <span className="font-extrabold text-lg tracking-tight text-foreground transition-colors hidden sm:block">
 Own Restaurants
 </span>
 </Link>

 {/* Location selector dropdown: 'Deliver To' / 'Change Store' */}
 <div className="relative z-50">
 <button 
 onClick={openLocationModal}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left focus:outline-none"
 >
 <MapPin className="h-4 w-4 text-primary shrink-0 animate-pulse" />
 <div className="flex flex-col">
 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider leading-none">Deliver To</span>
 <span className="text-xs font-bold text-foreground line-clamp-1 max-w-[120px] sm:max-w-[150px] leading-tight flex items-center gap-0.5">
 {userLocationAddress || selectedOutlet?.outletDetails?.city || selectedOutlet?.outletName || 'Select store'}
 <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
 </span>
 </div>
 </button>
 </div>
 </div>

 {/* CENTER SECTION: Explore, Offers, Orders (Pill Link Slider) */}
 <nav className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-950/50 border border-border/80 dark:border-white/5 rounded-full p-1 relative shrink-0">
 {navLinks.map((link) => {
 const active = activeTabId === link.id;
 return (
 <Link
 key={link.id}
 to={link.path}
 className={cn(
 "relative px-5 py-2 rounded-full text-xs font-extrabold tracking-wide transition-colors duration-300 z-10",
 active 
 ? "text-white" 
 : "text-secondary-foreground hover:text-foreground"
 )}
 >
 {active && (
 <motion.div
 layoutId="nav-link-pill-v3"
 className="absolute inset-0 bg-primary-gradient rounded-full shadow-md shadow-primary/20"
 transition={{ type: "spring", stiffness: 380, damping: 30 }}
 />
 )}
 <span className="relative z-20">{link.label}</span>
 </Link>
 );
 })}
 </nav>

 {/* RIGHT SECTION: Search Bar, Wishlist, Cart & Profile */}
 <div className="flex items-center gap-3 shrink-0">
 
 {/* Large Search Input */}
 <div ref={searchRef} className={cn(
 "relative transition-all duration-500 ease-out hidden md:block",
 isSearchFocused ? "w-64 lg:w-80" : "w-48 lg:w-56"
 )}>
 <form onSubmit={handleSearchSubmit}>
 <div className={cn(
 "relative flex items-center bg-slate-100 dark:bg-slate-950/40 rounded-full border border-border transition-all duration-300",
 isSearchFocused ? "border-primary bg-background shadow-lg ring-4 ring-primary/10" : "hover:border-slate-300 dark:hover:border-slate-800"
 )}>
 <Search className={cn("absolute left-3.5 h-4 w-4 transition-colors", isSearchFocused ? "text-primary" : "text-muted-foreground")} />
 <Input 
 type="text" 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onFocus={() => setIsSearchFocused(true)}
 placeholder="Search stores or dishes..." 
 className="w-full bg-transparent h-9.5 pl-10 pr-8 border-none focus-visible:ring-0 text-xs shadow-none text-foreground placeholder:text-muted-foreground"
 />
 <button 
 type="button" 
 className="absolute right-3.5 p-0.5 text-muted-foreground hover:text-primary transition-colors"
 >
 <Mic className="h-4 w-4" />
 </button>
 </div>
 </form>
 </div>

 {/* Mobile Search Button */}
 <Link to="/search" className="md:hidden">
 <Button variant="ghost" size="icon" className="rounded-full h-9.5 w-9.5 hover:bg-slate-100 dark:hover:bg-white/10">
 <Search className="h-4.5 w-4.5 text-foreground" />
 </Button>
 </Link>

 {/* Wishlist Button with Custom Tooltip */}
 <div 
 onMouseEnter={() => setShowWishlistTooltip(true)}
 onMouseLeave={() => setShowWishlistTooltip(false)}
 className="relative hidden sm:block"
 >
 <Link to="/wishlist">
 <Button variant="ghost" size="icon" className="relative rounded-full h-9.5 w-9.5 hover:bg-slate-100 dark:hover:bg-white/10 group shrink-0">
 <Heart className="h-4.5 w-4.5 text-foreground group-hover:scale-110 transition-transform duration-300" />
 {wishlistCount > 0 && (
 <Badge className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center p-0 rounded-full text-[8.5px] bg-red-500 text-white border-2 border-background shadow-sm font-bold">
 {wishlistCount}
 </Badge>
 )}
 </Button>
 </Link>

 <AnimatePresence>
 {showWishlistTooltip && (
 <motion.div 
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg z-50 pointer-events-none whitespace-nowrap"
 >
 View Wishlist
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Premium Cart Button */}
 <Link to="/cart">
 <button className="flex items-center gap-2 h-9.5 px-4 bg-primary-gradient hover:opacity-95 text-white rounded-full transition-all duration-300 shadow-md shadow-primary/20 shrink-0">
 <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
 <span className="text-xs font-black tracking-wide flex items-center gap-1">
 {totalCartQuantity > 0 ? (
 <>
 <span>{totalCartQuantity} items</span>
 <span className="opacity-50">•</span>
 <span>{currency}{cartTotal.toLocaleString()}</span>
 </>
 ) : (
 'Cart'
 )}
 </span>
 </button>
 </Link>

 {/* Profile Avatar & Customer Name */}
 {isAuthenticated ? (
 <div className="flex items-center gap-2.5 shrink-0">
 <span className="hidden xl:inline text-xs font-black text-foreground">
 {user?.name || 'Account'}
 </span>
 <AccountPanel />
 </div>
 ) : (
 <Link to="/login">
 <Button size="sm" className="rounded-full h-9.5 px-5 bg-primary-gradient hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-primary/20 transition-all duration-300 shrink-0">
 Sign In
 </Button>
 </Link>
 )}
 </div>
 
 </div>
 </header>
 );
};
