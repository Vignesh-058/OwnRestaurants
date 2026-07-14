export interface ThemeSectionConfig {
  layout?: string;
  config?: any;
}

export interface ThemeSections {
  header?: {
  layout?: string;
  config?: {
  showSearch?: boolean;
  showCart?: boolean;
  showLocation?: boolean;
  imageShape?: string;
  };
  };
  banner?: {
  layout?: string;
  config?: {
  showDots?: boolean;
  showArrows?: boolean;
  borderRadius?: number;
  };
  };
  categories?: {
  layout?: string;
  config?: {
  showLabel?: boolean;
  imageShape?: string;
  };
  };
  products?: ThemeSectionConfig;
  login?: {
  layout?: string;
  config?: {
  imageShape?: string;
  };
  };
  profile?: {
  layout?: string;
  config?: {
  showSavedAddresses?: boolean;
  showTotalSpent?: boolean;
  showOrderHistory?: boolean;
  showTotalOrder?: boolean;
  };
  };
  cart?: {
  layout?: string;
  config?: {
  showRecommended?: boolean;
  showInstructions?: boolean;
  showSavings?: boolean;
  };
  };
  searchList?: ThemeSectionConfig;
  footer?: {
  layout?: string;
  config?: {
  showContact?: boolean;
  };
  };
}

export interface Theme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  borderColor?: string;
  sections?: ThemeSections;
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
  eta?: string;
}

export interface Organization {
  _id: string;
  name?: string;
  brandName?: string; // fallback
  domain?: string;
  logoImage?: string;
  logo?: string; // fallback
  logoUrl?: string;
  website?: string;
  whatsAppNumber?: string;
  phoneNo?: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
  type?: string;
  storeType?: string; // fallback
  isActive?: boolean;
  isDoorDeliveryAvailable?: boolean;
  isSelfPickupAvailable?: boolean;
  theme?: Theme;
  currency?: string;
}

export interface OrganizationResponse {
 organization: Organization;
}

export interface OutletResponse {
 outlets: Outlet[];
}

export interface StoreStatusResponse {
  _id: string;
  storeStatus: boolean;
  storeOpen?: boolean;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  manualOverrideType: string | null;
  overrideEndTime: string | null;
}
