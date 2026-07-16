import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Tag, Receipt, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/AuthStore';
import { useEffect, useRef } from 'react';

export const FloatingNav = () => {
 const location = useLocation();
 const { isAuthenticated } = useAuthStore();
 const currentPath = location.pathname;

  const navRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate and expose the floating nav height to prevent overlaps
  useEffect(() => {

    const updateHeight = () => {
      if (navRef.current) {
        // If we're on lg or larger screens, the nav is hidden
        if (window.innerWidth >= 1025) {
          document.documentElement.style.setProperty('--floating-nav-height', '0px');
          return;
        }
        
        const rect = navRef.current.getBoundingClientRect();
        const distanceFromBottom = window.innerHeight - rect.top;
        // Expose exact height so other sticky elements can sit flush or add their own gap
        document.documentElement.style.setProperty('--floating-nav-height', `${distanceFromBottom}px`);
      }
    };

    updateHeight();
    
    // Use ResizeObserver for accurate height changes (e.g., orientation change)
    const observer = new ResizeObserver(updateHeight);
    if (navRef.current) observer.observe(navRef.current);
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
      document.documentElement.style.setProperty('--floating-nav-height', '0px');
    };
  }, [isAuthenticated]);

  const tabs = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'products', label: 'Menu', path: '/products', icon: Store },
    { id: 'offers', label: 'Offers', path: '/offers', icon: Tag },
    { id: 'orders', label: 'Orders', path: isAuthenticated ? '/profile/orders' : '/login', icon: Receipt },
    { id: 'profile', label: 'Profile', path: isAuthenticated ? '/profile' : '/login', icon: User },
  ];

  // Helper to determine active state precisely
  const isActive = (tabId: string, path: string) => {
    if (path === '/') return currentPath === '/';
    if (tabId === 'profile' && currentPath.includes('/orders')) return false;
    return currentPath.startsWith(path);
  };

  return (
    <div ref={navRef} className="fixed bottom-0 left-0 right-0 z-[45] w-full pointer-events-none lg:hidden transition-all duration-300">
      <nav 
        className="pointer-events-auto bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-border px-3 pt-2 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)] w-full rounded-t-[20px]"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <AnimatePresence>
          {tabs.map((tab) => {
            const active = isActive(tab.id, tab.path);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.id}
                to={tab.path}
                className="relative flex items-center justify-center transition-all duration-300 focus:outline-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav-pill-mobile"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center h-[44px] transition-all duration-300 rounded-full",
                    active ? "text-primary px-4" : "text-muted-foreground hover:text-foreground px-3"
                  )}
                >
                  <Icon className={cn("h-[22px] w-[22px] shrink-0 transition-all duration-300", active ? "stroke-[2.5] scale-110" : "stroke-[2]")} />
                  
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 6 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="text-[13px] font-bold tracking-wide overflow-hidden whitespace-nowrap"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </AnimatePresence>
      </nav>
    </div>
  );
};
