import { useEffect } from 'react';
import { useNetworkStore } from '@/store/NetworkStore';
import { toast } from 'sonner';

export const useNetworkStatus = () => {
 const { isOnline, wasOffline, setOnline } = useNetworkStore();

 useEffect(() => {
 const handleOnline = () => {
 setOnline(true);
 };

 const handleOffline = () => {
 setOnline(false);
 toast.error('No Internet Connection', {
 description: 'Please check your network and try again.',
 duration: Infinity,
 id: 'network-offline',
 });
 };

 window.addEventListener('online', handleOnline);
 window.addEventListener('offline', handleOffline);

 return () => {
 window.removeEventListener('online', handleOnline);
 window.removeEventListener('offline', handleOffline);
 };
 }, [setOnline]);

 return { isOnline, wasOffline };
};
