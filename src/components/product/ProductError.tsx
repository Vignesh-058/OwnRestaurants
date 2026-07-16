import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductErrorProps {
 onRetry: () => void;
}

export const ProductError = ({ onRetry }: ProductErrorProps) => {
 return (
 <div className="w-full flex flex-col items-center justify-center py-32 px-4 text-center bg-background">
 <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
 <AlertCircle className="h-12 w-12 text-red-500" />
 </div>
 <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
 <p className="text-muted-foreground text-lg mb-8 max-w-md">
 We couldn't load the store data. Please try again.
 </p>
 <Button 
 onClick={onRetry}
 size="lg"
 className="rounded-full px-8 bg-info hover:bg-info text-white font-bold shadow-md hover:-translate-y-0.5 transition-all duration-300"
 >
 Retry
 </Button>
 </div>
 );
};
