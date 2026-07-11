import { create } from 'zustand';
import type { Organization } from '@/types/organization.types';

interface OrganizationState {
 organization: Organization | null;
 setOrganization: (org: Organization) => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
 organization: null, // Reset mock data since we have real API integration
 setOrganization: (org) => set({ organization: org }),
}));

// Force Vite HMR Cache Invalidations
