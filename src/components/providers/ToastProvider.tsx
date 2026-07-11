import { Toaster } from 'sonner';

export const ToastProvider = () => (
 <Toaster
 position="top-right"
 richColors
 closeButton
 expand={false}
 duration={4000}
 gap={8}
 toastOptions={{
 classNames: {
 toast: 'rounded-2xl shadow-lg border',
 title: 'font-bold text-sm',
 description: 'text-xs text-muted-foreground',
 closeButton: 'rounded-full',
 error: 'border-red-200 bg-red-50',
 success: 'border-emerald-200 bg-emerald-50',
 warning: 'border-amber-200 bg-amber-50',
 info: 'border-blue-200 bg-blue-50',
 },
 }}
 />
);
