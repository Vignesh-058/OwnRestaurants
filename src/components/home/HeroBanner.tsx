import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

  const { data: banners, isLoading } = useBanners(belongsTo, outletId);
  const activeBanners = useMemo(() => (banners || []).filter((b) => b.active).sort((a, b) => (a.rank || 0) - (b.rank || 0)), [banners]);
  
  const hasBanners = activeBanners.length > 0;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    hasBanners && activeBanners.length > 1 ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

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

  return (
    <section id="home" className="relative w-full min-h-[600px] lg:h-[700px] bg-background overflow-hidden flex items-center pt-[72px] lg:pt-0">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 py-12 lg:py-0">
        
        {/* Left Content Area */}
        <div className="flex flex-col text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-6">
              Delicious Food Delivered <span className="text-primary relative inline-block">
                Fresh
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
              </span> to Your Doorstep
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg mb-10 leading-relaxed">
              Order from your favorite restaurants with fast delivery, secure payments, and exclusive offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-7 rounded-full text-[17px] font-bold shadow-[var(--shadow-primary)] hover:shadow-[0_12px_28px_-6px_rgba(245,97,11,0.4)] hover:-translate-y-1 transition-all duration-300"
                onClick={() => {
                  navigate('/products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Explore Products
              </Button>
              <Button 
                variant="outline"
                className="bg-card hover:bg-muted border-border text-foreground px-8 py-7 rounded-full text-[17px] font-bold hover:-translate-y-1 transition-all duration-300 shadow-sm"
                onClick={() => {
                  const offersSection = document.getElementById('offers');
                  if(offersSection) {
                    offersSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/offers');
                  }
                }}
              >
                View Offers
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center lg:justify-end">
          {isLoading ? (
             <Skeleton className="w-full max-w-[550px] h-full rounded-[32px] opacity-50 bg-muted" />
          ) : hasBanners ? (
            <div className="w-full max-w-[550px] relative group">
              <div className="overflow-hidden w-full h-full rounded-[32px] shadow-floating relative border border-border" ref={emblaRef}>
                <div className="flex w-full h-full touch-pan-y">
                  {activeBanners.map((banner, index) => {
                    const imgUrl = getImageUrl(banner.image?.webView || banner.image?.mobileView);
                    return (
                      <div 
                        key={banner._id || index} 
                        className="flex-[0_0_100%] min-w-0 relative h-[400px] lg:h-[600px] cursor-pointer"
                        onClick={() => handleBannerClick(banner)}
                      >
                        <div className="absolute inset-0 bg-muted rounded-[32px] overflow-hidden">
                          <img 
                            src={imgUrl} 
                            alt={banner.title || "Promotional Banner"} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
                    className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-card rounded-full shadow-lg border border-border flex items-center justify-center text-foreground hover:text-primary hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={scrollNext}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-card rounded-full shadow-lg border border-border flex items-center justify-center text-foreground hover:text-primary hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Pagination Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 glass-panel px-4 py-2 rounded-full shadow-sm">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          selectedIndex === idx 
                            ? "w-8 h-2 bg-primary shadow-[0_0_10px_rgba(255,107,0,0.3)]" 
                            : "w-2 h-2 bg-foreground/20 hover:bg-foreground/40"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full max-w-[550px] h-full rounded-[32px] bg-card border border-border shadow-floating flex items-center justify-center text-center p-8">
               <p className="text-muted-foreground font-medium">Promotional banners will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
