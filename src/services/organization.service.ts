import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { OrganizationResponse, OutletResponse, StoreStatusResponse } from '@/types/organization.types';
import type { ApiResponse } from '@/types/api.types';

export const organizationService = {
  getOrganization: async (domain: string = 'ieyal'): Promise<OrganizationResponse> => {
    // Send the requested static domain payload
    const response = await axiosInstance.post<ApiResponse<any>>(`${ENV.STORE_API}/get-org`, { domain });
    
    const orgData = response.data.data?.organization || response.data.data;
    if (orgData) {
      return {
        organization: {
          ...orgData,
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

  const resData = response.data?.data || response.data;
  let outletsData = [];
  if (Array.isArray(resData)) {
    outletsData = resData;
  } else if (resData?.outlets && Array.isArray(resData.outlets)) {
    outletsData = resData.outlets;
  } else if (Array.isArray(response.data)) {
    outletsData = response.data;
  }

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
