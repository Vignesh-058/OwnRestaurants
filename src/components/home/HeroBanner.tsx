import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/hooks/queries/useBanners";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ENV from "@/config/env";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/banner.types";

export const HeroBanner = () => {
  const navigate = useNavigate();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const belongsTo = organization?._id || "";
  const outletId = selectedOutlet?._id || "";

  useEffect(() => {
    if (outletId) {
      console.log('[Selected Outlet]', outletId);
    }
  }, [outletId]);

  const { data: banners, isLoading } = useBanners(belongsTo, outletId);
  const activeBanners = useMemo(() => (banners || []).filter((b) => b.active).sort((a, b) => (a.rank || 0) - (b.rank || 0)), [banners]);
  const hasBanners = activeBanners.length > 0;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    hasBanners && activeBanners.length > 1 ? [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
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

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith("http")) return path;
    const baseUrl = ENV.API_BASE_URL || ENV.BANNER_API?.replace("/banner", "") || "";
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  const handleBannerClick = (banner: Banner) => {
    console.log('[Banner Click Event]', banner);
    if (banner.buttonLink) {
      if (banner.buttonLink.startsWith('http')) {
        window.open(banner.buttonLink, '_blank');
      } else {
        navigate(banner.buttonLink);
      }
    } else if (banner.type === 'category' && banner.category?.length > 0) {
      navigate(`/products?category=${banner.category[0]}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (banner.type === 'item' && banner.item?.length > 0) {
      navigate(`/products?product=${banner.item[0]}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[350px] md:h-[500px] lg:h-[700px] flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }

  if (!hasBanners) {
    return null;
  }

  return (
    <section id="home" className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] bg-gradient-to-br from-[#0F172A] to-[#111827] overflow-hidden group">
      
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex w-full h-full touch-pan-y">
          {activeBanners.map((banner, index) => {
             const desktopImg = getImageUrl(banner.image?.webView || banner.image?.mobileView);
             const mobileImg = getImageUrl(banner.image?.mobileView || banner.image?.webView);

             return (
               <div 
                 key={banner._id || index} 
                 className="flex-[0_0_100%] min-w-0 relative h-full w-full cursor-pointer"
                 onClick={() => handleBannerClick(banner)}
               >
                 <picture>
                   <source media="(min-width: 768px)" srcSet={desktopImg} />
                   <motion.img 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.4 }}
                     src={mobileImg} 
                     alt={banner.title || "Promotional Banner"} 
                     className="w-full h-full object-cover origin-center"
                     loading="lazy"
                   />
                 </picture>
                 
                 {/* Gradient Overlay for Text Readability */}
                 <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 md:from-black/90 via-black/40 to-transparent pointer-events-none" />

                 {/* Text Content */}
                 <div className="absolute inset-0 z-10 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-10 pointer-events-none">
                   <div className="w-full md:w-[60%] lg:w-[50%]">
                     <AnimatePresence mode="wait">
                       {index === selectedIndex && (
                         <motion.div
                           key="content"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.5, delay: 0.2 }}
                         >
                           {banner.subtitle && (
                             <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 font-bold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-[0_2px_10px_rgba(255,107,0,0.1)]">
                               {banner.subtitle}
                             </span>
                           )}
                           
                           {banner.title && (
                             <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tight drop-shadow-md">
                               {banner.title}
                             </h1>
                           )}
                           
                           {banner.description && (
                             <p className="text-[#D1D5DB] text-sm md:text-lg lg:text-xl font-medium mb-8 max-w-lg leading-relaxed drop-shadow-sm">
                               {banner.description}
                             </p>
                           )}

                           {banner.buttonText && (
                             <Button
                               className="pointer-events-auto bg-[#FF6B00] hover:bg-[#E65C00] text-white px-6 md:px-8 py-5 md:py-7 rounded-[12px] md:rounded-[14px] text-[15px] md:text-[17px] font-bold transition-all shadow-[0_8px_25px_rgba(255,107,0,0.3)] hover:shadow-[0_12px_35px_rgba(255,107,0,0.4)] hover:-translate-y-1 border-0 w-full sm:w-auto"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleBannerClick(banner);
                               }}
                             >
                               {banner.buttonText}
                             </Button>
                           )}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 </div>

               </div>
             );
          })}
        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      {activeBanners.length > 1 && (
        <>
          <button 
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                selectedIndex === idx 
                  ? "w-8 h-2.5 bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.5)]" 
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

    </section>
  );
};
