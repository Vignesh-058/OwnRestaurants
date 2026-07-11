import { Link } from 'react-router-dom';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { MapPin, Phone, Mail, Clock, ShoppingCart } from 'lucide-react';

export const Footer = () => {
 const organization = useOrganizationStore((state) => state.organization);
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 
 if (!organization) return null;

 const currentYear = new Date().getFullYear();

 return (
 <footer className="w-full bg-white/78 dark:bg-slate-900/78 backdrop-blur-[22px] pt-20 pb-10 mt-auto border-t border-border/80 dark:border-white/10 rounded-t-[40px] px-4 md:px-10">
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
 
 {/* Brand & Description */}
 <div className="flex flex-col space-y-6 lg:col-span-1">
 <div className="flex items-center gap-3">
 <div className="h-11 w-11 bg-primary-gradient rounded-xl flex items-center justify-center shadow-md shadow-primary/20 overflow-hidden">
 <ShoppingCart className="h-5 w-5 text-white stroke-[2.5]" />
 </div>
 <span className="font-extrabold text-2xl tracking-tight text-foreground">
 Own Restaurant
 </span>
 </div>
 <p className="text-muted-foreground leading-relaxed max-w-sm text-sm font-medium">
 Own Restaurant is a premium multi-restaurant ordering platform delivering delicious gourmet food, quick meals, and fresh bakes straight to your doorstep from top-rated local outlets.
 </p>
 </div>

 {/* Quick Links */}
 <div className="flex flex-col space-y-4 text-sm font-medium">
 <h4 className="font-bold text-lg text-foreground mb-2">Quick Links</h4>
 <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
 <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">My Cart</Link>
 <Link to="/wishlist" className="text-muted-foreground hover:text-primary transition-colors">Wishlist</Link>
 <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">My Account</Link>
 </div>

 {/* Contact Info */}
 <div className="flex flex-col space-y-4 text-sm font-medium">
 <h4 className="font-bold text-lg text-foreground mb-2">Contact Us</h4>
 
 {(selectedOutlet?.outletDetails?.contact || organization.phone) && (
 <a href={`tel:${selectedOutlet?.outletDetails?.contact || organization.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
 <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-primary/10 flex items-center justify-center shrink-0">
 <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
 </div>
 <span>{selectedOutlet?.outletDetails?.contact || organization.phone}</span>
 </a>
 )}

 {organization.email && (
 <a href={`mailto:${organization.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
 <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-primary/10 flex items-center justify-center shrink-0">
 <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
 </div>
 <span>{organization.email}</span>
 </a>
 )}

 {(selectedOutlet?.address || selectedOutlet?.outletDetails?.address) && (
 <div className="flex items-start gap-3 text-muted-foreground group mt-2">
 <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-1">
 <MapPin className="h-4 w-4 text-muted-foreground" />
 </div>
 <span className="leading-relaxed">
 {selectedOutlet.address || selectedOutlet.outletDetails?.address}
 </span>
 </div>
 )}
 </div>

 {/* Working Hours */}
 <div className="flex flex-col space-y-4 text-sm font-medium">
 <h4 className="font-bold text-lg text-foreground mb-2">Working Hours</h4>
 {selectedOutlet?.wh?.isHolidayMode ? (
 <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20">
 <span className="font-bold">Currently closed for holidays</span>
 </div>
 ) : selectedOutlet?.wh?.days?.[0]?.times?.[0] ? (
 <div className="flex items-start gap-3 text-muted-foreground">
 <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-1">
 <Clock className="h-4 w-4 text-muted-foreground" />
 </div>
 <div className="flex flex-col">
 <span className="font-bold text-foreground mb-1">Open Daily</span>
 <span>{selectedOutlet.wh.days[0].times[0].from} - {selectedOutlet.wh.days[0].times[0].to}</span>
 </div>
 </div>
 ) : (
 <p className="text-muted-foreground">Open Daily: 9:00 AM - 10:00 PM</p>
 )}
 </div>

 </div>

 {/* Bottom Bar */}
 <div className="border-t border-border/80 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
 <p className="text-muted-foreground text-sm font-medium">
 &copy; {currentYear} Own Restaurant. All rights reserved.
 </p>
 <div className="flex gap-6 text-sm font-medium">
 <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
 <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
 </div>
 </div>
 </div>
 </footer>
 );
};
