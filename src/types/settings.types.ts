export interface Settings {
 paymentMode: string[];
 defaultPaymentMode: string;
 preBookingEnabled: boolean;
 banner?: {
 enable: boolean;
 autoScroll: boolean;
 };
 checkOutSettings?: {
 showRewards: boolean;
 calculateLoyality: boolean;
 applyDiscount: boolean;
 enableDiscounts: boolean;
 loyaltyMinimumAmount: number;
 delivery?: boolean;
 pickup?: boolean;
 };
 isInvoicePdfGenerated?: boolean;
 pos?: any;
}
