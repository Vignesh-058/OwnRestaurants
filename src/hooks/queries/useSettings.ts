import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { useSettingsStore } from '@/store/SettingsStore';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';

export const useSettings = (belongsTo: string, outletId: string) => {
 const setSettings = useSettingsStore((state) => state.setSettings);
 const storeStatus = useOutletStore((state) => state.storeStatus);

 const locationLoaded = useLocationStore((state) => state.locationLoaded);

 return useQuery({
 queryKey: ['settings', belongsTo, outletId],
 queryFn: async () => {
 const data = await settingsService.getSettings(belongsTo, outletId);
 setSettings(data);
 return data;
 },
 enabled: !!belongsTo && !!outletId && locationLoaded,
 staleTime: 1000 * 60 * 30, // 30 minutes
 retry: 1,
 });
};
