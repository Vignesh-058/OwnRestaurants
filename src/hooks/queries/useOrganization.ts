import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const useOrganization = (belongsTo: string) => {
 const setOrganization = useOrganizationStore((state) => state.setOrganization);

 return useQuery({
 queryKey: ['organization', belongsTo],
 queryFn: async () => {
 const data = await organizationService.getOrganization(belongsTo);
 if (data.organization) {
 setOrganization(data.organization);
 }
 return data;
 },
 enabled: !!belongsTo,
 staleTime: 1000 * 60 * 30, // 30 minutes
 });
};
