import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';

export const useSettings = (belongsTo: string, outletId: string) => {
 return useQuery({
 queryKey: ['settings', belongsTo, outletId],
 queryFn: async () => {
 const data = await settingsService.getSettings(belongsTo, outletId);
 return data;
 },
 enabled: !!belongsTo && !!outletId,
 staleTime: 1000 * 60 * 30, // 30 minutes
 });
};
