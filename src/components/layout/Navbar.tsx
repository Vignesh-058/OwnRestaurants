import { MapPin } from 'lucide-react';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/CartStore";
import { useAuthStore } from "@/store/AuthStore";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import { useOutletModalStore } from "@/store/OutletModalStore";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { cn } from "@/lib/utils";
import defaultLogo from "@/assets/Ieyal Logo.jpeg";

export const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const { grandTotal, cartItemCount } = useCartStore();
  const cartTotal = grandTotal;
  const totalCartQuantity = cartItemCount;

  const { isAuthenticated, user } = useAuthStore();
  const organization = useOrganizationStore((state) => state.organization);
  const currency = organization?.currency || "₹";

  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const openOutletModal = useOutletModalStore((state) => state.openModal);

  const headerConfig = organization?.theme?.config?.header?.config;
  const showCart = (headerConfig?.showCart ?? true) && (organization?.isCartEnabled ?? true);
  const showLocation = headerConfig?.showLocation ?? true;
  const showMenu = headerConfig?.showMenu ?? true;
  const showProfile = headerConfig?.showProfile ?? true;

  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "products", label: "Products", path: "/products" },
    { id: "offers", label: "Offers", path: "/offers" },
    { id: "orders", label: "Orders", path: "/profile/orders" },
  ];

  const activeTabId = (() => {
    if (currentPath.startsWith("/products")) return "products";
    if (currentPath === "/") return "home";
    if (currentPath.startsWith("/offers")) return "offers";
    if (
      currentPath.startsWith("/orders") ||
      currentPath.startsWith("/profile/orders")
    )
      return "orders";
    return "";
  })();

  // Use framer-motion container variants for smooth content transition
  const fadeVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  useEffect(() => {
    if (isAuthenticated) return;

    const handleScroll = () => {
      const sections = ["home", "how-it-works", "features"];
      const headerOffset = 80; // height of navbar
      
      let currentSection = activeSection;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the element is near the top of the viewport (accounting for header)
          if (rect.top <= headerOffset + 150 && rect.bottom >= headerOffset) {
            currentSection = sectionId;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated, activeSection]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("home");
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <motion.header
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn(
        "w-full fixed top-0 left-0 right-0 z-[100] flex items-center bg-background/80 backdrop-blur-xl px-4 md:px-8 xl:px-12 transition-all duration-300",
        isAuthenticated
          ? "h-20 border-b border-border shadow-sm"
          : "h-16 md:h-20 border-b border-border shadow-sm"
      )}
    >
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4 relative">
        {/* LEFT SECTION: Logo & Delivery */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <AnimatePresence mode="wait">
              <motion.button
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="lg:hidden p-1.5 text-foreground hover:bg-muted rounded-md transition-colors -ml-1 overflow-hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 shrink-0" />
              </motion.button>
          </AnimatePresence>

          <Link
            to={isAuthenticated ? "/" : "/"}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                scrollToSection('home');
              }
            }}
            className="flex items-center group"
          >
            <motion.img
              layout
              src={organization?.logoImage || defaultLogo}
              alt={organization?.name || "IEYAL Solutions"}
              className={cn(
                "object-contain drop-shadow-sm transition-transform group-hover:scale-105",
                isAuthenticated
                  ? "w-[36px] h-[36px] md:w-[48px] md:h-[48px] rounded-[10px] md:rounded-[12px]"
                  : "w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded-lg"
              )}
            />
            {!isAuthenticated && organization?.name && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:block ml-3 font-extrabold text-foreground tracking-tight text-lg"
              >
                {organization.name}
              </motion.span>
            )}
          </Link>

          <AnimatePresence mode="wait">
            {isAuthenticated && showLocation && (
              <motion.div 
                variants={fadeVariants}
                initial="hidden" animate="visible" exit="exit"
                className="flex items-center gap-3 lg:gap-4 shrink-0 min-w-0"
              >
                {/* Divider between Logo and Location Card */}
                <div className="hidden md:block w-[1px] h-[40px] bg-border ml-1 mr-1 lg:mx-0"></div>

                {/* Desktop/Laptop/Tablet Location Card */}
                <button
                  onClick={openOutletModal}
                  className="hidden md:flex flex-col items-start justify-center text-left w-[200px] lg:w-[260px] xl:w-[320px] h-[64px] bg-card border border-border rounded-2xl px-3 lg:px-4 py-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group shadow-sm shrink-0"
                >
                  <div className="flex items-center w-full mb-1">
                    <span className="text-[10px] lg:text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary" /> {selectedOutlet ? 'SELECTED OUTLET' : 'SELECT OUTLET'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between min-w-0 w-full">
                    <div className="flex flex-col min-w-0 flex-1 truncate pr-2">
                      {selectedOutlet ? (
                        <>
                          <span className="text-[14px] lg:text-[16px] xl:text-[17px] font-bold text-foreground leading-none truncate mb-0.5">
                            {selectedOutlet.outletName}
                          </span>
                          {(selectedOutlet.outletDetails?.address || selectedOutlet.outletDetails?.city) && (
                            <span className="text-[10px] lg:text-[11px] text-muted-foreground truncate leading-none">
                              {selectedOutlet.outletDetails.address || selectedOutlet.outletDetails.city}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[14px] lg:text-[15px] font-bold text-foreground leading-none truncate">
                          Choose a nearby restaurant
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] lg:text-[12px] font-bold text-primary group-hover:underline transition-colors shrink-0 leading-none">
                      Change
                    </span>
                  </div>
                </button>

                {/* Mobile Compact Location Button */}
                <button
                  onClick={openOutletModal}
                  className="md:hidden flex items-center gap-1.5 bg-card border border-border rounded-xl px-2.5 py-2 hover:shadow-sm transition-all max-w-[150px]"
                >
                  <span className="text-sm leading-none">📍</span>
                  <span className="text-xs font-bold text-foreground truncate">
                    {selectedOutlet?.outletName || "Select Outlet"}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER SECTION */}
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <motion.nav 
              key="auth-nav"
              variants={fadeVariants}
              initial="hidden" animate="visible" exit="exit"
              className="hidden lg:flex items-center bg-card/80 backdrop-blur-md border border-border rounded-full p-1.5 relative shrink-0 shadow-sm"
            >
              {showMenu && navLinks.map((link) => {
                const active = activeTabId === link.id;
                return (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={cn(
                      "relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10",
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-link-pill-v5"
                        className="absolute inset-0 bg-primary rounded-full shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-20">{link.label}</span>
                  </Link>
                );
              })}
            </motion.nav>
          ) : (
            <motion.div 
              key="public-nav"
              variants={fadeVariants}
              initial="hidden" animate="visible" exit="exit"
              className="hidden lg:flex items-center gap-8 text-muted-foreground font-semibold text-[14px]"
            >
              <button 
                onClick={() => scrollToSection('home')} 
                className={cn("transition-colors hover:text-foreground", activeSection === 'home' && "text-primary")}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className={cn("transition-colors hover:text-foreground", activeSection === 'how-it-works' && "text-primary")}
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className={cn("transition-colors hover:text-foreground", activeSection === 'features' && "text-primary")}
              >
                Features
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT SECTION: Cart & Profile / Sign In */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <AnimatePresence mode="wait">
            {isAuthenticated ? (
              <motion.div 
                key="auth-right"
                variants={fadeVariants}
                initial="hidden" animate="visible" exit="exit"
                className="flex items-center gap-2 md:gap-4"
              >
                {showCart && (
                  <Link 
                    to="/cart"
                    className="flex items-center gap-2 h-[40px] md:h-[48px] px-4 md:px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0 group"
                  >
                    <ShoppingCart className="h-5 w-5 stroke-[2.5] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                      {totalCartQuantity > 0 ? (
                        <>
                          <span>{totalCartQuantity} items</span>
                          <span className="opacity-50">•</span>
                          <span>
                            {currency}
                            {cartTotal.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        "Cart"
                      )}
                    </span>
                  </Link>
                )}

                {showProfile && (
                  <div className="flex items-center gap-2.5 shrink-0 ml-2">
                    <span className="hidden xl:inline text-sm font-bold text-foreground">
                      {user?.name || "Account"}
                    </span>
                    <AccountPanel />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="public-right"
                variants={fadeVariants}
                initial="hidden" animate="visible" exit="exit"
                className="flex items-center gap-3"
              >
                <Link to="/products" className="hidden sm:block">
                  <Button variant="ghost" className="text-foreground hover:bg-muted font-bold rounded-full h-[40px] px-5 transition-colors">
                    Explore Menu
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full h-[40px] px-6 shadow-md transition-transform hover:-translate-y-0.5 border-0">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 z-[110] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[120] lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-card">
                <img src={organization?.logoImage || defaultLogo} alt="Logo" className="w-[40px] h-[40px] rounded-xl shadow-sm" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {isAuthenticated ? (
                  navLinks.map(link => (
                    <Link 
                      key={link.id} 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "p-3 rounded-xl text-[15px] font-bold transition-colors",
                        activeTabId === link.id ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))
                ) : (
                  <>
                    <button 
                      onClick={() => scrollToSection('home')} 
                      className={cn(
                        "p-3 rounded-xl text-[15px] font-bold transition-colors text-left",
                        activeSection === 'home' ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => scrollToSection('how-it-works')} 
                      className={cn(
                        "p-3 rounded-xl text-[15px] font-bold transition-colors text-left",
                        activeSection === 'how-it-works' ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      How it Works
                    </button>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className={cn(
                        "p-3 rounded-xl text-[15px] font-bold transition-colors text-left",
                        activeSection === 'features' ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      Features
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
