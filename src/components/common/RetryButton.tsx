import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface RetryButtonProps {
 onRetry: () => void;
 isLoading?: boolean;
 label?: string;
 variant?: 'default' | 'outline' | 'ghost';
 size?: 'default' | 'sm' | 'lg';
 className?: string;
}

export const RetryButton = ({
 onRetry,
 isLoading = false,
 label = 'Try Again',
 variant = 'outline',
 size = 'default',
 className,
}: RetryButtonProps) => (
 <Button
 variant={variant}
 size={size}
 className={cn('rounded-full gap-2', className)}
 onClick={onRetry}
 disabled={isLoading}
 aria-label="Retry"
 >
 {isLoading
 ? <Loader2 className="h-4 w-4 animate-spin" />
 : <RefreshCw className="h-4 w-4" />}
 {label}
 </Button>
);
