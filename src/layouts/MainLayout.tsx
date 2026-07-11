import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/cart/FloatingCart';
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
 if (import.meta.env.DEV) {
 console.log('--- API Flow Verification ---');
 console.log('1. belongsTo ID:', belongsTo);
 console.log('2. Selected Outlet ID:', outletId);
 if (outletsQuery.isSuccess) console.log('3. Outlets Count:', outletsQuery.data?.outlets?.length || 0);
 if (bannersQuery.isSuccess) console.log('4. Active Banners Count:', bannersQuery.data?.length || 0);
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
 <div className="relative flex min-h-screen flex-col">
 <Navbar />
 <main className="flex-1 flex flex-col items-center justify-center">
 <EmptyStoreState />
 </main>
 <Footer />
 </div>
 );
 }

 return (
 <ErrorBoundary>
 <div className="relative flex min-h-screen flex-col">
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
 <Footer />
 </div>
 </ErrorBoundary>
 );
};
