import { motion } from 'framer-motion';
import { Search, ShoppingCart, CreditCard, Smile } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Browse Products',
      description: 'Explore our premium selection and customize your favorite dishes.',
      icon: <Search className="w-8 h-8 text-[#FF6B00]" />
    },
    {
      number: '2',
      title: 'Add to Cart',
      description: 'Review your order, apply offers, and add to your cart.',
      icon: <ShoppingCart className="w-8 h-8 text-[#FF6B00]" />
    },
    {
      number: '3',
      title: 'Secure Checkout',
      description: 'Checkout in seconds with our secure and reliable payment methods.',
      icon: <CreditCard className="w-8 h-8 text-[#FF6B00]" />
    },
    {
      number: '4',
      title: 'Enjoy Your Meal',
      description: 'Relax while we prepare your meal and deliver it piping hot.',
      icon: <Smile className="w-8 h-8 text-[#FF6B00]" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight mb-4 capitalize">
            How It Works
          </h2>
          <div className="w-24 h-1.5 bg-[#FF6B00] mx-auto rounded-full mb-6" />
          <p className="text-[#64748B] text-lg font-medium max-w-2xl mx-auto">
            Get your favorite premium meals delivered to your doorstep in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[40px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent z-0" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Icon Container with Badge */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center shadow-sm group-hover:border-[#FF6B00] group-hover:shadow-[0_10px_30px_rgba(255,107,0,0.2)] transition-all duration-300 bg-[#F8FAFC]">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-[#111827] mb-3 group-hover:text-[#FF6B00] transition-colors">{step.title}</h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
