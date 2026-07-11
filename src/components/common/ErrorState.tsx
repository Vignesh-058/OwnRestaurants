import { AlertCircle, WifiOff, ServerCrash, ShieldAlert, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type ErrorVariant = 'generic' | 'network' | 'server' | 'auth' | 'notfound' | 'timeout';

interface ErrorStateProps {
 variant?: ErrorVariant;
 title?: string;
 description?: string;
 onRetry?: () => void;
 retryLabel?: string;
 className?: string;
 minimal?: boolean;
}

const VARIANTS: Record<ErrorVariant, { icon: any; title: string; description: string; color: string }> = {
 generic: {
 icon: AlertCircle,
 title: 'Something Went Wrong',
 description: 'An unexpected error occurred. Please try again.',
 color: 'text-red-500',
 },
 network: {
 icon: WifiOff,
 title: 'No Internet Connection',
 description: 'Please check your network connection and try again.',
 color: 'text-amber-500',
 },
 server: {
 icon: ServerCrash,
 title: 'Server Error',
 description: 'We\'re having trouble connecting to our servers. Please try again later.',
 color: 'text-red-500',
 },
 auth: {
 icon: ShieldAlert,
 title: 'Session Expired',
 description: 'Your session has expired. Please log in again.',
 color: 'text-orange-500',
 },
 notfound: {
 icon: AlertCircle,
 title: 'Not Found',
 description: 'The resource you are looking for could not be found.',
 color: 'text-muted-foreground',
 },
 timeout: {
 icon: Clock,
 title: 'Request Timeout',
 description: 'The request took too long. Please check your connection and try again.',
 color: 'text-amber-500',
 },
};

export const ErrorState = ({
 variant = 'generic',
 title,
 description,
 onRetry,
 retryLabel = 'Try Again',
 className,
 minimal = false,
}: ErrorStateProps) => {
 const cfg = VARIANTS[variant];
 const Icon = cfg.icon;

 if (minimal) {
 return (
 <div className={cn('flex flex-col items-center gap-3 py-8 text-center', className)}>
 <Icon className={cn('h-8 w-8', cfg.color)} />
 <p className="text-sm text-muted-foreground">{title ?? cfg.title}</p>
 {onRetry && (
 <Button variant="outline" size="sm" className="rounded-full" onClick={onRetry}>
 {retryLabel}
 </Button>
 )}
 </div>
 );
 }

 return (
 <div className={cn(
 'flex flex-col items-center justify-center p-10 text-center rounded-3xl border-2 border-dashed bg-white/50 space-y-5',
 className
 )}>
 <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
 <Icon className={cn('h-8 w-8', cfg.color)} />
 </div>
 <div>
 <h3 className="text-xl font-bold mb-2">{title ?? cfg.title}</h3>
 <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
 {description ?? cfg.description}
 </p>
 </div>
 {onRetry && (
 <Button className="rounded-full px-8 gap-2" onClick={onRetry}>
 {retryLabel}
 </Button>
 )}
 </div>
 );
};
