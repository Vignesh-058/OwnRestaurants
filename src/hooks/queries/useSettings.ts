import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { useSettingsStore } from '@/store/SettingsStore';
import { useOutletStore } from '@/store/OutletStore';

export const useSettings = (belongsTo: string, outletId: string) => {
 const setSettings = useSettingsStore((state) => state.setSettings);
 const storeStatus = useOutletStore((state) => state.storeStatus);

 return useQuery({
 queryKey: ['settings', belongsTo, outletId],
 queryFn: async () => {
  console.log('[DEBUG-FLOW] SETTINGS REQUEST - belongsTo:', belongsTo, 'outletId:', outletId);
  const data = await settingsService.getSettings(belongsTo, outletId);
  console.log('[DEBUG-FLOW] SETTINGS FETCHED - success');
  setSettings(data);
  return data;
  },
 enabled: !!belongsTo && !!outletId,
 staleTime: 1000 * 60 * 30, // 30 minutes
 retry: 1,
 });
};
