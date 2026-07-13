import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { OrganizationResponse, OutletResponse, StoreStatusResponse } from '@/types/organization.types';
import type { ApiResponse } from '@/types/api.types';

export const organizationService = {
 getOrganization: async (belongsTo: string): Promise<OrganizationResponse> => {
 const response = await axiosInstance.post<ApiResponse<any>>(`${ENV.STORE_API}/get-org`, { belongsTo });
 const orgData = response.data.data?.organization;
 if (orgData) {
 return {
 organization: {
 ...orgData,
 _id: belongsTo, // Force _id to match the requested ID to prevent Token Mismatches
 brandName: orgData.name || orgData.brandName,
 logo: orgData.logoImage || orgData.logo,
 storeType: orgData.type || orgData.storeType,
 currency: orgData.currencySymbol || '₹',
 }
 };
 }
 return response.data.data;
 },

 getOutlets: async (belongsTo: string, lat?: number, lng?: number): Promise<OutletResponse> => {
 const response = await axiosInstance.post<ApiResponse<any>>(`${ENV.STORE_API}/outlets/get-all`, {
 belongsTo,
 locationSorting: !!(lat && lng),
 lat,
 lng
 });

 const outletsData = Array.isArray(response.data.data) ? response.data.data : (response.data.data?.outlets || []);

 return { outlets: outletsData };
 },

 getStoreStatus: async (belongsTo: string, outletId: string): Promise<StoreStatusResponse> => {
 const response = await axiosInstance.post<ApiResponse<{ organization: StoreStatusResponse }>>(`${ENV.STORE_API}/get-store-status/${belongsTo}`, {
 belongsTo,
 outletId
 });
 return response.data.data?.organization || { storeStatus: false } as any;
 }
};

// Force Vite HMR Cache Invalidations
