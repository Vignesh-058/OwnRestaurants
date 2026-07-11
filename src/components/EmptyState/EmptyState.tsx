import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
 title?: string;
 message?: string;
 actionLabel?: string;
 onAction?: () => void;
}

export const EmptyState = ({
 title = 'No products available',
 message = 'Check back later for new items.',
 actionLabel = 'Refresh',
 onAction,
}: EmptyStateProps) => {
 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center justify-center py-20 px-4 text-center w-full"
 >
 <div className="bg-primary/5 p-6 rounded-full mb-6">
 <PackageX className="w-16 h-16 text-primary/40" />
 </div>
 <h2 className="text-2xl font-bold mb-2 tracking-tight">{title}</h2>
 <p className="text-muted-foreground mb-8 max-w-md">{message}</p>
 
 {onAction && (
 <Button onClick={onAction} size="lg" className="rounded-full px-8 shadow-sm hover:shadow-floating transition-all">
 {actionLabel}
 </Button>
 )}
 </motion.div>
 );
};
