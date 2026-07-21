import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const useProfileStats = () => {
  const { user, isAuthenticated } = useAuthStore();
  const organization = useOrganizationStore((state) => state.organization);
  
  const belongsTo = organization?._id || '';
  const customerPhoneNo = user?.phone || '';

  return useQuery({
    queryKey: ['profileStats', belongsTo, customerPhoneNo],
    queryFn: () => profileService.getProfileStats(belongsTo, customerPhoneNo),
    enabled: isAuthenticated && !!belongsTo && !!customerPhoneNo,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    refetchOnWindowFocus: true,
  });
};
