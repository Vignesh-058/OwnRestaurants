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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
