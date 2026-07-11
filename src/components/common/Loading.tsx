
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoadingProps {
 className?: string;
 size?: number;
 text?: string;
}

export const Loading = ({ className, size = 24, text }: LoadingProps) => {
 return (
 <div className={cn("flex flex-col items-center justify-center p-4 space-y-4", className)}>
 <Loader2 className="animate-spin text-primary" size={size} />
 {text && <p className="text-sm text-muted-foreground">{text}</p>}
 </div>
 );
};
