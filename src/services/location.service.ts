import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { GeoLocationResponse, AddressSearchRequest } from '@/types/location.types';

export interface GeoLocationPayload {
 latitude: number;
 longitude: number;
 belongsTo: string;
}

export const locationService = {
 getCustomerGeoLocation: async (payload: GeoLocationPayload): Promise<GeoLocationResponse> => {
 const response = await axiosInstance.post<ApiResponse<GeoLocationResponse | any>>(
 `${ENV.LOCATION_API}/customer-geo-location`,
 payload
 );
 return response.data.data ?? response.data;
 },

  getCustomerLatLng: async (payload: AddressSearchRequest): Promise<GeoLocationResponse> => {
    const response = await axiosInstance.post<ApiResponse<GeoLocationResponse | any>>(
      `${ENV.LOCATION_API}/customer-get-latlng`,
      payload
    );
    return response.data.data ?? response.data;
  },
};
