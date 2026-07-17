import { useQuery } from '@tanstack/react-query';
import { bannerService } from '@/services/banner.service';
import { useSettings } from './useSettings';

export const useBanners = (belongsTo: string, outletId: string) => {
  const { data: settings, isSuccess: isSettingsLoaded } = useSettings(belongsTo, outletId);
  const isBannerEnabled = settings?.banner ? settings.banner.enable : true;

  return useQuery({
    queryKey: ['active-banners', outletId],
    queryFn: async () => {
      console.log('[Banner API Request]', 'Fetching banners');
      console.log('[Banner API Payload]', { belongsTo, outletId });
      
      const data = await bannerService.getActiveBanners(belongsTo, outletId);
      
      console.log('[Banner API Response]', data);
      console.log('[Banner Count]', data?.length || 0);
      
      return data;
    },
    enabled: Boolean(belongsTo) && Boolean(outletId) && isSettingsLoaded && isBannerEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
