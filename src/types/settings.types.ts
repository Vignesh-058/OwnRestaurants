export interface BannerSettings {
 enable: boolean;
 autoScroll: boolean;
}

export interface CheckoutSettings {
 showRewards: boolean;
 calculateLoyality: boolean;
 applyDiscount: boolean;
 enableDiscounts: boolean;
 loyaltyMinimumAmount: number;
 delivery?: boolean;
 pickup?: boolean;
}

export type PaymentMode = 'COD' | 'ONLINE' | string;

export interface Settings {
 preBookingEnabled: boolean;
 checkOutSettings: CheckoutSettings;
 paymentMode: PaymentMode[];
 defaultPaymentMode: PaymentMode;
 banner: BannerSettings;
 isInvoicePdfGenerated: boolean;
 pos: string;
 deliveryPoints: boolean;
}
