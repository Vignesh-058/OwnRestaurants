import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Smart retry: never retry 4xx client errors, retry 5xx up to 2 times.
 * Network errors (no response) also get 2 retries.
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
 const status = (error as any)?.response?.status;

 // Never retry client errors
 if (status && status >= 400 && status < 500) return false;

 // Retry server errors and network errors up to 2 times
 return failureCount < 2;
};

const queryClient = new QueryClient({
 defaultOptions: {
 queries: {
 retry: shouldRetry,
 retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // exponential back-off
 refetchOnWindowFocus: false,
 refetchOnReconnect: false,
 staleTime: 1000 * 60 * 5, // 5 minutes
 gcTime: 1000 * 60 * 30, // 30 minutes
 },
 mutations: {
 retry: 0, // mutations should never auto-retry
 },
 },
});

// eslint-disable-next-line react-refresh/only-export-components
export const getQueryClient = () => queryClient;

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
 <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
