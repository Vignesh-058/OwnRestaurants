import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { LocationSelectorModal } from '@/components/location/LocationSelectorModal';
import { useOrganization } from '@/hooks/queries/useOrganization';
import { useOutlets } from '@/hooks/queries/useOutlets';
import { useSettings } from '@/hooks/queries/useSettings';
import { useStoreStatus } from '@/hooks/queries/useStoreStatus';
import { useBanners } from '@/hooks/queries/useBanners';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { ApiErrorState } from '@/components/common/ApiErrorState';
import { useOutletStore } from '@/store/OutletStore';
import { EmptyStoreState } from '@/components/common/EmptyStoreState';
import { PageTransition } from '@/components/common/PageTransition';
import { APP_CONFIG } from '@/constants';
import { FloatingNav } from '@/components/layout/FloatingNav';

export const MainLayout = () => {
 const belongsToId = APP_CONFIG.belongsTo || '';
 
 const orgQuery = useOrganization(belongsToId);
 // Always use the configured belongsToId for subsequent queries to prevent token mismatch
 const belongsTo = belongsToId;

 // 1. Fetch Outlets using belongsTo
 const outletsQuery = useOutlets(belongsTo);
 
 // 2. Derive Selected Outlet
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const outletId = selectedOutlet?._id || '';

 // 3. Fetch specific configurations based on Selected Outlet
 useSettings(belongsTo, outletId);
 useStoreStatus(belongsTo, outletId);
 const bannersQuery = useBanners(belongsTo, outletId);

 useEffect(() => {
  if (orgQuery.isSuccess && orgQuery.data?.organization?.theme) {
  const theme = orgQuery.data.organization.theme;
  const root = document.documentElement;
  
  if (theme.primaryColor) {
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--ring', theme.primaryColor);
  }
  if (theme.backgroundColor) root.style.setProperty('--background', theme.backgroundColor);
  if (theme.textColor) root.style.setProperty('--foreground', theme.textColor);
  if (theme.borderColor) root.style.setProperty('--border', theme.borderColor);
  if (theme.secondaryColor) root.style.setProperty('--secondary', theme.secondaryColor);
  if (theme.secondaryTextColor) root.style.setProperty('--muted-foreground', theme.secondaryTextColor);
  
  // Example for border radius if backend starts sending it natively top-level
  // if (theme.radius) root.style.setProperty('--radius', theme.radius + 'px');
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
  belongsTo, outletId, outletsQuery.isSuccess, bannersQuery.isSuccess, orgQuery.isSuccess, orgQuery.data
  ]);

 useEffect(() => {
 if (import.meta.env.DEV) {





 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [
 belongsTo, outletId, outletsQuery.isSuccess, bannersQuery.isSuccess
 ]);

 if (orgQuery.isLoading || (belongsTo && outletsQuery.isLoading)) {
 return <LoadingState message="Initializing application..." />;
 }

 if (orgQuery.isError || outletsQuery.isError) {
 return <ApiErrorState message="Failed to load organization data." onRetry={() => orgQuery.refetch()} />;
 }

 if (outletsQuery.isSuccess && outletsQuery.data?.outlets?.length === 0) {
 return (
 <div className="relative flex min-h-screen flex-col pt-[80px]">
 <Navbar />
 <main className="flex-1 flex flex-col items-center justify-center">
 <EmptyStoreState />
 </main>
 <LocationSelectorModal />
 <Footer />
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
 <CartDrawer />
 <FloatingNav />
 <LocationSelectorModal />
 <Footer />
 </div>
 </ErrorBoundary>
 );
};
