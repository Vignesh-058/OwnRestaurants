export interface GeoLocationResponse {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  placeId?: string;
  formattedAddress: string;
  postalCode?: string;
}

export interface AddressSearchRequest {
 enteredAddress: string;
 belongsTo: string;
}

export interface CustomerLocation {
 latitude: number | null;
 longitude: number | null;
 formattedAddress: string | null;
 addressId: string | null;
 address1: string | null;
 address2: string | null;
 street: string | null;
 city: string | null;
 state: string | null;
 country: string | null;
 postalCode: string | null;
 placeId: string | null;
}

export interface LocationState extends CustomerLocation {
 locationLoaded: boolean;
 permissionGranted: boolean | null;
 loading: boolean;
 error: string | null;

 setLocation: (locationData: Partial<CustomerLocation> & { locationLoaded?: boolean }) => void;
 setPermissionStatus: (granted: boolean | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearLocation: () => void;
}
