import { motion } from 'framer-motion';
import defaultImage from '@/assets/hero.png';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Explore Menu',
      description: 'Browse our extensive menu of premium dishes and add your favorites to the cart.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'
    },
    {
      number: '02',
      title: 'Seamless Ordering',
      description: 'Checkout securely with multiple payment options and apply exciting offers.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80'
    },
    {
      number: '03',
      title: 'Enjoy Fresh',
      description: 'Relax while our chefs prepare your meal and deliver it piping hot to your door.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Get your favorite meals delivered to your doorstep in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-8 relative border-4 border-[#111827] shadow-[0_0_0_2px_rgba(255,107,0,0.3)] group-hover:shadow-[0_0_0_4px_rgba(255,107,0,1)] transition-all duration-300">
                <img 
                  src={step.image} 
                  alt={step.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== defaultImage) {
                      console.warn(`Failed to load HowItWorks image: ${step.image}`);
                      target.src = defaultImage;
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-[#94A3B8] text-[15px] leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
