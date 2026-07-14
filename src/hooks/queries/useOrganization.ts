import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOrganizationStore } from '@/store/OrganizationStore';

export const useOrganization = (domain: string = 'ieyal') => {
 const setOrganization = useOrganizationStore((state) => state.setOrganization);

 return useQuery({
 queryKey: ['organization', domain],
 queryFn: async () => {
 console.log('[DEBUG-FLOW] ORG REQUEST - Request payload:', { domain });
 const data = await organizationService.getOrganization(domain);
 if (data.organization) {
 console.log('[DEBUG-FLOW] ORG LOADED - Organization name returned:', data.organization.name, '| Domain used:', domain);
 setOrganization(data.organization);
 }
 return data;
 },
 enabled: !!domain,
 staleTime: 1000 * 60 * 30, // 30 minutes
 });
};
