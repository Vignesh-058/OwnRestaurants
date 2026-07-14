import { Link } from 'react-router-dom';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { 
  MapPin, Phone, Mail, Clock
} from 'lucide-react';
import defaultLogo from '@/assets/Ieyal Logo.jpeg';

export const Footer = () => {
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  
  if (!organization) return null;

  const currentYear = new Date().getFullYear();
  const phone = selectedOutlet?.outletDetails?.contact || organization.phoneNo || '+91 XXXXX XXXXX';
  const email = organization.email || 'support@ieyalsolutions.com';
  const address = selectedOutlet?.address || selectedOutlet?.outletDetails?.address || 'Thiruvarur, Tamil Nadu';
  
  let workingHours = 'Mon - Sun, 9:00 AM - 10:00 PM';
  if (selectedOutlet?.wh?.isHolidayMode) {
    workingHours = 'Currently closed for holidays';
  } else if (selectedOutlet?.wh?.days?.[0]?.times?.[0]) {
    workingHours = `Mon - Sun, ${selectedOutlet.wh.days[0].times[0].from} - ${selectedOutlet.wh.days[0].times[0].to}`;
  }

  // Helper for animated links
  const AnimatedLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to} 
      className="group relative text-[#94A3B8] hover:text-[#FF6B00] transition-colors duration-300 w-fit inline-block"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF6B00] transition-all duration-300 group-hover:w-full rounded-full" />
    </Link>
  );

  return (
    <footer className="w-full bg-[#111827] pt-12 pb-8 mt-auto border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Main Grid: 1 col on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-10 text-center md:text-left">
          
          {/* Section 1: Brand & Description */}
          <div className="flex flex-col space-y-4 items-center md:items-start">
            <div className="flex items-center gap-3">
              <img src={defaultLogo} alt="IEYAL Solutions" className="h-10 w-10 object-contain drop-shadow-lg rounded-xl" />
              <span className="font-black text-xl tracking-tight text-white">
                {organization.brandName || 'IEYAL Solutions'}
              </span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed max-w-sm text-[14px] font-medium">
              Premium online food ordering platform delivering delicious meals directly to your doorstep.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-[16px] text-white mb-1">Quick Links</h4>
            <div className="grid grid-cols-2 gap-y-3 text-[14px]">
              <div className="flex flex-col space-y-3 items-center md:items-start">
                <AnimatedLink to="/">Home</AnimatedLink>
                <AnimatedLink to="/products">Products</AnimatedLink>
                <AnimatedLink to="/offers">Offers</AnimatedLink>
              </div>
              <div className="flex flex-col space-y-3 items-center md:items-start">
                <AnimatedLink to="/privacy">Privacy Policy</AnimatedLink>
                <AnimatedLink to="/terms">Terms & Conditions</AnimatedLink>
                <AnimatedLink to="/contact">Contact Support</AnimatedLink>
              </div>
            </div>
          </div>

          {/* Section 3: Contact Info */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-[16px] text-white mb-1">Contact Us</h4>
            <div className="flex flex-col space-y-3 text-[#94A3B8] text-[14px] items-center md:items-start">
              <div className="flex items-start gap-2 group">
                <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <span className="text-left leading-tight group-hover:text-white transition-colors">{address}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Phone className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="group-hover:text-white transition-colors">{phone}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="group-hover:text-white transition-colors break-all">{email}</span>
              </div>
              <div className="flex items-start gap-2 group">
                <Clock className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <span className="text-left leading-tight group-hover:text-white transition-colors">{workingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/5 mb-6" />

        {/* Bottom Bar with Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-[#94A3B8] text-[13px] font-medium">
            &copy; {currentYear} {organization.brandName || 'IEYAL Solutions'}. All Rights Reserved.
          </p>
          
          {/* Social Media Minified */}
          <div className="flex items-center gap-3">
            {[
              { name: 'Facebook', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { name: 'Instagram', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
              { name: 'Twitter', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href="#" 
                title={social.name}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#94A3B8] hover:bg-[#FF6B00] hover:text-white transition-all duration-300 shadow-sm [&>svg]:w-3.5 [&>svg]:h-3.5"
              >
                {social.svg}
              </a>
            ))}
          </div>

          <p className="text-[#94A3B8] text-[13px] font-medium hidden md:block">
            Made with <span className="text-red-500">❤️</span> for better food ordering.
          </p>
        </div>

      </div>
    </footer>
  );
};
