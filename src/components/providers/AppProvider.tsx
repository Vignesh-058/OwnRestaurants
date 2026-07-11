import { useEffect } from 'react';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AppErrorBoundary } from '@/components/common/AppErrorBoundary';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { LocationPermissionModal } from '@/components/modals/LocationPermissionModal';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { applyOrganizationTheme } from '@/utils/theme';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
 const organization = useOrganizationStore((state) => state.organization);

 useEffect(() => {
 if (organization?.theme) {
 applyOrganizationTheme(organization.theme);
 }
 }, [organization]);

 return (
 <AppErrorBoundary>
 <ThemeProvider defaultTheme="system" storageKey="owncart-theme">
 <QueryProvider>
 {/* Offline banner sits above everything */}
 <OfflineBanner />
 {/* Location modal handles global location permission checking */}
 <LocationPermissionModal />
 {children}
 <ToastProvider />
 </QueryProvider>
 </ThemeProvider>
 </AppErrorBoundary>
 );
};
