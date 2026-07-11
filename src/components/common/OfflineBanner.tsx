import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner = () => {
 const { isOnline, wasOffline } = useNetworkStatus();

 if (isOnline && !wasOffline) return null;

 if (!isOnline) {
 return (
 <div
 role="alert"
 aria-live="assertive"
 className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm font-semibold shadow-lg animate-in slide-in-from-top duration-300"
 >
 <WifiOff className="h-4 w-4 shrink-0" />
 <span>No Internet Connection — Please check your network</span>
 </div>
 );
 }

 if (wasOffline && isOnline) {
 return (
 <div
 role="status"
 aria-live="polite"
 className="fixed top-0 left-0 right-0 z-[9999] bg-emerald-600 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm font-semibold shadow-lg animate-in slide-in-from-top duration-300"
 >
 <Wifi className="h-4 w-4 shrink-0" />
 <span>Back Online — You are connected again</span>
 </div>
 );
 }

 return null;
};
