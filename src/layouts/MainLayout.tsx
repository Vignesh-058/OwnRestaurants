import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { LocationSelectorModal } from '@/components/location/LocationSelectorModal';
import { OutletSelectorModal } from '@/components/location/OutletSelectorModal';
import { useOrganization } from '@/hooks/queries/useOrganization';
import { useOutlets } from '@/hooks/queries/useOutlets';
import { useSettings } from '@/hooks/queries/useSettings';
import { useStoreStatus } from '@/hooks/queries/useStoreStatus';
import { useBanners } from '@/hooks/queries/useBanners';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ApiErrorState } from '@/components/common/ApiErrorState';
import { useOutletStore } from '@/store/OutletStore';
import { EmptyStoreState } from '@/components/common/EmptyStoreState';
import { PageTransition } from '@/components/common/PageTransition';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { LandingPageSkeleton } from '@/components/common/LandingPageSkeleton';

export const MainLayout = () => {
  const location = useLocation();
  // Use domain-based fetching for the Ieyal organization
  const orgQuery = useOrganization('ieyal');
  
  // Extract belongsTo dynamically from the fetched organization payload to prevent token mismatches
  const belongsTo = orgQuery.data?.organization?._id || '';

  // 1. Fetch Outlets using belongsTo
  const outletsQuery = useOutlets(belongsTo);

  // 2. Derive Selected Outlet
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const outletId = selectedOutlet?._id || '';

  // 3. Fetch specific configurations based on Selected Outlet
  const settingsQuery = useSettings(belongsTo, outletId);
  const storeStatusQuery = useStoreStatus(belongsTo, outletId);
  const bannersQuery = useBanners(belongsTo, outletId);

  useEffect(() => {
    if (orgQuery.isSuccess && orgQuery.data?.organization?.theme) {
      const theme = orgQuery.data.organization.theme;
      const root = document.documentElement;

      if (theme.primaryColor) {
        root.style.setProperty('--primary', theme.primaryColor);
        root.style.setProperty('--ring', theme.primaryColor);
      }
      if (theme.textColor) root.style.setProperty('--foreground', theme.textColor);
      if (theme.borderColor) root.style.setProperty('--border', theme.borderColor);
      if (theme.secondaryColor) root.style.setProperty('--secondary', theme.secondaryColor);
      if (theme.secondaryTextColor) root.style.setProperty('--muted-foreground', theme.secondaryTextColor);
    }
  }, [
    belongsTo, outletId, outletsQuery.isSuccess, bannersQuery.isSuccess, orgQuery.isSuccess, orgQuery.data
  ]);

  const isInitializing = 
    orgQuery.isLoading || 
    (belongsTo && outletsQuery.isLoading) || 
    (belongsTo && outletId && settingsQuery.isLoading) || 
    (belongsTo && outletId && storeStatusQuery.isLoading);

  if (isInitializing) {
    return <LandingPageSkeleton />;
  }

  if (orgQuery.isError || outletsQuery.isError || settingsQuery.isError) {
    return <ApiErrorState message="Failed to load application data." onRetry={() => {
      orgQuery.refetch();
      outletsQuery.refetch();
      settingsQuery.refetch();
    }} />;
  }

  if (outletsQuery.isSuccess && outletsQuery.data?.outlets?.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col pt-[80px]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <EmptyStoreState />
        </main>
        <LocationSelectorModal />
        {location.pathname !== '/checkout' && <Footer />}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative flex min-h-screen flex-col pt-[80px]">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        <FloatingCart />
        <FloatingNav />
        <LocationSelectorModal />
        <OutletSelectorModal />
        {location.pathname !== '/checkout' && <Footer />}
      </div>
    </ErrorBoundary>
  );
};
