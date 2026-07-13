const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://backend2.owct.me',
  AUTH_API: import.meta.env.VITE_AUTH_API || '/customer',
  CUSTOMER_API: import.meta.env.VITE_CUSTOMER_API || '/customer',
  CATEGORY_API: import.meta.env.VITE_CATEGORY_API || '/category',
  PRODUCT_API: import.meta.env.VITE_PRODUCT_API || '/item',
  CART_API: import.meta.env.VITE_CART_API || '/cart',
  ORDER_API: import.meta.env.VITE_ORDER_API || '/order',
  ADDRESS_API: import.meta.env.VITE_ADDRESS_API || '/customer',
  STORE_API: import.meta.env.VITE_STORE_API || '/organization',
  LOCATION_API: import.meta.env.VITE_LOCATION_API || '/location',
  PAYMENT_API: import.meta.env.VITE_PAYMENT_API || '/payment',
  REWARDS_API: import.meta.env.VITE_REWARDS_API || '/rewards',
  UPLOAD_API: import.meta.env.VITE_UPLOAD_API || '/upload',
  BANNER_API: import.meta.env.VITE_BANNER_API || '/banner',
  COUPON_API: import.meta.env.VITE_COUPON_API || '/discount',
  SETTING_API: import.meta.env.VITE_SETTING_API || '/setting',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://backend2.owct.me',
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL || 'https://backend2.owct.me/images',
  GOOGLE_MAP_API_KEY: import.meta.env.VITE_GOOGLE_MAP_API_KEY || '',
};

// Required environment variables validation at startup
const requiredEnvVars = [
  'API_BASE_URL',
  'AUTH_API',
  'CUSTOMER_API',
  'CATEGORY_API',
  'PRODUCT_API',
  'CART_API',
  'ORDER_API',
  'ADDRESS_API',
  'STORE_API',
  'LOCATION_API',
];

for (const key of requiredEnvVars) {
  if (!ENV[key as keyof typeof ENV]) {
    console.error(`[Configuration Error] Missing required environment variable: VITE_${key}`);
  }
}

export default ENV;
