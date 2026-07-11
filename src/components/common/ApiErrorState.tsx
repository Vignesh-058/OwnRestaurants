import { Button } from '@/components/ui/button';
import { WifiOff, AlertCircle } from 'lucide-react';

interface ApiErrorStateProps {
 message?: string;
 onRetry?: () => void;
 isNetworkError?: boolean;
}

export const ApiErrorState = ({ message, onRetry, isNetworkError }: ApiErrorStateProps) => {
 return (
 <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center animate-in fade-in duration-500">
 <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
 {isNetworkError ? <WifiOff className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
 </div>
 <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
 {isNetworkError ? 'Connection Error' : 'Data Retrieval Failed'}
 </h3>
 <p className="text-muted-foreground max-w-sm mb-8">
 {message || 'We could not fetch the required data. Please check your connection and try again.'}
 </p>
 {onRetry && (
 <Button onClick={onRetry} variant="outline" className="rounded-full">
 Try Again
 </Button>
 )}
 </div>
 );
};
