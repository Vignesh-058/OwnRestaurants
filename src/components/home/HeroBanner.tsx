import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { useBanners } from "@/hooks/queries/useBanners";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import ENV from "@/config/env";
import defaultHero from "@/assets/hero.png";
import { cn } from "@/lib/utils";

export const HeroBanner = () => {
  const navigate = useNavigate();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const belongsTo = organization?._id || "";
  const outletId = selectedOutlet?._id || "";

  const { data: banners, isLoading } = useBanners(belongsTo, outletId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  const activeBanners = banners?.filter((b) => b.active) || [];
  const hasBanners = activeBanners.length > 0;

  useEffect(() => {
    if (!hasBanners || isHovered || activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasBanners, isHovered, activeBanners.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length,
    );
  };

  const getImageUrl = (path: string) => {
    if (!path) return defaultHero;
    if (path.startsWith("http")) return path;
    const baseUrl = ENV.API_URL || ENV.BANNER_API?.replace("/banner", "") || "";
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  if (isLoading) {
    return (
      <section className="relative w-full min-h-[420px] md:min-h-[500px] lg:min-h-[700px] bg-gradient-to-br from-[#0F172A] to-[#111827] flex items-center py-16 lg:py-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center w-full gap-12">
          <div className="w-full lg:w-[45%]">
            <div className="h-8 w-48 bg-muted/20 rounded-full animate-pulse mb-6" />
            <div className="h-16 w-full bg-muted/20 rounded animate-pulse mb-4" />
            <div className="h-16 w-3/4 bg-muted/20 rounded animate-pulse mb-6" />
            <div className="h-20 w-full max-w-md bg-muted/20 rounded animate-pulse mb-10" />
            <div className="flex gap-4">
              <div className="h-14 w-40 bg-muted/20 rounded-[16px] animate-pulse" />
              <div className="h-14 w-40 bg-muted/20 rounded-[16px] animate-pulse" />
            </div>
          </div>
          <div className="w-full lg:w-[55%] h-[400px] md:h-[500px] lg:h-[600px] bg-muted/10 rounded-[24px] animate-pulse mt-8 lg:mt-0" />
        </div>
      </section>
    );
  }

  const currentBanner = hasBanners ? activeBanners[currentIndex] : undefined;

  // Right side content renderer
  const renderRightBanner = (banner?: (typeof activeBanners)[0]) => {
    const isDefault = !banner;
    const imageUrl = isDefault
      ? defaultHero
      : getImageUrl(banner.image?.webView || banner.image?.mobileView || "");

    return (
      <>
        {/* Banner Image with gentle zoom animation */}
        <motion.img
          key={imageUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [1, 1.05] }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1 },
            scale: {
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            },
          }}
          src={imageUrl}
          alt="Premium Food"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultHero) {
              target.src = defaultHero;
            }
          }}
          className="absolute inset-0 w-full h-full object-cover z-0 origin-center"
        />

        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/65 pointer-events-none" />
      </>
    );
  };

  return (
    <section className="relative w-full min-h-[420px] md:min-h-[500px] lg:min-h-[700px] bg-gradient-to-br from-[#0F172A] to-[#111827] overflow-hidden flex flex-col lg:flex-row items-center pt-24 pb-16 lg:py-0">
      {/* Orange Radial Glow behind text */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] lg:w-[40vw] lg:h-[40vw] rounded-full bg-[radial-gradient(circle,_#FF6B00_0%,_transparent_60%)] opacity-15 mix-blend-screen pointer-events-none blur-[60px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center justify-between w-full gap-10 lg:gap-16 z-20">
        {/* LEFT SIDE: Static Hero Content (45%) */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 font-bold text-xs md:text-sm tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-[0_2px_10px_rgba(255,107,0,0.1)]">
              Crafted for Perfection
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              PREMIUM <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] drop-shadow-md">
                CULINARY
              </span>{" "}
              <br className="hidden lg:block" />
              EXPERIENCE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-[#9CA3AF] text-lg md:text-xl font-medium mb-10 max-w-lg leading-relaxed">
              Discover freshly prepared meals crafted with premium ingredients
              and delivered directly to your doorstep.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4"
          >
            <Button
              className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#E65C00] text-white px-8 py-7 rounded-[14px] text-[17px] font-bold transition-all shadow-[0_8px_25px_rgba(255,107,0,0.3)] hover:shadow-[0_12px_35px_rgba(255,107,0,0.4)] hover:-translate-y-1 border-0"
              onClick={() => {
                navigate('/products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Explore Products
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:text-white px-8 py-7 rounded-[14px] text-[17px] font-bold transition-all hover:-translate-y-1"
            >
              View Menu
            </Button>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Dynamic Banner Carousel (55%) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[55%] flex justify-end relative z-20 mt-12 lg:mt-0"
        >
          <div
            className="relative w-full h-[280px] md:h-[500px] lg:h-[650px] rounded-[30px] group overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-shadow duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={currentIndex} className="absolute inset-0">
                {renderRightBanner(currentBanner)}
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            {hasBanners && activeBanners.length > 1 && (
              <>
                {/* Arrows */}
                <div className="absolute inset-y-0 left-4 z-40 flex items-center justify-start pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#FF6B00] hover:scale-110 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-4 z-40 flex items-center justify-end pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#FF6B00] hover:scale-110 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-0 right-0 z-40 flex items-center justify-center gap-2 pointer-events-none">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 pointer-events-auto shadow-sm",
                        idx === currentIndex
                          ? "w-8 bg-[#FF6B00]"
                          : "w-2 bg-white/40 hover:bg-white/80",
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Static Badges & Content overlaid securely inside the card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 md:p-8"
            >
              {/* TOP ROW */}
              <div className="flex items-start justify-between w-full">
                {/* Top Left Badge */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] sm:text-xs tracking-wider px-3 sm:px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 sm:gap-2">
                  <span className="text-sm">🔥</span> LIMITED OFFER
                </div>
                
                {/* Top Right Badge */}
                <div className="bg-[#FF6B00] text-white font-bold text-[10px] sm:text-xs tracking-wider px-3 sm:px-4 py-2 rounded-full shadow-md">
                  50% OFF
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full gap-4">
                {/* Bottom Left */}
                <div className="text-white flex flex-col items-start">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-2">
                    Premium Dining
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1 drop-shadow-md leading-tight">
                    Freshly Prepared Every Day
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                    <span className="text-[#FFB800] tracking-widest drop-shadow-sm">★★★★★</span>
                    <span className="drop-shadow-sm">4.9</span>
                  </div>
                </div>

                {/* Bottom Right */}
                <div className="flex flex-col items-start sm:items-end pointer-events-auto">
                  <Button 
                    className="bg-[#FF6B00] hover:bg-[#E65C00] text-white px-6 sm:px-8 py-5 sm:py-6 rounded-full text-xs sm:text-sm font-bold transition-all shadow-[0_8px_20px_rgba(255,107,0,0.4)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.5)] group mb-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('product-menu')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Order Now <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Button>
                  <span className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider drop-shadow-sm ml-2 sm:ml-0">
                    30 min delivery
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom gradient to blend with the next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
};
