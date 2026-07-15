import { axiosInstance } from '@/api/axios';
import ENV from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { GeoLocationResponse, AddressSearchRequest } from '@/types/location.types';

export interface GeoLocationPayload {
  lat: number;
  lng: number;
}

export const locationService = {
  getCustomerGeoLocation: async (payload: GeoLocationPayload): Promise<GeoLocationResponse> => {
    if (import.meta.env.DEV) console.log('[Location] API Request - Geo Location', payload);
    const response = await axiosInstance.post<ApiResponse<GeoLocationResponse | any>>(
      `${ENV.LOCATION_API}/customer-geo-location`,
      payload
    );
    if (import.meta.env.DEV) console.log('[Location] API Response - Geo Location', response.data.data ?? response.data);
    return response.data.data ?? response.data;
  },

  reverseGeocode: async (payload: GeoLocationPayload): Promise<GeoLocationResponse> => {
    if (import.meta.env.DEV) console.log('[Location] API Request - Reverse Geocode', payload);
    const response = await axiosInstance.post<ApiResponse<GeoLocationResponse | any>>(
      `${ENV.LOCATION_API}/customer-get-latlng`,
      payload
    );
    if (import.meta.env.DEV) console.log('[Location] API Response - Reverse Geocode', response.data.data ?? response.data);
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
