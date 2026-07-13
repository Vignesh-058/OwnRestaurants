import axios, { AxiosError } from 'axios';
import { TokenManager } from '@/utils/TokenManager';
import { toast } from 'sonner';

// ── Deduplication: prevent duplicate toasts for the same error key ──────────
const shownToasts = new Set<string>();
const showToastOnce = (
 key: string,
 fn: () => void,
 ttl = 5000
): void => {
 if (shownToasts.has(key)) return;
 shownToasts.add(key);
 fn();
 setTimeout(() => shownToasts.delete(key), ttl);
};

import ENV from '@/config/env';

// ── Axios instance ───────────────────────────────────────────────────────────
export const axiosInstance = axios.create({
 baseURL: ENV.API_BASE_URL || 'https://backend2.owct.me',
 timeout: 12000,
 headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach Bearer token ─────────────────────────────────
axiosInstance.interceptors.request.use(
 (config) => {
 const token = TokenManager.getToken();
 if (token && token !== 'null' && token !== 'undefined' && config.headers) {
 if (typeof token === 'string' && token.startsWith('Bearer ')) {
 config.headers.Authorization = token;
 } else {
 config.headers.Authorization = `Bearer ${token}`;
 }
 }
 
 if (import.meta.env.DEV) {


 if (config.data) {

 }
 }
 
 // Add start time for execution tracking on the config object itself, NOT as a header (avoids CORS preflight)
 (config as any)._startTime = Date.now();
 
 return config;
 },
 (error) => Promise.reject(error)
);

// ── Response interceptor: global error handling ──────────────────────────────
axiosInstance.interceptors.response.use(
 (response) => {
  return response;
 },
 (error: AxiosError<{ message?: string; status?: string; error?: string }>) => {
 if (import.meta.env.DEV) {








 }

 const status = error.response?.status;
 const serverMsg = error.response?.data?.message || error.response?.data?.error;

 if (error.code === 'ERR_NETWORK' || navigator.onLine === false) {
 showToastOnce('network', () => toast.error('No Internet Connection', { id: 'network' }));
 return Promise.reject(error);
 }

 if (error.code === 'ECONNABORTED') {
 showToastOnce('timeout', () => toast.error('Request Timeout', { id: 'timeout' }));
 return Promise.reject(error);
 }

 if (status === 400) {
  if (!import.meta.env.DEV) showToastOnce('400', () => toast.error(serverMsg || 'Bad Request', { id: '400' }));
 } else if (status === 401) {
   // Backend2 bug: /setting/get incorrectly returns 401 instead of 404 when settings don't exist
   const url = (error.config?.url ?? '').toLowerCase();
   const errorMsg = error.response?.data?.error || error.response?.data?.message || '';
   
   if (url.includes('/setting/get') && errorMsg.includes('Settings Not found')) {
     console.warn('Ignoring 401 from /setting/get due to Backend2 bug');
     return Promise.reject(error);
   }

   // Silently handle 401 — no toast, just redirect to login
   TokenManager.removeToken();
   if (window.location.pathname !== '/login') {
     setTimeout(() => { window.location.href = '/login'; }, 300);
   }
   return Promise.reject(error);
 } else if (status === 403) {
  if (!import.meta.env.DEV) showToastOnce('403', () => toast.error('Unauthorized', { id: '403' }));
 } else if (status === 404) {
 const url = (error.config?.url ?? '').toLowerCase();
 const silentPaths = ['/category/', '/banner/', '/discount/'];
 const isSilent = silentPaths.some((p) => url.includes(p));
 if (!isSilent) {
 showToastOnce(`404-${url}`, () => toast.error('API Not Found', { id: `404-${url}` }));
 }
 } else if (status === 409) {
 showToastOnce('409', () => toast.error(serverMsg || 'Conflict', { id: '409' }));
 } else if (status === 422) {
 showToastOnce('422', () => toast.error(serverMsg || 'Validation Error', { id: '422' }));
 } else if (status === 500) {
 showToastOnce('500', () => toast.error('Server Error', { id: '500' }));
 } else if (status) {
 showToastOnce(`unknown-${status}`, () => toast.error(serverMsg || 'Something went wrong.', { id: `unknown-${status}` }));
 } else {
 showToastOnce('unknown', () => toast.error(serverMsg || 'Something went wrong.', { id: 'unknown' }));
 }

 return Promise.reject(error);
 }
);
