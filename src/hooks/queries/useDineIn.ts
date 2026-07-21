import { useQuery } from '@tanstack/react-query';
import { dineInService } from '@/services/dinein.service';

export const useTables = (outletId: string | undefined) => {
  return useQuery({
    queryKey: ['tables', outletId],
    queryFn: () => dineInService.getTables(outletId!),
    enabled: Boolean(outletId),
    staleTime: 1000 * 60, // 1 minute
  });
};
