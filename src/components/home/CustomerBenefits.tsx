import { motion } from 'framer-motion';
import { Truck, Utensils, Shield, Tag, Map, Headphones } from 'lucide-react';

export const CustomerBenefits = () => {
  const benefits = [
    {
      icon: <Truck className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Lightning Fast Delivery',
      description: 'Your food arrives hot and fresh, right when you expect it.'
    },
    {
      icon: <Utensils className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Fresh & Premium Food',
      description: 'We use only the finest ingredients for an unforgettable taste.'
    },
    {
      icon: <Shield className="w-8 h-8 text-[#FF6B00]" />,
      title: '100% Secure Checkout',
      description: 'Multiple payment options with bank-grade security protocols.'
    },
    {
      icon: <Tag className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Exclusive Discounts',
      description: 'Enjoy daily offers, combo deals, and special rewards.'
    },
    {
      icon: <Map className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Live Order Tracking',
      description: 'Watch your order travel from our kitchen to your door.'
    },
    {
      icon: <Headphones className="w-8 h-8 text-[#FF6B00]" />,
      title: '24/7 Customer Support',
      description: 'We are always here to help with any questions or concerns.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight mb-4 capitalize">
            Customer Benefits
          </h2>
          <div className="w-24 h-1.5 bg-[#FF6B00] mx-auto rounded-full mb-6" />
          <p className="text-[#64748B] text-lg font-medium max-w-2xl mx-auto">
            Experience the ultimate convenience and premium service every time you order with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[24px] p-8 flex flex-col md:flex-row gap-6 items-start group hover:border-[#FF6B00]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-[20px] bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:border-[#FF6B00]/50 transition-all duration-300">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#FF6B00] transition-colors">{benefit.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
