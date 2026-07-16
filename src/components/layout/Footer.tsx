import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { 
  MapPin, Phone, Mail, Clock
} from 'lucide-react';
import defaultLogo from '@/assets/Ieyal Logo.jpeg';

export const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  
  if (!organization) return null;

  const currentYear = new Date().getFullYear();
  const footerConfig = organization?.theme?.config?.footer?.config;
  const phone = footerConfig?.phone || selectedOutlet?.outletDetails?.contact || organization.phoneNo;
  const email = footerConfig?.email || organization.email;
  const address = footerConfig?.address || selectedOutlet?.address || selectedOutlet?.outletDetails?.address || organization.city;
  
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
      className="group relative text-muted-foreground hover:text-primary transition-colors duration-300 w-fit inline-block font-medium"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
    </Link>
  );

  return (
    <footer className={cn(
      "w-full bg-card pb-12 mt-auto shadow-[0_-4px_24px_rgba(0,0,0,0.02)]",
      isHomePage ? "pt-12" : "pt-24 border-t border-border"
    )}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        
        {/* Main Grid: 1 col on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-16 text-center md:text-left">
          
          {/* Section 1: Brand & Description */}
          <div className="flex flex-col space-y-5 items-center md:items-start">
            <div className="flex items-center gap-3">
              <img src={organization.logoImage || defaultLogo} alt={organization.brandName || organization.name} className="h-12 w-12 object-contain drop-shadow-sm rounded-xl bg-background border border-border p-1" />
              <span className="font-extrabold text-2xl tracking-tight text-foreground">
                {organization.brandName || organization.name || 'IEYAL Solutions'}
              </span>
            </div>
            {organization?.theme?.config?.footer?.config?.description && (
              <p className="text-muted-foreground leading-relaxed max-w-sm text-[15px] font-medium">
                {organization.theme.config.footer.config.description}
              </p>
            )}
          </div>

          {/* Section 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-[18px] text-foreground mb-2">Quick Links</h4>
            <div className="grid grid-cols-2 gap-y-4 text-[15px]">
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
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-[18px] text-foreground mb-2">Contact Us</h4>
            <div className="flex flex-col space-y-4 text-muted-foreground text-[15px] items-center md:items-start font-medium">
              {address && (
                <div className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-left leading-tight group-hover:text-foreground transition-colors">{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3 group">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="group-hover:text-foreground transition-colors">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3 group">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span className="group-hover:text-foreground transition-colors break-all">{email}</span>
                </div>
              )}
              {workingHours && (
                <div className="flex items-start gap-3 group">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-left leading-tight group-hover:text-foreground transition-colors">{workingHours}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-border mb-8" />

        {/* Bottom Bar with Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left mt-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-muted-foreground text-[14px] font-medium">
              &copy; {currentYear} {organization.brandName || organization.name || ""}. All Rights Reserved.
            </p>
            <p className="text-muted-foreground/70 text-[13px]">
              Powered by <span className="font-bold text-foreground">IEYAL</span>
            </p>
          </div>
          
          {/* Social Media Minified */}
          <div className="flex items-center gap-3">
            {([
              footerConfig?.facebook && { name: 'Facebook', url: footerConfig.facebook, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              footerConfig?.instagram && { name: 'Instagram', url: footerConfig.instagram, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
              footerConfig?.twitter && { name: 'Twitter', url: footerConfig.twitter, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              footerConfig?.youtube && { name: 'YouTube', url: footerConfig.youtube, svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.084 0 12 0 12s0 3.916.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.916 24 12 24 12s0-3.916-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> }
            ].filter(Boolean) as any[]).map((social, idx) => (
              <a 
                key={idx} 
                href={social.url || "#"} target="_blank" rel="noopener noreferrer" 
                title={social.name}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm [&>svg]:w-4 [&>svg]:h-4"
              >
                {social.svg}
              </a>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
};
