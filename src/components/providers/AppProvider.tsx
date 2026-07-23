import { useEffect } from 'react';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AppErrorBoundary } from '@/components/common/AppErrorBoundary';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { LocationPermissionModal } from '@/components/modals/LocationPermissionModal';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';
import { useCart } from '@/hooks/cart/useCart';
import { applyOrganizationTheme } from '@/utils/theme';
import defaultLogo from '@/assets/Ieyal Logo.jpeg';

// Silent component that keeps the global cart up to date
const GlobalCartSync = () => {
 const { user, isAuthenticated } = useAuthStore();
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 
 useCart({
 customerPhoneNo: isAuthenticated ? (user?.phone || '0000000000') : '0000000000',
 outletId: selectedOutlet?._id || ''
 });

 return null;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const organization = useOrganizationStore((state) => state.organization);
  const { user, isAuthenticated } = useAuthStore();


  useEffect(() => {
    if (organization?.theme?.config?.theme) {
      applyOrganizationTheme(organization.theme.config.theme);
    }

    // Update browser title dynamically
    document.title = 'OwnCart';

    // Update browser favicon
    const faviconUrl = organization?.logoImage || defaultLogo;
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [organization, isAuthenticated, user?.name]);

 return (
 <AppErrorBoundary>
 <ThemeProvider defaultTheme="light" storageKey="owncart-theme">
 <QueryProvider>
 {/* Offline banner sits above everything */}
 <OfflineBanner />
 {/* Location modal handles global location permission checking */}
 <LocationPermissionModal />
 <GlobalCartSync />
 {children}
 <ToastProvider />
 </QueryProvider>
 </ThemeProvider>
 </AppErrorBoundary>
 );
};
