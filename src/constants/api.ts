export const API_ENDPOINTS = {
 // Auth & Organization
 GET_ORG: '/organization/get-org',
 GET_OUTLETS: '/organization/outlets/get-all',
 LOGIN: '/customer/loginWithPassword',
 SIGNUP: '/customer/signUpWithPassword',
 SEND_OTP: '/customer/sendOtp',
 VERIFY_OTP: '/customer/verifyOtp',

 // Categories & Items
 GET_CATEGORIES: '/category/getCategory',

 // Customer Profile & Address
 GET_ADDRESSES: '/customer/get-addresses',
 CREATE_ADDRESS: '/customer/create-address',

 // Cart & Checkout
 SYNC_CART: '/cart/sync',
 CHECKOUT: '/order/create',

 // Orders
 GET_ORDERS: '/order/get-all-order-by-customer',

 // Discounts & Coupons
 GET_DISCOUNTS: '/discount/get-user-discounts',
 APPLY_DISCOUNT: '/discount/applyToCart',
} as const;
