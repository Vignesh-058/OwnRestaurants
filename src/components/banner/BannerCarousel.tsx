import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useSettingsStore } from '@/store/SettingsStore';
import { useBanners } from '@/hooks/queries/useBanners';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Banner } from '@/types/banner.types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const BannerCarousel = () => {
 const navigate = useNavigate();
 const organization = useOrganizationStore((state) => state.organization);
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const belongsTo = organization?._id || '';
 const outletId = selectedOutlet?._id || '';

 const settings = useSettingsStore((state) => state.settings);
 const autoScroll = settings?.banner?.autoScroll ?? true;

 const { data: banners, isLoading } = useBanners(belongsTo, outletId);

 const [emblaRef, emblaApi] = useEmblaCarousel(
   { loop: true }, 
   autoScroll ? [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })] : []
 );
 const [selectedIndex, setSelectedIndex] = useState(0);

 const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

 const onSelect = useCallback(() => {
 if (!emblaApi) return;
 setSelectedIndex(emblaApi.selectedScrollSnap());
 }, [emblaApi]);

 useEffect(() => {
 if (!emblaApi) return;
 onSelect();
 emblaApi.on('select', onSelect);
 emblaApi.on('reInit', onSelect);
 }, [emblaApi, onSelect]);

 const handleBannerClick = (banner: Banner) => {
 if (banner.type === 'category' && banner.category && banner.category.length > 0) {
 navigate(`/category/${banner.category[0]}`);
 } else if (banner.type === 'item' && banner.item && banner.item.length > 0) {
 navigate(`/product/${banner.item[0]}`);
 }
 };

 const bannerConfig = organization?.theme?.sections?.banner?.config;
 const showDots = bannerConfig?.showDots ?? true;
 const borderRadius = bannerConfig?.borderRadius ?? 48;

 if (isLoading) {
 return (
 <div className="w-full px-4 md:px-10 mt-4 md:mt-8">
 <div className="max-w-7xl mx-auto">
 <Skeleton className="w-full aspect-[4/3] md:aspect-[21/9]" style={{ borderRadius }} />
 </div>
 </div>
 );
 }

 const activeBanners = banners || [];

 if (activeBanners.length === 0) {
 return null; // Return nothing instead of EmptyBanner for a cleaner premium feel
 }

 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.8, ease: "easeOut" }}
 className="w-full px-4 md:px-10 relative group"
 >
 <div className="max-w-7xl mx-auto relative">
 <div className="overflow-hidden shadow-2xl relative bg-muted/20 cursor-pointer" style={{ borderRadius }} ref={emblaRef}>
 <div className="flex touch-pan-y">
 {activeBanners.map((banner) => (
 <div 
 className="flex-[0_0_100%] min-w-0 relative group/slide" 
 key={banner._id}
 onClick={() => handleBannerClick(banner)}
 >
 <picture>
 <source media="(min-width: 768px)" srcSet={banner.image.webView} />
 <img 
 src={banner.image.mobileView} 
 alt="Promotional Banner" 
 className="w-full object-cover h-[350px] md:h-[500px] transition-transform duration-[10s] ease-out group-hover/slide:scale-[1.05]"
 loading="lazy"
 />
 </picture>
 
 {/* Premium Gradient Overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
 
 {/* CTA on Hover (Desktop) */}
 <div className="absolute bottom-10 left-10 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-500 hidden md:block">
 <Button className="rounded-full bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-2xl">
 Explore Now <ArrowRight className="ml-2 h-5 w-5" />
 </Button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Custom Pagination Dots */}
 {showDots && activeBanners.length > 1 && (
 <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
 {activeBanners.map((_, index) => (
 <button
 key={index}
 onClick={(e) => {
 e.stopPropagation();
 scrollTo(index);
 }}
 className={cn(
 "h-2.5 rounded-full transition-all duration-500 backdrop-blur-md",
 selectedIndex === index 
 ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
 : "w-2.5 bg-white/40 hover:bg-white/70"
 )}
 aria-label={`Go to slide ${index + 1}`}
 />
 ))}
 </div>
 )}
 </div>
 </motion.div>
 );
};
