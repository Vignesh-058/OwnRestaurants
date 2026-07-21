import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/hooks/queries/useBanners";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import { useSettingsStore } from "@/store/SettingsStore";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ENV from "@/config/env";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/banner.types";

export const HeroBanner = () => {
  const navigate = useNavigate();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const settings = useSettingsStore((state) => state.settings);
  const belongsTo = organization?._id || "";
  const outletId = selectedOutlet?._id || "";

  const { data: banners, isLoading } = useBanners(belongsTo, outletId);
  const activeBanners = useMemo(() => (banners || []).filter((b) => b.active).sort((a, b) => (a.rank || 0) - (b.rank || 0)), [banners]);
  
  const hasBanners = activeBanners.length > 0;
  const isBannerEnabled = settings?.banner?.enable ?? true;
  const isAutoScrollEnabled = settings?.banner?.autoScroll ?? true;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    hasBanners && activeBanners.length > 1 && isAutoScrollEnabled ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isBannerEnabled) {
    return null;
  }

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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith("http")) return path;
    const baseUrl = ENV.API_BASE_URL || ENV.BANNER_API?.replace("/banner", "") || "";
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  const handleBannerClick = (banner: Banner) => {
    const targetLink = banner.link || banner.buttonLink;
    if (targetLink) {
      if (targetLink.startsWith('http')) {
        window.open(targetLink, '_blank');
      } else {
        navigate(targetLink);
      }
    } else if (banner.type === 'category' && banner.category?.length > 0) {
      navigate(`/products?category=${banner.category[0]}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (banner.type === 'item' && banner.item?.length > 0) {
      navigate(`/products?product=${banner.item[0]}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative w-full pt-[80px] lg:pt-[24px] pb-6 bg-background flex justify-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-8">
        
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
          {isLoading ? (
             <Skeleton className="w-full h-full rounded-[24px] opacity-50 bg-muted" />
          ) : hasBanners ? (
            <div className="w-full h-full relative group">
              <div className="overflow-hidden w-full h-full rounded-[24px] shadow-sm relative border border-border" ref={emblaRef}>
                <div className="flex w-full h-full touch-pan-y">
                  {activeBanners.map((banner, index) => {
                    const imgUrl = getImageUrl(banner.image?.webView || banner.image?.mobileView);
                    return (
                      <div 
                        key={banner._id || index} 
                        className="flex-[0_0_100%] min-w-0 relative h-full cursor-pointer"
                        onClick={() => handleBannerClick(banner)}
                      >
                        <div className="absolute inset-0 bg-muted">
                          <img 
                            src={imgUrl} 
                            alt={banner.title || "Promotional Banner"} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            fetchPriority={index === 0 ? "high" : "auto"}
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Navigation Arrows (visible on hover for desktop) */}
              {activeBanners.length > 1 && (
                <>
                  <button 
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-border flex items-center justify-center text-foreground hover:text-primary hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button 
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-border flex items-center justify-center text-foreground hover:text-primary hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Pagination Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          selectedIndex === idx 
                            ? "w-6 h-1.5 bg-primary shadow-sm" 
                            : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full rounded-[24px] bg-muted border border-border flex items-center justify-center text-center p-8">
               <p className="text-muted-foreground font-medium">Promotional banners will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
