import { motion } from 'framer-motion';
import { Leaf, Clock, Award, ShieldCheck } from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Premium Quality',
      description: 'Crafted from the finest ingredients to ensure a superior taste experience.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Freshly Prepared',
      description: 'Every order is prepared fresh on demand by our expert chefs.'
    },
    {
      icon: <Clock className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Fast Delivery',
      description: 'Lightning-fast delivery ensures your food arrives hot and fresh.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#FF6B00]" />,
      title: 'Hygiene Assured',
      description: 'We follow strict hygiene protocols for your safety and health.'
    }
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight mb-6">
              WHY CHOOSE <br/>
              <span className="text-[#FF6B00]">IEYAL?</span>
            </h2>
            <p className="text-[#64748B] text-lg mb-10 leading-relaxed">
              Whether you're hosting friends, planning a house party, or simply relaxing after a long day, IEYAL helps you create delicious moments in minutes.
            </p>
            
            <div className="space-y-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="shrink-0 w-14 h-14 rounded-[16px] bg-[#FFF7ED] flex items-center justify-center border border-[rgba(255,107,0,0.1)]">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827] mb-1">{feature.title}</h3>
                    <p className="text-[#64748B] text-[15px]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[600px] rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80')" }}
            />
            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[20px]">
                <p className="text-white font-bold text-lg">"The best culinary experience in town. Unmatched quality and taste!"</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
