import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import defaultBanner from '@/assets/hero.png';

export const PromotionalBanner = () => {
  const [imgSrc, setImgSrc] = useState("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80");
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleError = () => {
    console.warn(`Failed to load promotional banner image from: ${imgSrc}. Falling back to default banner.`);
    setImgSrc(defaultBanner);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#FF6B00] to-[#E65C00] text-white shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-stretch">
            
            {/* Image Side */}
            <div className="w-full md:w-1/2 min-h-[300px] bg-[#E65C00]/30 relative overflow-hidden">
              <img 
                src={imgSrc} 
                alt="Delicious meal" 
                onError={handleError}
                onLoad={() => setImgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
              />
            </div>
            
            {/* Text Side */}
            <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-20 text-center md:text-left flex flex-col justify-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white font-bold text-sm tracking-wide uppercase mb-6 w-fit mx-auto md:mx-0">
                Limited Time Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Beyond Ordinary <br/> Dining Experience
              </h2>
              <p className="text-white/90 text-lg mb-10 leading-relaxed max-w-md mx-auto md:mx-0">
                Discover fresher flavors, better balance, and an authentic culinary journey right at your home.
              </p>
              
              <Button 
                className="bg-[#111827] hover:bg-[#1f2937] text-white h-14 px-8 rounded-full text-lg font-bold w-fit mx-auto md:mx-0 shadow-lg hover:shadow-xl transition-all group flex items-center gap-3"
                onClick={() => {
                  document.getElementById('product-menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Order Now 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
};
