/**
 * Centralised toast utility built on top of sonner.
 * Provides consistent icons, deduplication, and formatting.
 */
import { toast } from 'sonner';

const shown = new Set<string>();

const dedup = (id: string, ttl = 4000): boolean => {
 if (shown.has(id)) return false;
 shown.add(id);
 setTimeout(() => shown.delete(id), ttl);
 return true;
};

export const notify = {
 success: (title: string, description?: string, id?: string) => {
 const key = id ?? title;
 if (!dedup(key)) return;
 toast.success(title, { description, id: key, duration: 3000 });
 },

 error: (title: string, description?: string, id?: string) => {
 const key = id ?? title;
 if (!dedup(key)) return;
 toast.error(title, { description, id: key, duration: 5000 });
 },

 warning: (title: string, description?: string, id?: string) => {
 const key = id ?? title;
 if (!dedup(key)) return;
 toast.warning(title, { description, id: key, duration: 4000 });
 },

 info: (title: string, description?: string, id?: string) => {
 const key = id ?? title;
 if (!dedup(key)) return;
 toast.info(title, { description, id: key, duration: 3500 });
 },

 dismiss: (id: string) => toast.dismiss(id),

 promise: toast.promise,
};

// Named quick helpers
export const notifyLoginSuccess = () => notify.success('Welcome back!', 'You have logged in successfully.', 'login-success');
export const notifyLogout = () => notify.info('Logged out', 'See you again!', 'logout');
export const notifyAddressAdded = () => notify.success('Address Added', 'Your new address has been saved.', 'address-added');
export const notifyCouponApplied = (code: string, savings: number) =>
 notify.success(`Coupon "${code}" Applied`, `You save ₹${savings}!`, `coupon-${code}`);
export const notifyCartUpdated = () => notify.success('Cart Updated', undefined, 'cart-updated');
export const notifyOrderPlaced = () => notify.success('Order Placed!', 'We have received your order.', 'order-placed');
export const notifyNetworkError = () => notify.error('Network Error', 'Please check your internet connection.', 'network-error');
export const notifySessionExpired = () => notify.error('Session Expired', 'Please log in again.', 'session-expired');
export const notifyServerError = () => notify.error('Server Error', 'Something went wrong. Please try again.', 'server-error');
export const notifyProfileUpdated = () => notify.success('Profile Updated', 'Your changes have been saved.', 'profile-updated');
export const notifyValidationError = (msg?: string) =>
 notify.error('Validation Error', msg ?? 'Please check your input.', 'validation-error');
