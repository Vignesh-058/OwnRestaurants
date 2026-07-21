import { useCoupons } from '@/hooks/queries/useCoupons';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Pizza, Leaf, Croissant } from 'lucide-react';
import { format } from 'date-fns';

const foodImages = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
];

export const TodaysOffers = () => {
  const { data: coupons = [], isLoading } = useCoupons();

  const activeCoupons = coupons.filter(c => c.isActive !== false && c.status !== 'Expired' && c.status !== 'Disabled');

  if (isLoading || !activeCoupons || activeCoupons.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="py-10 md:py-16 bg-background border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#1e1b4b] tracking-tight mb-1.5 md:mb-2 capitalize leading-tight">
              Today's Special Offers
            </h2>
            <div className="w-12 md:w-20 h-1.5 md:h-2 bg-primary rounded-full mb-2 md:mb-4" />
            <p className="text-muted-foreground text-[14px] md:text-[17px] font-medium max-w-2xl">
              Grab these exclusive deals before they expire and enjoy premium meals at a fraction of the cost.
            </p>
          </div>
          <button className="text-primary font-extrabold text-[12px] md:text-[13px] uppercase tracking-widest flex items-center gap-1.5 md:gap-2 hover:gap-2 md:hover:gap-3 transition-all pb-1 md:pb-0" onClick={() => {
            const el = document.getElementById('product-menu');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            <span className="hidden sm:inline">VIEW ALL OFFERS</span>
            <span className="sm:hidden">VIEW ALL</span>
            <ArrowRight className="w-4 h-4 md:w-4 md:h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCoupons.slice(0, 3).map((coupon, idx) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative rounded-[20px] h-[260px] overflow-hidden shadow-lg group cursor-pointer border border-[#F0EBE1]"
            >
              {/* Left Background Image */}
              <img 
                src={foodImages[idx % foodImages.length]} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Offer" 
              />
              
              {/* Dark Gradient over image for text readability */}
              <div className="absolute inset-0 w-[50%] bg-gradient-to-r from-black/80 to-transparent" />
              
              {/* Logo / Icon on the left */}
              <div className="absolute top-6 left-6 flex flex-col items-center">
                 <div className="text-white mb-1"><Utensils className="w-7 h-7" strokeWidth={1.5} /></div>
                 <span className="text-white text-[11px] font-extrabold tracking-widest uppercase">YOUR LOGO</span>
              </div>

              {/* Right Overlay container */}
              <div className="absolute inset-y-0 right-0 w-[55%] flex">
                {/* The Wave SVG */}
                <div className="w-[60px] h-full shrink-0 -mr-[1px] relative z-10">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 drop-shadow-[-5px_0_15px_rgba(0,0,0,0.1)]">
                    {/* Red Wave (slightly wider/shifted left) */}
                    <path d="M100,0 C-10,25 70,75 100,100 Z" fill="#F04F4F" transform="translate(-4, 0)" />
                    {/* Beige Wave */}
                    <path d="M100,0 C-10,25 70,75 100,100 Z" fill="#FFF7ED" />
                  </svg>
                </div>

                {/* Right Content Background */}
                <div className="flex-1 bg-[#FFF7ED] py-5 pr-5 flex flex-col items-center justify-center text-center relative z-10 border-r border-[#F0EBE1]">
                  
                  {/* Faint Background doodles */}
                  <div className="absolute top-3 right-3 text-[#F04F4F]/10 rotate-[15deg]"><Pizza className="w-8 h-8" /></div>
                  <div className="absolute bottom-4 left-0 text-[#F04F4F]/10 -rotate-12"><Croissant className="w-7 h-7" /></div>
                  <div className="absolute bottom-12 right-4 text-[#F04F4F]/10 rotate-45"><Leaf className="w-6 h-6" /></div>

                  <h3 className="text-[26px] xl:text-[28px] font-black text-[#F04F4F] leading-[1.1] mb-2 drop-shadow-sm px-2">
                    {coupon.name || (coupon.discountValue ? `${coupon.discountValue}${coupon.discountType === 'Percentage' ? '%' : '₹'} OFF` : 'Discount')}
                  </h3>
                  
                  <p className="text-[#A07C70] text-[12px] font-medium leading-relaxed mb-4 line-clamp-3 px-1">
                    {coupon.description || `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.`}
                  </p>
                  
                  <div className="mt-auto flex flex-col items-center">
                     <div className="text-[#F04F4F] font-extrabold text-[14px]">
                       {coupon.code ? `CODE: ${coupon.code}` : 'NO CODE REQUIRED'}
                     </div>
                     <div className="text-[#F04F4F] font-bold text-[12px] mt-0.5">
                       {coupon.validTill || coupon.expiryDate ? format(new Date(coupon.validTill || coupon.expiryDate!), 'EEEE, dd MMM yyyy') : 'Valid Anytime'}
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
