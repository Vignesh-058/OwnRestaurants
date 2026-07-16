import { useOrganizationStore } from '@/store/OrganizationStore';

export const AboutUs = () => {
  const organization = useOrganizationStore((state) => state.organization);
  const brandName = organization?.name || 'Tositos';

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <h2 className="text-xl md:text-2xl font-black tracking-widest text-foreground uppercase mb-8">
          ABOUT {brandName} RESTAURANT
        </h2>
        
        <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-medium">
          <p>
            At {brandName} Restaurant, we are passionate about bringing the finest culinary experiences directly to your dining table. Our journey started with a simple belief: that everyone deserves access to restaurant-quality food, prepared with love and the freshest ingredients, without stepping out of their home.
          </p>
          <p>
            We partner with master chefs and source premium local ingredients to craft a diverse menu that caters to every craving. Whether you are seeking a comforting classic or an adventurous new flavor, our commitment to quality, hygiene, and lightning-fast delivery ensures that every bite is perfect.
          </p>
        </div>

        <div className="mt-12">
          <button className="text-foreground font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-foreground hover:after:bg-primary after:transition-colors">
            Read Our Story
          </button>
        </div>
      </div>
    </section>
  );
};
