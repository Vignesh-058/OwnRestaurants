import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { MapPin, Phone, Mail, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const RestaurantInfo = () => {
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  if (!organization || !selectedOutlet) return null;

  return (
    <section id="restaurant-info" className="py-20 md:py-28 bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight mb-4 capitalize">
            About {organization.name}
          </h2>
          <div className="w-24 h-1.5 bg-[#FF6B00] mx-auto rounded-full mb-6" />
          <p className="text-[#64748B] text-lg font-medium max-w-3xl mx-auto">
            {organization.description || "Discover the passion and quality behind every meal we serve."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content - Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-black text-[#111827] mb-8 flex items-center gap-3">
                <Info className="w-6 h-6 text-[#FF6B00]" />
                Contact & Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] shrink-0">
                    <MapPin className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] mb-1">Address</h4>
                    <p className="text-[#64748B] text-sm leading-relaxed">
                      {selectedOutlet.address || 'Address not available'}
                      {selectedOutlet.city && `, ${selectedOutlet.city}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] shrink-0">
                    <Phone className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] mb-1">Phone</h4>
                    <p className="text-[#64748B] text-sm">
                      {selectedOutlet.phone || organization.phone || 'Phone not available'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] shrink-0">
                    <Mail className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] mb-1">Email</h4>
                    <p className="text-[#64748B] text-sm">
                      {selectedOutlet.email || organization.email || 'Email not available'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB] shrink-0">
                    <Clock className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] mb-1">Opening Hours</h4>
                    <p className="text-[#64748B] text-sm">
                      {selectedOutlet.openingTime || '09:00 AM'} - {selectedOutlet.closingTime || '10:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <div className="w-full h-[400px] lg:h-full min-h-[400px] bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-sm relative group">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-[#E2E8F0] flex flex-col items-center justify-center text-[#94A3B8]">
                <MapPin className="w-16 h-16 mb-4 text-[#CBD5E1]" />
                <span className="font-bold text-lg">Google Maps</span>
                <span className="text-sm">Location Preview</span>
              </div>
              
              {/* Overlay on hover for interactions */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-[#111827] font-bold px-6 py-3 rounded-full shadow-lg hover:text-[#FF6B00] transition-colors border border-[#E5E7EB]">
                  Get Directions
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
