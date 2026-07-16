import { useCoupons } from '@/hooks/queries/useCoupons';
import { motion } from 'framer-motion';
import { Ticket, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const TodaysOffers = () => {
  const { data: coupons = [], isLoading } = useCoupons();

  // Filter active coupons if necessary, assuming the hook returns active ones or checking isActive
  const activeCoupons = coupons.filter(c => c.isActive !== false && c.status !== 'Expired' && c.status !== 'Disabled');

  if (isLoading || !activeCoupons || activeCoupons.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 capitalize">
              Today's Special Offers
            </h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mb-6" />
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              Grab these exclusive deals before they expire and enjoy premium meals at a fraction of the cost.
            </p>
          </div>
          <button className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all" onClick={() => {
            const el = document.getElementById('product-menu');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            View All Offers <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCoupons.slice(0, 3).map((coupon, idx) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-card border border-border rounded-2xl p-8 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Background Decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div className="bg-foreground text-background px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                  {coupon.code}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {coupon.name || `${coupon.discountValue}${coupon.discountType === 'Percentage' ? '%' : '₹'} OFF`}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 h-10 line-clamp-2">
                  {coupon.description || `Get ${coupon.discountValue}${coupon.discountType === 'Percentage' ? '%' : '₹'} off on your order.`}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-6">
                  {coupon.validTill || coupon.expiryDate ? (
                    <div className="flex items-center text-xs font-bold text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1.5" />
                      Valid till {format(new Date(coupon.validTill || coupon.expiryDate!), 'MMM dd, yyyy')}
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-green-500">Valid Anytime</div>
                  )}
                  
                  <button className="text-primary font-bold text-sm uppercase tracking-widest relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:origin-left">
                    Shop Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
