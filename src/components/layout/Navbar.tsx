import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Mic, ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/CartStore";
import { useAuthStore } from "@/store/AuthStore";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import { useLocationStore } from "@/store/LocationStore";
import { useOutletModalStore } from "@/store/OutletModalStore";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { cn } from "@/lib/utils";
import defaultLogo from "@/assets/Ieyal Logo.jpeg";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { grandTotal, cartItemCount, openDrawer } = useCartStore();
  const cartTotal = grandTotal;
  const totalCartQuantity = cartItemCount;

  const { isAuthenticated, user } = useAuthStore();
  const organization = useOrganizationStore((state) => state.organization);
  const currency = organization?.currency || "₹";

  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const openOutletModal = useOutletModalStore((state) => state.openModal);
  const userLocationAddress = useLocationStore(
    (state) => state.formattedAddress,
  );

  const headerConfig = organization?.theme?.sections?.header?.config;
  const showCart = headerConfig?.showCart ?? true;
  const showLocation = headerConfig?.showLocation ?? true;

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

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-[100] h-[80px] flex items-center bg-gradient-to-r from-[#0F172A] to-[#111827] backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] shadow-sm transition-colors px-4 md:px-8 xl:px-12">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* LEFT SECTION: Logo & Delivery */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button 
            className="lg:hidden p-1.5 text-white -ml-1"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link
            to={isAuthenticated ? "/" : "/login"}
            className="flex items-center group"
          >
            <img
              src={defaultLogo}
              alt="IEYAL Solutions"
              className="w-[36px] h-[36px] md:w-[48px] md:h-[48px] object-contain drop-shadow-sm transition-transform group-hover:scale-105 rounded-[10px] md:rounded-[12px]"
            />
          </Link>

          {showLocation && (
            <div className="flex items-center gap-3 lg:gap-4 shrink-0 min-w-0">
              {/* Divider between Logo and Location Card */}
              <div className="hidden md:block w-[1px] h-[40px] bg-[rgba(255,255,255,0.08)] ml-1 mr-1 lg:mx-0"></div>

              {/* Desktop/Laptop/Tablet Location Card */}
              <button
                onClick={openOutletModal}
                className="hidden md:flex flex-col items-start justify-center text-left w-[200px] lg:w-[260px] xl:w-[320px] h-[64px] bg-[#1F2937] border border-[rgba(255,255,255,0.08)] rounded-[16px] px-3 lg:px-4 py-3 hover:bg-[#1F2937]/80 hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 group shadow-sm shrink-0"
              >
                <div className="flex items-center w-full mb-1">
                  <span className="text-[10px] lg:text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest leading-none flex items-center gap-1.5">
                    📍 DELIVERING TO
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0 w-full">
                  <span className="text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-white truncate flex-1 leading-none">
                    {userLocationAddress ||
                      selectedOutlet?.outletDetails?.city ||
                      selectedOutlet?.outletName ||
                      "Select store"}
                  </span>
                  <span className="text-[11px] lg:text-[12px] font-bold text-[#FF6B00] group-hover:underline transition-colors shrink-0 leading-none">
                    Change
                  </span>
                </div>
              </button>

              {/* Mobile Compact Location Button */}
              <button
                onClick={openOutletModal}
                className="md:hidden flex items-center gap-1.5 bg-[#1F2937] border border-[rgba(255,255,255,0.08)] rounded-[12px] px-2.5 py-2 hover:bg-[#1F2937]/80 transition-colors max-w-[150px]"
              >
                <span className="text-sm leading-none">📍</span>
                <span className="text-xs font-bold text-white truncate">
                  {userLocationAddress ||
                    selectedOutlet?.outletDetails?.city ||
                    selectedOutlet?.outletName ||
                    "Location"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* CENTER SECTION: Nav Links */}
        <nav className="hidden lg:flex items-center bg-[#1F2937]/50 backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[40px] p-1.5 relative shrink-0 shadow-inner">
          {navLinks.map((link) => {
            const active = activeTabId === link.id;
            return (
              <Link
                key={link.id}
                to={link.path}
                className={cn(
                  "relative px-6 py-2 rounded-[40px] text-sm font-semibold transition-all duration-300 z-10",
                  active ? "text-white" : "text-[#94A3B8] hover:text-white",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-link-pill-v5"
                    className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-[#E85D00] rounded-[40px] shadow-md shadow-[#FF6B00]/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-20">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SECTION: Search Bar, Cart & Profile */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">




          {showCart && (
            <Link 
              to="/cart"
              className="flex items-center gap-2 h-[40px] md:h-[48px] px-4 md:px-6 bg-gradient-to-r from-[#FF6B00] to-[#E85D00] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,0,0.4)] text-white rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] shrink-0 group"
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

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 shrink-0 ml-2">
              <span className="hidden xl:inline text-sm font-bold text-white">
                {user?.name || "Account"}
              </span>
              <AccountPanel />
            </div>
          ) : (
            <Link to="/login" className="ml-2">
              <Button
                size="sm"
                className="rounded-full h-[40px] md:h-[48px] px-4 md:px-6 bg-[#1F2937] hover:bg-[#1F2937]/80 hover:border-[#FF6B00] border border-[rgba(255,255,255,0.05)] text-white font-bold text-sm shadow-sm transition-all duration-300 shrink-0"
              >
                Sign In
              </Button>
            </Link>
          )}
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
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#0F172A] to-[#111827]">
                <img src={defaultLogo} alt="Logo" className="w-[40px] h-[40px] rounded-[10px]" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link 
                    key={link.id} 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "p-3 rounded-xl text-[15px] font-bold transition-colors",
                      activeTabId === link.id ? "bg-[#FFF7ED] text-[#FF6B00]" : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
