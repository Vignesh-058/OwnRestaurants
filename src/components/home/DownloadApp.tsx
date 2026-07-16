import { motion } from 'framer-motion';
import { Apple, Play } from 'lucide-react';

export const DownloadApp = () => {
  return (
    <section className="py-20 md:py-28 bg-primary overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left - Phone Mockups */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center lg:justify-end order-2 lg:order-1"
          >
            <div className="relative w-[280px] md:w-[320px] h-full">
              {/* Using a placeholder for a phone mockup */}
              <div className="absolute top-10 right-10 w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-background rounded-[40px] shadow-2xl border-[8px] border-foreground overflow-hidden rotate-12 origin-bottom-right z-0 opacity-50">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                  alt="App Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-0 left-0 w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-background rounded-[40px] shadow-2xl border-[8px] border-foreground overflow-hidden -rotate-6 origin-bottom-left z-10">
                <img 
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80" 
                  alt="App Interface" 
                  className="w-full h-full object-cover"
                />
                {/* Fake UI Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="w-12 h-1.5 bg-white/50 rounded-full mx-auto mb-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary-foreground order-1 lg:order-2 text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Get the Best <br className="hidden lg:block"/>
              Experience
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Download our mobile app to track your orders in real-time, get exclusive app-only discounts, and reorder your favorites with a single tap.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 rounded-[20px] hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto min-w-[200px]">
                <Apple className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-background/70 font-extrabold">Download on the</div>
                  <div className="text-lg font-extrabold leading-tight">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center gap-3 bg-background text-foreground px-8 py-4 rounded-[20px] hover:bg-muted hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto min-w-[200px]">
                <Play className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-foreground/70 font-extrabold">GET IT ON</div>
                  <div className="text-lg font-extrabold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
