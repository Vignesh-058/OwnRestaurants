import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useBanners } from '@/hooks/queries/useBanners';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useNavigate } from 'react-router-dom';
import ENV from '@/config/env';

export const PromotionalBanner = () => {
  const navigate = useNavigate();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const belongsTo = organization?._id || "";
  const outletId = selectedOutlet?._id || "";

  const { data: banners, isLoading } = useBanners(belongsTo, outletId);
  
  // Find a banner specifically meant for promo/discount, or just use the last active banner as a fallback
  let promoBanner = banners?.find(b => b.active && (b.type === 'promo' || b.type === 'discountBanner')) 
    || banners?.filter(b => b.active).pop();

  if (!promoBanner) {
    promoBanner = {
      title: "Midnight Craving? We deliver till 3 AM!",
      subtitle: "NIGHT OWL SPECIAL",
      description: "Get 20% off on all midnight orders. Satisfy your cravings with our premium late-night menu.",
      buttonText: "Order Late Night",
      image: { webView: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=1200" },
      active: true
    } as any;
  }

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith("http")) return path;
    const baseUrl = ENV.API_BASE_URL || ENV.BANNER_API?.replace("/banner", "") || "";
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  const imgUrl = getImageUrl(promoBanner.image?.webView || promoBanner.image?.mobileView);

  const handleBannerClick = () => {
    if (promoBanner.buttonLink) {
      if (promoBanner.buttonLink.startsWith('http')) {
        window.open(promoBanner.buttonLink, '_blank');
      } else {
        navigate(promoBanner.buttonLink);
      }
    } else {
      navigate('/products');
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] overflow-hidden bg-[#111827] shadow-2xl flex flex-col md:flex-row min-h-[450px]"
        >
          {/* Text Content */}
          <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative z-10 order-2 md:order-1">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#FF6B00]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative">
              {promoBanner.subtitle && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] font-bold text-xs tracking-widest uppercase mb-6 w-fit border border-[#FF6B00]/30">
                  {promoBanner.subtitle}
                </span>
              )}
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                {promoBanner.title || "Experience Premium Dining"}
              </h2>
              
              <p className="text-[#94A3B8] text-lg mb-10 leading-relaxed max-w-md">
                {promoBanner.description || "Treat yourself to an extraordinary culinary journey. Order now and discover your new favorite dish."}
              </p>
              
              <Button 
                className="bg-[#FF6B00] hover:bg-[#E65C00] text-white h-14 px-8 rounded-full text-lg font-bold w-fit shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:-translate-y-1 transition-all group flex items-center gap-3"
                onClick={handleBannerClick}
              >
                {promoBanner.buttonText || "Order Now"} 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="w-full md:w-1/2 relative order-1 md:order-2 min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/80 to-transparent z-10 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent z-10 md:hidden" />
            <img 
              src={imgUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80"} 
              alt={promoBanner.title || "Promotional Offer"} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};
