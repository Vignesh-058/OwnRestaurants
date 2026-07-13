import { motion } from 'framer-motion';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const AboutSection = () => {
  const organization = useOrganizationStore((state) => state.organization);

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-16 bg-[#E5E7EB]" />
            <h2 className="text-2xl font-bold text-[#111827] uppercase tracking-widest">
              About {organization?.name || 'IEYAL'}
            </h2>
            <div className="h-[1px] w-16 bg-[#E5E7EB]" />
          </div>

          <p className="text-[#64748B] text-[15px] md:text-[17px] leading-relaxed mb-6 font-medium">
            At {organization?.name || 'IEYAL Solutions'}, we are passionate about bringing the finest culinary experiences directly to your dining table. Our journey started with a simple belief: that everyone deserves access to restaurant-quality food, prepared with love and the freshest ingredients, without stepping out of their homes.
          </p>

          <p className="text-[#64748B] text-[15px] md:text-[17px] leading-relaxed mb-10 font-medium">
            We partner with master chefs and source premium local ingredients to craft a diverse menu that caters to every craving. Whether you are seeking a comforting classic or an adventurous new flavor, our commitment to quality, hygiene, and lightning-fast delivery ensures that every bite is perfect.
          </p>

          <button className="text-[#111827] font-bold border-b-2 border-[#111827] pb-1 hover:text-[#FF6B00] hover:border-[#FF6B00] transition-colors">
            Read Our Story
          </button>
        </motion.div>
      </div>
    </section>
  );
};
