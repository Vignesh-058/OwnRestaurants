import { motion } from 'framer-motion';
import { Truck, Leaf, ShieldCheck, Heart } from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Fast Delivery',
      description: 'Fresh food delivered quickly.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Fresh Ingredients',
      description: 'Prepared using quality ingredients.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Secure Payments',
      description: 'Safe and reliable payment methods.'
    },
    {
      icon: <Heart className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Trusted by Customers',
      description: 'Thousands of happy customers.'
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight mb-4">
            Why Choose Us
          </h2>
          <div className="w-24 h-1.5 bg-[#FF6B00] mx-auto rounded-full mb-6" />
          <p className="text-[#64748B] text-lg font-medium max-w-2xl mx-auto">
            We are committed to providing you with the best culinary experience.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[24px] p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-[#FF6B00]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-6 group-hover:bg-[#FF6B00] transition-colors duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#FF6B00] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
