import { useCallback } from 'react';
import { toast } from 'sonner';

const ERROR_MAP: Record<number, { title: string; description: string }> = {
 400: { title: 'Bad Request', description: 'The request could not be processed. Please check your input.' },
 401: { title: 'Session Expired', description: 'Your session has expired. Please log in again.' },
 403: { title: 'Access Denied', description: 'You do not have permission to perform this action.' },
 404: { title: 'Not Found', description: 'The requested resource could not be found.' },
 408: { title: 'Request Timeout', description: 'The request took too long. Please try again.' },
 422: { title: 'Validation Error', description: 'Please check your input and try again.' },
 429: { title: 'Too Many Requests', description: 'Please wait a moment before trying again.' },
 500: { title: 'Server Error', description: 'Something went wrong on our end. Please try again later.' },
 502: { title: 'Service Unavailable', description: 'The server is temporarily unavailable.' },
 503: { title: 'Service Unavailable', description: 'The service is temporarily down. Please try again later.' },
};

const shownErrors = new Set<string>();

export const useErrorHandler = () => {
 const handleError = useCallback((error: any, context?: string) => {
 const status: number | undefined = error?.response?.status;
 const serverMsg: string | undefined = error?.response?.data?.message ?? error?.message;

 // Session expired — handled globally by axios, but guard here too
 if (status === 401) {
 const key = '401';
 if (!shownErrors.has(key)) {
 shownErrors.add(key);
 toast.error('Session Expired', {
 description: 'Please log in again.',
 id: 'session-expired',
 });
 setTimeout(() => shownErrors.delete(key), 5000);
 }
 return;
 }

 if (status && ERROR_MAP[status]) {
 const { title, description } = ERROR_MAP[status];
 const key = `${status}-${context ?? ''}`;
 if (!shownErrors.has(key)) {
 shownErrors.add(key);
 toast.error(title, {
 description: serverMsg ?? description,
 id: key,
 });
 setTimeout(() => shownErrors.delete(key), 5000);
 }
 return;
 }

 // Network error (no response)
 if (!error?.response) {
 const key = 'network-error';
 if (!shownErrors.has(key)) {
 shownErrors.add(key);
 toast.error('Network Error', {
 description: 'Please check your internet connection.',
 id: key,
 });
 setTimeout(() => shownErrors.delete(key), 5000);
 }
 return;
 }

 // Catch-all
 const key = `generic-${context ?? 'error'}`;
 if (!shownErrors.has(key)) {
 shownErrors.add(key);
 toast.error(context ? `Error in ${context}` : 'Something Went Wrong', {
 description: serverMsg ?? 'An unexpected error occurred. Please try again.',
 id: key,
 });
 setTimeout(() => shownErrors.delete(key), 5000);
 }
 }, []);

 return { handleError };
};
