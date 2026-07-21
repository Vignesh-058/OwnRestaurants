import { useQuery } from '@tanstack/react-query';
import { preBookingService } from '@/services/prebooking.service';
import type { GetActivePreBookingPayload, GetActivePreBookingResponse } from '@/types/prebooking.types';

export const useActivePreBooking = (payload: GetActivePreBookingPayload | null, enabled: boolean) => {
  return useQuery<GetActivePreBookingResponse>({
    queryKey: ['activePreBooking', payload?.outletId, payload?.belongsTo],
    queryFn: () => preBookingService.getActiveCampaigns(payload!),
    enabled: enabled && !!payload?.outletId && !!payload?.belongsTo,
    staleTime: 5 * 60 * 1000,
  });
};
