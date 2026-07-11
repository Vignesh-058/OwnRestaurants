import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => {
 return (
 <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center text-muted-foreground animate-in fade-in duration-500">
 <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
 <p className="text-sm font-medium">{message}</p>
 </div>
 );
};
