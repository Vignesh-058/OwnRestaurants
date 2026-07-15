export interface ThemeColors {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  headerBackgroundColor?: string;
  footerBackgroundColor?: string;
  fontFamily?: string;
  fontSize?: string;
  buttonRadius?: string;
  cardRadius?: string;
}

export interface ThemeConfigSections {
  theme?: ThemeColors;
  header?: {
    config?: {
      showSearch?: boolean;
      showCart?: boolean;
      showMenu?: boolean;
      showProfile?: boolean;
      showLocation?: boolean;
      showIcons?: boolean;
      showLabels?: boolean;
    };
  };
  home?: {
    sectionOrder?: string[];
    sections?: Record<string, { isActive?: boolean; layout?: string; config?: any }>;
    hero?: {
      tagline?: string;
      title?: string;
      description?: string;
    };
  };
  menu?: any;
  productDetail?: {
    showReviews?: boolean;
    showVariants?: boolean;
    showAddons?: boolean;
    showShareButton?: boolean;
    showRelatedProducts?: boolean;
  };
  cart?: {
    config?: {
      showOffers?: boolean;
      showAddressStrip?: boolean;
      showCartItems?: boolean;
      showRewards?: boolean;
      showBillDetails?: boolean;
      showPaymentMethod?: boolean;
      showCookingInstructions?: boolean;
      showRecommendedProducts?: boolean;
      showSavings?: boolean;
    };
  };
  profile?: {
    config?: {
      showSavedAddresses?: boolean;
      showTotalOrders?: boolean;
      showTotalSpent?: boolean;
      showOrderHistory?: boolean;
    };
  };
  login?: {
    background?: string;
    imageShape?: string;
    showSocialLogin?: boolean;
  };
  footer?: {
    config?: {
      address?: string;
      email?: string;
      phone?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };
}

export interface Theme {
  config?: ThemeConfigSections;
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
  isDineInAvailable?: boolean;
  isCartEnabled?: boolean;
  isStoreOpen?: boolean;
  planName?: string;
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
