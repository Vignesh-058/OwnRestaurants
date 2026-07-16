import { motion } from 'framer-motion';
import { Truck, Leaf, ShieldCheck, Heart } from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: 'Fast Delivery',
      description: 'Fresh food delivered quickly.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: 'Fresh Ingredients',
      description: 'Prepared using quality ingredients.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'Secure Payments',
      description: 'Safe and reliable payment methods.'
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: 'Trusted by Customers',
      description: 'Thousands of happy customers.'
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-muted border-y border-border/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Why Choose Us
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
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
              className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <div className="group-hover:text-primary-foreground transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
