import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useEffect } from 'react';

export const useOrganization = (domain: string = 'ieyal') => {
 const setOrganization = useOrganizationStore((state) => state.setOrganization);

 const query = useQuery({
   queryKey: ['organization', domain],
   queryFn: async () => {
     console.log('[DEBUG-FLOW] ORG REQUEST - Request payload:', { domain });
     const data = await organizationService.getOrganization(domain);
     return data;
   },
   enabled: !!domain,
   staleTime: 1000 * 60 * 30, // 30 minutes
 });

 useEffect(() => {
   if (query.data?.organization) {
     console.log('[DEBUG-FLOW] ORG LOADED - Organization name returned:', query.data.organization.name, '| Domain used:', domain);
     setOrganization(query.data.organization);
   }
 }, [query.data?.organization, setOrganization, domain]);

 return query;
};
