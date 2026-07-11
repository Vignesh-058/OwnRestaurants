export interface Theme {
 primaryColor?: string;
 secondaryColor?: string;
 backgroundColor?: string;
 textColor?: string;
 secondaryTextColor?: string;
}

export interface LocationCoordinates {
 type: 'Point';
 coordinates: [number, number]; // [longitude, latitude]
}

export interface WorkingHourTime {
 from: string;
 to: string;
 _id: string;
}

export interface WorkingHourDay {
 day: string;
 times: WorkingHourTime[];
 _id: string;
}

export interface WorkingHours {
 isHolidayMode: boolean;
 isWorkingHoursEnabled: boolean;
 days: WorkingHourDay[];
}

export interface OutletDetails {
 outletName: string;
 contact: string;
 address: string;
 city: string;
 state: string;
 country: string;
 pincode: string;
 latitude: number;
 longitude: number;
}

export interface Outlet {
 _id: string;
 outletName: string;
 storeStatus: boolean;
 isActive: boolean;
 belongsTo: string;
 latitude: number;
 longitude: number;
 location: LocationCoordinates;
 outletDetails: OutletDetails;
 address: string;
 isCartEnabled: boolean;
 wh?: WorkingHours;
 currencySymbol: string;
 currencyCode: string;
 orderType: string[];
 distance?: number;
}

export interface Organization {
 _id: string;
 domain: string;
 brandName: string;
 logo: string;
 theme: Theme;
 storeType: string;
 currency?: string;
 description?: string;
 email?: string;
 phone?: string;
}

export interface OrganizationResponse {
 organization: Organization;
}

export interface OutletResponse {
 outlets: Outlet[];
}

export interface StoreStatusResponse {
 storeOpen: boolean;
 deliveryAvailable: boolean;
 pickupAvailable: boolean;
}
