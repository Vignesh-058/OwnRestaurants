import { useQuery } from '@tanstack/react-query';
import { bannerService } from '@/services/banner.service';
import { useSettings } from './useSettings';
import { useOutletStore } from '@/store/OutletStore';

export const useBanners = (belongsTo: string, outletId: string) => {
 const { data: settings, isSuccess: isSettingsLoaded } = useSettings(belongsTo, outletId);
 const isBannerEnabled = settings?.banner?.enable === true;

 return useQuery({
 queryKey: ['banners', belongsTo, outletId],
 queryFn: async () => {
 console.log('[DEBUG-FLOW] BANNERS REQUEST - belongsTo:', belongsTo, 'outletId:', outletId);
 const data = await bannerService.getActiveBanners(belongsTo, outletId);
 console.log('[DEBUG-FLOW] BANNERS FETCHED - count:', data?.length);
 return data;
 },
 enabled: Boolean(belongsTo) && Boolean(outletId) && isSettingsLoaded && isBannerEnabled,
 staleTime: 1000 * 60 * 15, // 15 minutes
 });
};
