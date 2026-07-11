import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Star, MapPin, Clock, 
 ArrowLeft, Search, CheckCircle2, Sparkles, Filter, Utensils, Ticket
} from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';
import { useOutlets } from '@/hooks/queries/useOutlets';
import { useCategories } from '@/hooks/useCategories';
import { useCoupons } from '@/hooks/queries/useCoupons';

import { BannerCarousel } from '@/components/BannerCarousel/BannerCarousel';
import { CategoryList } from '@/components/CategoryList/CategoryList';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { ProductError } from '@/components/product/ProductError';
import { ProductDrawer } from '@/components/ProductDrawer/ProductDrawer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Outlet } from '@/types/organization.types';
import type { CategoryItem } from '@/types/category.types';
import { cn } from '@/lib/utils';

// Helper list of premium unsplash food cover images mapping dynamically to outlet IDs
const getRestaurantCover = (id: string) => {
 const covers = [
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
 ];
 let sum = 0;
 for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
 return covers[sum % covers.length];
};

export const LandingPage = () => {
 const organization = useOrganizationStore((state) => state.organization);
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);
 const belongsTo = organization?._id || '';

 const setLocation = useLocationStore((state) => state.setLocation);

 const { data: outletsData, isLoading: isOutletsLoading } = useOutlets(belongsTo);
 const outlets = outletsData?.outlets || [];

 // Flow State: 'restaurants' lists outlets, 'menu' shows selected outlet's categories/products
 const [flowView, setFlowView] = useState<'restaurants' | 'menu'>('restaurants');
 const [selectedCollection, setSelectedCollection] = useState<string>('all');
 const [restaurantQuery, setRestaurantQuery] = useState('');
 const [toggleMode, setToggleMode] = useState<'delivery' | 'pickup'>('delivery');

 // Menu/Product States
 const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

 const { 
 categories, 
 activeCategoryId, 
 setActiveCategoryId, 
 isLoading: isCategoriesLoading, 
 isError: isCategoriesError, 
 refetch: refetchCategories 
 } = useCategories();

 const { data: coupons = [] } = useCoupons();

 const handleCategorySelect = (id: string) => {
 setActiveCategoryId(id);
 if (id === 'all') {
 window.scrollTo({
 top: 250,
 behavior: 'smooth'
 });
 return;
 }
 const element = document.getElementById(id);
 if (element) {
 const elementPosition = element.getBoundingClientRect().top + window.scrollY;
 window.scrollTo({
 top: elementPosition - 140,
 behavior: 'smooth'
 });
 }
 };

 const handleProductClick = (product: CategoryItem) => {
 setSelectedProductId(product._id);
 };



 const handleSelectRestaurant = (outlet: Outlet) => {
 setSelectedOutlet(outlet);
 setFlowView('menu');
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleBackToRestaurants = () => {
 // Clear selected outlet so users can choose another restaurant
 setSelectedOutlet(null as any);
 setFlowView('restaurants');
 };

 const handleRequestLocation = () => {
 if ('geolocation' in navigator) {
 navigator.geolocation.getCurrentPosition(
 (position) => {
 setLocation(position.coords.latitude, position.coords.longitude);
 },
 (err) => console.error(err)
 );
 }
 };

 // Filter Outlets / Restaurants based on active collection and query
 const filteredOutlets = outlets.filter((o) => {
 const matchesQuery = o.outletName.toLowerCase().includes(restaurantQuery.toLowerCase()) ||
 (o.outletDetails?.city || '').toLowerCase().includes(restaurantQuery.toLowerCase());
 
 if (!matchesQuery) return false;

 if (selectedCollection === 'top-rated') {
 return o.storeStatus === true; // Assume high-quality open stores
 }
 if (selectedCollection === 'pure-veg') {
 return o.outletName.toLowerCase().includes('veg') || o.outletDetails?.outletName.toLowerCase().includes('veg');
 }
 return true;
 });

 console.log("[STAGE 5: Component Outlets Hook Return]", outlets);
 console.log("[STAGE 6: Final Render Filtered Outlets]", filteredOutlets);

 return (
 <div className="flex flex-col w-full min-h-screen bg-background pb-32">
 
 <AnimatePresence mode="wait">
 {flowView === 'restaurants' ? (
 
 /* ====================================================
 1. RESTAURANTS VIEW (Swiggy / Zomato Multi-Outlet style)
 ==================================================== */
 <motion.div
 key="restaurants"
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 transition={{ duration: 0.4 }}
 className="w-full flex flex-col"
 >
 
 {/* 1.1 LOCATION HERO & SWITCHER */}
 <div className="bg-gradient-to-b from-primary/5 via-background to-background py-8 border-b border-border/40">
 <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
 
 <div className="flex items-center gap-3">
 <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
 <MapPin className="h-6 w-6 text-primary animate-bounce" />
 </div>
 <div>
 <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Delivering To</h2>
 <div className="flex items-center gap-2">
 <span className="font-black text-lg text-foreground">
 {selectedOutlet?.outletDetails?.city || selectedOutlet?.outletName || 'Current Location'}
 </span>
 <button 
 onClick={handleRequestLocation}
 className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
 >
 (Change)
 </button>
 </div>
 </div>
 </div>

 {/* Delivery / Pickup Pill Switcher */}
 <div className="bg-muted dark:bg-white/5 p-1 rounded-full border border-border/50 dark:border-white/5 flex w-full md:w-auto self-start">
 <button 
 onClick={() => setToggleMode('delivery')}
 className={cn(
 "flex-1 md:flex-initial px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all",
 toggleMode === 'delivery' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
 )}
 >
 Delivery
 </button>
 <button 
 onClick={() => setToggleMode('pickup')}
 className={cn(
 "flex-1 md:flex-initial px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all",
 toggleMode === 'pickup' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
 )}
 >
 Self Pickup
 </button>
 </div>

 </div>
 </div>

 {/* 1.2 DYNAMIC BANNER CAROUSEL (PROMOTIONS) */}
 <div className="mt-8">
 <BannerCarousel />
 </div>

 {/* 1.3 NEARBY RESTAURANTS CAROUSEL */}
 {outlets.length > 0 && (
 <section className="w-full py-10 mt-6 max-w-7xl mx-auto px-4 md:px-10">
 <div className="flex items-center gap-2.5 mb-6">
 <div className="h-9 w-9 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center">
 <Sparkles className="h-5 w-5 text-orange-500 fill-orange-500" />
 </div>
 <h3 className="text-2xl font-black text-foreground tracking-tight">Popular Stores Near You</h3>
 </div>
 
 <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
 {outlets.map((outlet) => (
 <div 
 key={outlet._id}
 onClick={() => handleSelectRestaurant(outlet)}
 className="w-[220px] sm:w-[260px] shrink-0 bg-card rounded-[20px] border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 snap-start cursor-pointer"
 >
 <div className="relative aspect-[16/9] bg-muted">
 <img 
 src={getRestaurantCover(outlet._id)} 
 alt={outlet.outletName}
 className="object-cover w-full h-full"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
 <div className="absolute top-3 left-3">
 <Badge className={cn("text-[9px] font-bold px-2 py-0.5", outlet.storeStatus ? "bg-green-600 text-white" : "bg-destructive text-destructive-foreground")}>
 {outlet.storeStatus ? 'Open Now' : 'Closed'}
 </Badge>
 </div>
 </div>
 
 <div className="p-4 flex flex-col gap-1.5">
 <h4 className="font-extrabold text-base text-foreground line-clamp-1">{outlet.outletName}</h4>
 
 <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
 <span className="flex items-center gap-0.5 text-orange-500 font-bold">
 <Star className="h-3 w-3 fill-current" /> 4.5
 </span>
 <span>•</span>
 <span>25-35 mins</span>
 <span>•</span>
 <span>{outlet.distance ? `${outlet.distance.toFixed(1)} km` : '1.5 km'}</span>
 </div>

 <p className="text-[10px] text-muted-foreground line-clamp-1">
 {outlet.outletDetails?.address || 'Premium Cuisines, Gourmet Meals'}
 </p>
 </div>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* 1.4 RESTAURANT COLLECTIONS FILTERS */}
 <div className="max-w-7xl mx-auto px-4 md:px-10 mt-6 w-full">
 <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
 <div className="flex items-center gap-2">
 <Filter className="h-4.5 w-4.5 text-muted-foreground" />
 <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Quick Collections</span>
 </div>
 
 {/* Search Restaurant Input */}
 <div className="relative w-full max-w-xs">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <Input 
 type="text"
 value={restaurantQuery}
 onChange={(e) => setRestaurantQuery(e.target.value)}
 placeholder="Search restaurant or city..."
 className="pl-9 h-9 rounded-full bg-muted/40 border-none text-xs focus-visible:ring-1 focus-visible:ring-primary"
 />
 </div>
 </div>

 <div className="flex flex-wrap gap-2.5">
 {[
 { id: 'all', label: 'All Restaurants', icon: Utensils },
 { id: 'top-rated', label: 'Top Rated / Active', icon: Star },
 { id: 'pure-veg', label: 'Pure Veg Options', icon: CheckCircle2 }
 ].map((col) => {
 const Icon = col.icon;
 const active = selectedCollection === col.id;
 return (
 <button
 key={col.id}
 onClick={() => setSelectedCollection(col.id)}
 className={cn(
 "flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold border transition-all shadow-sm",
 active 
 ? "bg-primary border-primary text-primary-foreground" 
 : "bg-card border-border text-muted-foreground hover:text-foreground"
 )}
 >
 <Icon className="h-4 w-4" />
 {col.label}
 </button>
 );
 })}
 </div>
 </div>

 {/* 1.5 ALL RESTAURANTS LISTING GRID */}
 <section className="w-full py-12 max-w-7xl mx-auto px-4 md:px-10">
 <h3 className="text-2xl font-black text-foreground tracking-tight mb-8">All Outlets</h3>
 
 {isOutletsLoading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
 {[...Array(4)].map((_, i) => (
 <div key={i} className="aspect-[16/9] bg-muted rounded-[20px] animate-pulse" />
 ))}
 </div>
 ) : filteredOutlets.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
 {filteredOutlets.map((outlet) => (
 <div 
 key={outlet._id}
 onClick={() => handleSelectRestaurant(outlet)}
 className="w-full max-w-[260px] mx-auto sm:max-w-none bg-card rounded-[20px] border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
 >
 <div className="relative aspect-[16/9] bg-muted">
 <img 
 src={getRestaurantCover(outlet._id)} 
 alt={outlet.outletName}
 className="object-cover w-full h-full"
 />
 <div className="absolute top-3 left-3">
 <Badge className="bg-primary/95 text-primary-foreground font-bold text-[9px] px-2 py-0.5">
 {outlet.outletDetails?.city || 'City'}
 </Badge>
 </div>
 </div>
 
 <div className="p-4 flex flex-col flex-1 gap-1.5">
 <h4 className="font-extrabold text-base text-foreground line-clamp-1 leading-tight">
 {outlet.outletName}
 </h4>
 
 <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
 <span className="flex items-center gap-0.5 text-orange-500 font-bold">
 <Star className="h-3.5 w-3.5 fill-current" /> 4.5
 </span>
 <span>•</span>
 <span>25-35 mins</span>
 <span>•</span>
 <span>{outlet.distance ? `${outlet.distance.toFixed(1)} km` : '1.5 km'}</span>
 </div>
 
 <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
 {outlet.outletDetails?.address || 'Outlet Address'}
 </p>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-16 text-muted-foreground">
 No outlets found matching your criteria.
 </div>
 )}
 </section>

 </motion.div>
 ) : (
 
 /* ====================================================
 2. SELECTED RESTAURANT MENU VIEW
 ==================================================== */
 <motion.div
 key="menu"
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 transition={{ duration: 0.4 }}
 className="w-full flex flex-col"
 >
 
 {/* BACK BAR */}
 <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6 w-full">
 <button 
 onClick={handleBackToRestaurants}
 className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
 >
 <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
 Back to All Restaurants
 </button>
 </div>

 {/* RESTAURANT HERO & CARD */}
 {selectedOutlet && (
 <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 w-full space-y-6">
 
 {/* 📍 Current delivery location */}
 <div className="flex items-center gap-2 text-sm font-black text-muted-foreground">
 <span className="bg-muted px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5">
 <span>📍</span>
 <span>Current delivery location:</span>
 <span className="text-foreground font-extrabold">{selectedOutlet.outletDetails?.city || 'Default Location'}</span>
 </span>
 </div>

 {/* 1. Restaurant Hero Banner */}
 <div className="relative rounded-[24px] overflow-hidden bg-muted aspect-[21/9] max-h-[260px] shadow-sm border border-border/40">
 <img 
 src={getRestaurantCover(selectedOutlet._id)} 
 alt={selectedOutlet.outletName}
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
 </div>

 {/* 2. Restaurant Information Card */}
 <div className="bg-card rounded-[28px] border border-border/80 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
 
 {/* Subtle Background Pattern */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />

 {/* Left Column: Logo & Core Info */}
 <div className="flex items-center gap-5">
 {/* Restaurant Logo */}
 <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-muted border border-border shrink-0 shadow-md">
 <img 
 src={getRestaurantCover(selectedOutlet._id)} 
 alt={selectedOutlet.outletName}
 className="w-full h-full object-cover"
 />
 </div>

 <div className="space-y-1.5">
 <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
 {selectedOutlet.outletName}
 </h1>
 <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
 {selectedOutlet.outletDetails?.address || selectedOutlet.address}
 </p>
 </div>
 </div>

 {/* Right Column: Status, Rating, Delivery Time Grid */}
 <div className="flex flex-wrap items-center gap-4 md:gap-6 shrink-0 w-full md:w-auto">
 {/* Rating */}
 <div className="bg-muted/55 px-4 py-2.5 rounded-2xl border border-border/50 flex flex-col items-center justify-center min-w-[80px]">
 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Rating</span>
 <span className="text-sm font-black text-orange-500 flex items-center gap-1">
 <Star className="h-4 w-4 fill-current" /> 4.5
 </span>
 </div>

 {/* Delivery Time */}
 <div className="bg-muted/55 px-4 py-2.5 rounded-2xl border border-border/50 flex flex-col items-center justify-center min-w-[90px]">
 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Time</span>
 <span className="text-sm font-black text-foreground flex items-center gap-1">
 <Clock className="h-4 w-4 text-primary" /> 25-35 min
 </span>
 </div>

 {/* Open / Closed Status */}
 <div className="bg-muted/55 px-4 py-2.5 rounded-2xl border border-border/50 flex flex-col items-center justify-center min-w-[90px]">
 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</span>
 <Badge className={cn("text-xs font-bold px-2.5 py-0.5", selectedOutlet.storeStatus ? "bg-green-600 text-white" : "bg-destructive text-white")}>
 {selectedOutlet.storeStatus ? 'Open Now' : 'Closed'}
 </Badge>
 </div>
 </div>

 </div>

 {/* 3. Active Offers (Coupons horizontal list) */}
 {coupons && coupons.length > 0 && (
 <div className="space-y-3.5 pt-4">
 <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-1.5">
 <Sparkles className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
 Active Offers & Coupons
 </h3>
 <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory">
 {coupons.map((coupon) => (
 <div 
 key={coupon._id}
 className="flex-none w-[240px] p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 dark:border-primary/10 rounded-2xl flex items-start gap-3 snap-start shadow-sm"
 >
 <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
 <Ticket className="h-4 w-4" />
 </div>
 <div className="min-w-0">
 <span className="font-black text-xs text-primary block leading-none tracking-wide">{coupon.code}</span>
 <span className="font-extrabold text-sm text-foreground block mt-1.5 leading-none">
 {coupon.discountValue}% OFF
 </span>
 <span className="text-[10px] text-muted-foreground block mt-2 font-semibold leading-relaxed line-clamp-1">
 {coupon.description || 'Valid on all menu items'}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 </div>
 )}

 {/* MENU SECTION */}
 {isCategoriesError ? (
 <div className="w-full py-20">
 <ProductError onRetry={() => refetchCategories()} />
 </div>
 ) : isCategoriesLoading ? (
 <div className="min-h-[50vh] w-full mt-10">
 <ProductSkeleton />
 </div>
 ) : (
 <div className="w-full flex flex-col bg-background">
 
 {/* 4. Explore Menu (Category Navigation Strip) */}
 {categories.length > 0 && (
 <CategoryList 
 categories={categories}
 activeCategoryId={activeCategoryId}
 onSelectCategory={handleCategorySelect}
 />
 )}

 {/* 5. Product Listings (Render categories vertically sequentially) */}
 <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 w-full space-y-12">
 {categories.filter(c => c._id !== 'all').map((cat) => {
 // Perform plain array filtering locally to satisfy react hook rules
 const catProducts = cat.items || [];

 if (catProducts.length === 0) return null;
 return (
 <div key={cat._id} id={cat._id} className="scroll-mt-32 sm:scroll-mt-36">
 <ProductGrid 
 products={catProducts} 
 onProductClick={handleProductClick}
 title={cat.name}
 />
 </div>
 );
 })}
 </div>

 </div>
 )}

 </motion.div>
 )}
 </AnimatePresence>

 {/* Product Drawer */}
 <ProductDrawer 
 itemId={selectedProductId}
 isOpen={!!selectedProductId}
 onClose={() => setSelectedProductId(null)}
 />

 </div>
 );
};
