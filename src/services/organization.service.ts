import { axiosInstance } from '@/api/axios';
import type { OrganizationResponse, OutletResponse, StoreStatusResponse } from '@/types/organization.types';
import type { ApiResponse } from '@/types/api.types';

export const organizationService = {
 getOrganization: async (belongsTo: string): Promise<OrganizationResponse> => {
 const response = await axiosInstance.post<ApiResponse<any>>('/organization/get-org', { belongsTo });
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
 const response = await axiosInstance.post<ApiResponse<any>>('/organization/outlets/get-all', {
 belongsTo,
 locationSorting: !!(lat && lng),
 lat,
 lng
 });
 console.log("[STAGE 1: API Response Raw]", response.data);
 const outletsData = Array.isArray(response.data.data) ? response.data.data : (response.data.data?.outlets || []);
 console.log("[STAGE 2: Service Data]", outletsData);
 return { outlets: outletsData };
 },

 getStoreStatus: async (belongsTo: string, outletId: string): Promise<StoreStatusResponse> => {
 const response = await axiosInstance.post<ApiResponse<StoreStatusResponse>>(`/organization/get-store-status/${belongsTo}`, {
 belongsTo,
 outletId
 });
 return response.data.data;
 }
};

// Force Vite HMR Cache Invalidations
